
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';
import { SHA256 } from 'crypto-js';

import '../pages/home.css';
import { checkUserExists } from '../utils/dbInteractionFunctions.js';
import { getLastSubmitted } from '../utils/dbInteractionFunctions.js';

function CellPhoneLogin() {
  const navigate = useNavigate();

  const [cellPhoneInput, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserId(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const timestamp = new Date().getTime();

    const lowerEmail = cellPhoneInput.toLowerCase()
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidCellNumber = emailPattern.test(lowerEmail);
    const hashedCellNumber = SHA256(lowerEmail).toString();

    if (!isValidCellNumber) {
      console.error('Invalid email number');
      alert("Por favor ingrese un mail válido.")
      setUserId('')
      setIsLoading(false);
      return;
    }

    const userExists = await checkUserExists(hashedCellNumber);

    if (userExists) {
      alert("Bienvenidx nuevamente!")
      const last_submitted = await getLastSubmitted(hashedCellNumber)
      console.log('User already exists');
      navigate('/experiment', { state: { userId: hashedCellNumber, currentTrial: last_submitted + 1} });

    } else {
      console.log('Add new user: User does not exist');
      navigate('/instructions', { state: { userId: hashedCellNumber, currentTrial: 0 } });

      try {

        await axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/addUser`, {
          userId: hashedCellNumber,
          loginTime: timestamp
        });
        navigate('/instructions', { state: { userId: hashedCellNumber, currentTrial: 0 } })
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='input-button-container'>
        <input
          style={{ textAlign: 'center' }}
          type="email"
          value={cellPhoneInput}
          onChange={handleInputChange}
          placeholder="Ingresa tu email"
          className='Input'
        />
        <div className='button-container' >
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            <button type="submit" className='SubmitButton'>Ingresar</button>
          )}
        </div>
      </form>

      <div className='Center'>
        Solo guardaremos este dato encriptado como identificador.
      </div>
    </div>
  );

}

export default CellPhoneLogin;


