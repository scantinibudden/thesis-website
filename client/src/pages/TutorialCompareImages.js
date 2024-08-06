import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import WordSelector from '../components/WordSelector.js';

import './experiment.css';


function TutorialCompareImages() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state;
  const wordSelectorRef = useRef(null);
  const exp = {
    "word": "Selección",
    "context": "La selección Argentina ganó la final del mundial contra Francia 4-3 por penales",
    "words": [
      {
        "id": 1,
        "word": "Messi"
      },
      {
        "id": 2,
        "word": "Scalonetta"
      },
      {
        "id": 3,
        "word": "Di Maria"
      },
      {
        "id": 4,
        "word": "Mbappe"
      },
      {
        "id": 5,
        "word": "Qatar"
      },
      {
        "id": 6,
        "word": "Fútbol"
      }
    ]
  }
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [show3, setShow3] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShow1(true), 1000);
    const timer2 = setTimeout(() => setShow2(true), 2000);
    const timer3 = setTimeout(() => setShow3(true), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleGoToExperiment = async () => {
    if (wordSelectorRef != null && wordSelectorRef.current.isFull()) {
      const timestamp = new Date().getTime();
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/addTutorialTime', {
          userId: userId,
          tutorialTime: timestamp
        });
      } catch (error) {
        console.error("Error trying to add tutorial time:", error)
      }
      navigate('/experiment', { state: { userId: userId } });
    } else {
      alert("Por favor, seleccione 3 palabras antes de continuar")
    }

  }

  return (
    <div>
      <div className='BlueSubHeader'>
        Fase de prueba
      </div>

      {
        show1 && (
          <p className='experiment-explanation'>
            Te vamos a mostrar una palabra que va a estar resaltada en un cierto contexto.
          </p>
        )
      }

      {
        show2 && (
          <p className='experiment-explanation'>
            Necesitamos que selecciones las 3 (tres) que mejor se relacionen con la palabra destacada.
          </p>
        )
      }


      {
        show3 && (
          <div className='experiment-container'>
            <div className='inner-star-rating-container'>
              <WordSelector ref={wordSelectorRef} exp={exp} />
            </div>
            <div className='inner-button-container'>
              <div className='button-container'>
                <button onClick={handleGoToExperiment} className='SubmitButton'>Comenzar con el experimento</button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default TutorialCompareImages;