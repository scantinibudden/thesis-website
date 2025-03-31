
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';

import data from '../data.json'

import '../pages/home.css';
import './form.css';

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
  const state = useLocation().state;
  const userId = state.userId;
  const mail = state.email;

  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [residency, setResidency] = useState('');
  const [spanishFirstLanguage, setFirstLang] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAgeChange = (event) => {
    const inputValue = event.target.value;
  
    // Allow only integers
    if (/^\d*$/.test(inputValue)) {
      setAge(inputValue); // Update state only with valid integer input
    } else {
      alert("Solo se permiten numeros en este campo.")
      event.target.value = ''
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleResidencyChange = (event) => {
    setResidency(event.target.value);
  };

  const handleFirstLangChange = (event) => {
    setFirstLang(event.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const timestamp = new Date().getTime()
    
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/addUser`, {
        userId: userId,
        email: mail,
        age: age,
        gender: gender,
        country: country,
        residency:residency,
        firstLang: spanishFirstLanguage,
        loginTime: timestamp
      });

      // Generate Trials
      const storyOrder = []
      let stories = Object.keys(data);
      let priority = ["la lluvia de fuego", "wakefield", "rubí y el lago danzante", "una rosa para emilia", "la salud de los enfermos", "el almohadón de plumas", "la gallina degollada", "el espejo", "ahora debería reírme, si no estuviera muerto", "la canción que cantábamos todos los días"]
      let other = ["buenos aires", "la de la obsesión por la patineta", "el golpe de gracia", "la máscara de la muerte roja", "embarrar la magia", "la noche de los feos", "educar para escalar y bucear", "cómo funciona caminar en la nieve", "las fotografías", "cómo funcionan los bolsillos"]

      for(let i = priority.length-1; i >= 0; i--){
        const randomIndex = Math.floor(Math.random() * priority.length);
        const randomStoryName = priority[randomIndex];

        priority = priority.filter(item => item !== randomStoryName);
        
        storyOrder.push(randomStoryName)
      }

      for(let i = other.length-1; i >= 0; i--){
        const randomIndex = Math.floor(Math.random() * other.length);
        const randomStoryName = other[randomIndex];

        other = other.filter(item => item !== randomStoryName);
        
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
    <form onSubmit={handleSubmit} class='user-form'>
      <div id='fill-in'>
        <div id='personal-fill-in' class='fill-in-row'>
          {<input id='age'
            style={{ textAlign: 'center' }}
            type="text"
            value={age}
            onChange={handleAgeChange}
            placeholder="Ingresa tu edad"
            />}
          {<select id='gender' class='fill-content'
            style={{ textAlign: 'center' }}
            value={gender}
            onChange={handleGenderChange}
            >
            <option value="" disabled>Ingresa tu género</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decir">Prefiero no decir</option>
          </select>}
        </div>
        <div id='geo-fill-in' class='fill-in-row'>
          {<select id='birthplace' class='fill-content'
            style={{ textAlign: 'center' }}
            value={country}
            onChange={handleCountryChange}
          >
            <option value="" disabled>Ingresa tu país de nacimiento</option>
            <option value="Argentina">Argentina</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Chile">Chile</option>
            <option value="Colombia">Colombia</option>
            <option value="Ecuador">Ecuador</option>
            <option value="España">España</option>
            <option value="México">México</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Peru">Peru</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Otro país hispanohablante">Otro país hispanohablante</option>
            <option value="Otro país no hispanohablante">Otro país no hispanohablante</option>
          </select>}
          {<select id='residency' class='fill-content'
            style={{ textAlign: 'center' }}
            value={residency}
            onChange={handleResidencyChange}
          >
            <option value="" disabled>Ingresa tu país de residencia</option>
            <option value="Argentina">Argentina</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Chile">Chile</option>
            <option value="Colombia">Colombia</option>
            <option value="Ecuador">Ecuador</option>
            <option value="España">España</option>
            <option value="México">México</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Peru">Peru</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Otro país hispanohablante">Otro país hispanohablante</option>
            <option value="Otro país no hispanohablante">Otro país no hispanohablante</option>
          </select>}
        </div>
        {<label id='firstlang'
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={spanishFirstLanguage}
            onChange={handleFirstLangChange}
            className="Input"
          />
          ¿Es el español tu primer idioma?
        </label>}
      </div>
      <div className='button-container' >
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          <button type="submit" className='SubmitButton'>Ingresar</button>
        )}
      </div>
    </form>
  );

}

export default UserForm;