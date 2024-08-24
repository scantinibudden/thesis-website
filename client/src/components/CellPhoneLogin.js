
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';
import { SHA256 } from 'crypto-js';

import '../pages/home.css';
import { checkUserExists } from '../utils/dbInteractionFunctions.js';

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

    const cellNumberPattern = /^[0-9]{10}$/;
    const isValidCellNumber = cellNumberPattern.test(cellPhoneInput);
    const hashedCellNumber = SHA256(cellPhoneInput).toString();

    if (!isValidCellNumber) {
      console.error('Invalid cell number');
      alert("El numero de teléfono ingresado no es valido. El número ingresado debe tener 10 dígitos. Por favor, intenta de nuevo.")
      setUserId('')
      setIsLoading(false);
      return;
    }

    const userExists = await checkUserExists(hashedCellNumber);

    if (userExists) {
      console.log('User already exists');
      alert("Bienvenidx nuevamente!")
      navigate('/experiment', { state: { userId: hashedCellNumber, currentTrial: 2 } });
      alert('Ya completaste el experimento! Gracias por tu participación!')

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
          type="tel"
          value={cellPhoneInput}
          onChange={handleInputChange}
          placeholder="Ingresa tu teléfono"
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


