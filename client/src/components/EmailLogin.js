
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { SHA256 } from 'crypto-js';

import '../pages/home.css';
import { checkUserExists } from '../utils/dbInteractionFunctions.js';
import { getUser } from '../utils/dbInteractionFunctions.js';

function EmailLogin() {
  const navigate = useNavigate();

  const [emailInput, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const url = new URL(window.location.href);
  let userId = url.searchParams.get("run-id");

  const handleInputChange = (event) => {
    setUserId(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // const timestamp = new Date().getTime();

    const lowerEmail = emailInput.toLowerCase()
    if (!userId) {
      const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValidEmail = emailPattern.test(lowerEmail);
      
      if (!isValidEmail) {
        console.error('Invalid email number');
        alert("Por favor ingrese un mail válido.")
        setUserId('')
        setIsLoading(false);
        return;
      }
      
      userId = SHA256(lowerEmail).toString();
    }

    try {
      const userExists = await checkUserExists(userId);
      if (userExists) {
        const user = await getUser(userId);
        try {
          console.log('User already exists');
          if (user.is_new)
            navigate('/instructions', { state: { userId: userId, trials: user.trials} });

          else
            navigate('/welcome-back', { state: { userId: userId, trials: user.trials} });
        } catch (error) {
          console.error("Can't get last trial:", error);
          alert("Sucedió un error inesperado, vuelve a intentarlo");
          return;
        }
      } else {
        try {
          console.log('New user');
            navigate('/user-form', { state: { userId: userId, email: lowerEmail} })

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
        {userId ? (''):(<input
          style={{ textAlign: 'center' }}
          type="email"
          value={emailInput}
          onChange={handleInputChange}
          placeholder="Ingresa tu email"
          className='Input'
        />)}
        <div className='button-container' >
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            <button type="submit" className='SubmitButton'>Ingresar</button>
          )}
        </div>
      </form>

      {/* <div className='Center' style={{ padding: '0px' }}>
        Solo guardaremos este dato encriptado como identificador.
      </div> */}
    </div>
  );

}

export default EmailLogin;


