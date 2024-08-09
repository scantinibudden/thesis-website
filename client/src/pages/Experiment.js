// Paula's imports
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import './experiment.css'

import NextButton from '../components/NextButton.js';

// My imports
import experiments from '../data.json';
import WordSelector from '../components/WordSelector.js';
import Loader from "react-spinners/ClockLoader.js";


function ProgressBar({ value, max }) {
  const percentage = Math.min((value / max) * 100, 99);

  return (
    <div className="progress-bar-inner-container">
      <progress value={value} max={max}></progress>
      <span className="progress-bar-text">{`${percentage.toFixed(0)}%`}</span>
    </div>

  );
}


function ExperimentCompareImages() {
  // Paula's states
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state;

  const [progress, setProgress] = useState(parseInt(sessionStorage.getItem('progress')) || 1);
  const maxProgress = experiments.length;

  // My states
  const [exp_index, setExperimentIndex] = useState(0);
  const [exp, setExperiment] = useState(experiments[exp_index]);
  const wordSelectorRef = useRef(null);

  const [loading, setLoading] = useState(false)

  // Facu

  // update next image 
  useEffect(() => {
    console.log(exp_index)
    setExperiment(experiments[exp_index]);
  }, [exp_index]);

  const submitRating = async (timestamp) => {
    if (!navigator.onLine) {
      alert('No se pudo enviar la calificación. Por favor, revisa tu conexión a internet.');
      return;
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1500);
    try {
      const response = await axios.post('https://experiment-webpage-vyv5.vercel.app/api/addTrial', {
        userId: userId,
        trialNumber: exp_index, //!Change 
        wordID: exp.id,
        meaningID: 0, // !Change
        word: exp.word,
        context: exp.meanings[0].context, // !Change
        answers: wordSelectorRef.current.result(), // !Change
        wordOrder: exp.meanings[0].words, 
        lastTrialSubmitted: exp_index,
        submitTime: timestamp, 
      });
      console.log('Rating added successfully!');
      wordSelectorRef.current.reset();
      //setExperiment(null);
    } catch (error) {
      console.error('Error adding rating:', error);
    }
    setProgress(prevProgress => {
      const updatedProgress = prevProgress + 1;
      return updatedProgress > maxProgress ? maxProgress : updatedProgress;
    });
    sessionStorage.setItem('progress', progress);
    setExperimentIndex(exp_index + 1);
    sessionStorage.setItem('exp_index', exp_index + 1);
  };


  const handleNextClick = async () => {
    if (wordSelectorRef) {
      // !Repeated Code
      if (!wordSelectorRef.current.isFull()) {
        alert('Ingresa una calificación antes de continuar');
        return;
      }
      const timestamp = new Date().getTime();
      submitRating(timestamp);
    }
  }

  const handleExitClick = async () => {
    if (!wordSelectorRef.current.isFull()) {
      alert('Ingresa una calificación antes de continuar');
      return;
    }
    const timestamp = new Date().getTime();
    submitRating(timestamp);
    // !Es temporal
    sessionStorage.setItem('progress', 0);
    navigate('/thank-you');
  }

  return (
    <div>
      <div className='BlueSubHeader'>
        Experimento
      </div>

      <div className='experiment-explanation'>
        Selecciona las tres palabras que creas que mejor se relacionan con la palabra resaltada.
      </div>

      <div className='experiment-container'>
        {
          !loading ? (
            <div>
              <WordSelector ref={wordSelectorRef} exp={exp} />
            </div>
          ) : (<Loader
            color={'grey'}
            loading={true}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />) // TODO: spinner
        }

        <div className='inner-button-container'>
          {(progress < maxProgress) ? (
            <NextButton handleOnClick={handleNextClick} />
          ) : (<button onClick={handleExitClick} className='SubmitButton'>Salir del experimento</button>)
          }
        </div>
      </div>
      <div className='progress-bar-container'>
        <ProgressBar value={progress} max={maxProgress} className='progress' />
      </div>
    </div>

  );
}

export default ExperimentCompareImages;