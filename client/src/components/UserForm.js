
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';

import data from '../data.json'

import '../pages/home.css';

function getFillInWords(n) {
  let word_idx = [];
  let start = Math.floor(Math.random() * 30); // Random start between 0 and 29
  
  for (let i = start; i < n;) {
      word_idx.push(i);
      i += 27 + Math.floor(Math.random() * 7); // Random increment between 27 and 33
  }
  
  return word_idx;
}

function UserForm() {
  const navigate = useNavigate();

  const [gender, setGender] = useState('');
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState('');
  const [spanishFirstLanguage, setFirstLang] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const userId = 'banana';

  const handleInputChange = (event) => {
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setAge(24)
    setGender('come find out')
    setCountry('Argentina')
    setFirstLang(false);
    
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/addUser`, {
        userId: userId,
        email: lowerEmail,
        age: age,
        gender: gender,
        country: country,
        firstLang: spanishFirstLanguage,
        loginTime: new Date().getTime()
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
          userId: userId,
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
      
      navigate('/instructions', { state: { userId: userId, currentTrial: 0, trials: trials} });
    } catch (error) {
      console.error('Error submitting data:', error);
      alert("Algo salió mal. Intentá nuevamente");

      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className='input-button-container'>
        {<input
          style={{ textAlign: 'center' }}
          type="email"
          value={emailInput}
          onChange={handleInputChange}
          placeholder="Ingresa tu pais"
          className='Input'
        />}
        {<input
          style={{ textAlign: 'center' }}
          type="email"
          value={emailInput}
          onChange={handleInputChange}
          placeholder="Ingresa tu genero"
          className='Input'
        />}
        {<input
          style={{ textAlign: 'center' }}
          type="email"
          value={emailInput}
          onChange={handleInputChange}
          placeholder="Ingresa tu edad"
          className='Input'
        />}
        {<input
          style={{ textAlign: 'center' }}
          type="email"
          value={emailInput}
          onChange={handleInputChange}
          placeholder="primer idioma esp"
          className='Input'
        />}
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

export default UserForm;