
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';
import { SHA256 } from 'crypto-js';

import '../pages/home.css';
import { checkUserExists } from '../utils/dbInteractionFunctions.js';
import { getUser } from '../utils/dbInteractionFunctions.js';

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

    const user = await getUser(hashedCellNumber)
    const userExists = user;


    if (userExists) {
      try {
        const last_submitted = user.lastTrialSubmitted
        console.log('User already exists');
        if (user.hasFinished) {
          navigate('/thank-you')
          alert("¡Bienvenido nuevamente!")
          alert("Ya completaste el experimento. ¡Gracias por participar!")
          return  
        }
        navigate('/welcome-back', { state: { userId: hashedCellNumber, currentTrial: last_submitted + 1 } });
      } catch (error) {
        alert("Sucedió un error inesperado, vuelve a intentarlo")
        console.error("Cant get last trial")
        return
      }
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

      <div className='Center' style={{padding:'0px'}}>
        Solo guardaremos este dato encriptado como identificador.
      </div>
    </div>
  );

}

export default CellPhoneLogin;


