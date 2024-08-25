import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogosHeader from '../components/LogosHeader.js';
import axios from 'axios';

import WordSelector from '../components/WordSelector.js';

import './experiment.css';


function TutorialCompareImages() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state)
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = location.state;
  const wordSelectorRef = useRef(null);
  const exp = {
    "word": "mensaje",
    "context": "Ana le envió un mensaje a Beto.",
    "words": [
      "Comunicación",
      "Chat",
      "Mail",
      "Celular",
      "Computadora",
      "Casilla",
      "Videollamada",
      "Tecnología"
    ]
  }

  const handleGoToBreak = async () => {
    if (wordSelectorRef != null && wordSelectorRef.current.isFull()) {
      setIsLoading(true);
      const timestamp = new Date().getTime();
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/addTutorialTime`, {
          userId: userId,
          tutorialTime: timestamp
        });
      } catch (error) {
        console.error("Error trying to add tutorial time:", error)
      }
      setIsLoading(false);
      navigate('/break', { state: location.state });
    } else {
      alert("Por favor, seleccione 3 palabras antes de continuar")
    }

  }

  return (
    <div className='container'>
      <LogosHeader />
      <div className='BlueSubHeader'>
        Fase de prueba
      </div>

      <div className='experiment-container'>
        <div className='inner-star-rating-container'>
          <WordSelector ref={wordSelectorRef} exp={exp} />
        </div>
        <div className='inner-button-container'>
          <div className='button-container'>
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <button onClick={handleGoToBreak} className='SubmitButton'>Siguiente</button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default TutorialCompareImages;