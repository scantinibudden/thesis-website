
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';
import { SHA256 } from 'crypto-js';

import data from '../data.json'

import '../pages/home.css';
import { checkUserExists } from '../utils/dbInteractionFunctions.js';
import { getUser } from '../utils/dbInteractionFunctions.js';

function getFillInWords(n) {
  let word_idx = [];
  let start = Math.floor(Math.random() * 30); // Random start between 0 and 29
  
  for (let i = start; i < n;) {
      word_idx.push(i);
      i += 27 + Math.floor(Math.random() * 7); // Random increment between 27 and 33
  }
  
  return word_idx;
}

function EmailLogin() {
  const navigate = useNavigate();

  const [emailInput, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const url = new URL(window.location.href);
  const runId = url.searchParams.get("run-id");

  const handleInputChange = (event) => {
    setUserId(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const timestamp = new Date().getTime();

    const lowerEmail = emailInput.toLowerCase()
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = emailPattern.test(lowerEmail);
    const hashedEmail = SHA256(lowerEmail).toString();

    if (!isValidEmail) {
      console.error('Invalid email number');
      alert("Por favor ingrese un mail válido.")
      setUserId('')
      setIsLoading(false);
      return;
    }


    try {
      const userExists = await checkUserExists(hashedEmail);
      if (userExists) {
        const user = await getUser(hashedEmail);
        try {
          console.log('User already exists');
          if (user.is_new)
            navigate('/instructions', { state: { userId: hashedEmail, trials: user.trials} });

          else
            navigate('/welcome-back', { state: { userId: hashedEmail, trials: user.trials} });
        } catch (error) {
          console.error("Can't get last trial:", error);
          alert("Sucedió un error inesperado, vuelve a intentarlo");
          return;
        }
      } else {
        try {
          console.log('New user');

          await axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/addUser`, {
            userId: hashedEmail,
            loginTime: timestamp
          });

          // Generate Trials
          const storyOrder = []
          let stories = Object.keys(data);

          for(let i = stories.length-1; i >= 0; i--){
            const randomIndex = Math.floor(Math.random() * i);
            const randomStoryName = stories[randomIndex];

            stories = stories.filter(item => item !== randomStoryName);
            
            storyOrder.push(randomStoryName)
          }

          const trials = []

          for(let i = 0; i < storyOrder.length; i++){
            const missingWordIds = getFillInWords(data[storyOrder[i]].length)

            const missingWords = []
            for(let j = 0; j < missingWordIds.length; j++) {
              const missingWordID = missingWordIds[j]
              const missingWord = data[storyOrder[i]][missingWordID]
              missingWords.push(missingWord)
            }

            const newTrial = {
              userId: hashedEmail,
              trialId: i,
              trialName: storyOrder[i],
              submitTime: timestamp,
              missingWordIds: missingWordIds,
              missingWords: missingWords
            }

            trials.push(newTrial)
          }

          axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/addTrials`, {trials: trials})
          .then(response => {
            console.log('Trial added successfully!');
          }).catch(error => {
            console.error('Error adding words:', error);
          });
          
          navigate('/instructions', { state: { userId: hashedEmail, currentTrial: 0, trials: trials} });
        } catch (error) {
          console.error('Error submitting data:', error);
          alert("Algo salió mal. Intentá nuevamente");

          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error getting user:', error);
      alert("Ocurrió un error al obtener la información del usuario. Por favor, inténtalo de nuevo.");
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className='input-button-container'>
        {runId ? (<input
          style={{ textAlign: 'center' }}
          type="email"
          value={emailInput}
          onChange={handleInputChange}
          placeholder="Ingresa tu email"
          className='Input'
        />) : ('')}
        <div className='button-container' >
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            <button type="submit" className='SubmitButton'>Ingresar</button>
          )}
        </div>
      </form>

      <div className='Center' style={{ padding: '0px' }}>
        Solo guardaremos este dato encriptado como identificador.
      </div>
    </div>
  );

}

export default EmailLogin;


