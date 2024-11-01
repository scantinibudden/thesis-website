import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogosHeader from '../components/LogosHeader.js';
import axios from 'axios';

import WordFiller from '../components/WordFiller.js';

import './experiment.css';


function Tutorial() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = location.state;
  const wordSelectorRef = useRef(null);
  const exp = {
    "storyName": 'Tutorial Story',
    "story": ['Ayer', 'le', 'di', 'de', 'comer', 'a', 'mi', 'perro', 'y', 'él', 'se', 'puso', 'muy', 'feliz.'],
    "fillInWords": [7,13],
    "guesses": Array(0),
    "guessTimestamps": Array(0)
  }

  const handleGoToBreak = async () => {
    if (wordSelectorRef != null && wordSelectorRef.current.isFinished()) {
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
      navigate('/experiment', { state: location.state });
    } else {
      alert("Por favor, termine la historia antes de continuar")
    }
  }

  return (
    <div className='container'>
      <LogosHeader />
      <div className='BlueSubHeader'>
        Fase de prueba
      </div>

      <div style={{width:'100%', marginTop:'10px'}}>
        <div className='experiment-container'>
          <div className='inner-star-rating-container' style={{'width':'100%'}}>
            <WordFiller ref={wordSelectorRef} exp={exp}/>
          </div>
          <div className='inner-button-container'>
            <div className='button-container'>
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                <button onClick={handleGoToBreak} className='SubmitButton' style={{ display: 'none', marginBottom: '10%'}}>Siguiente</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;