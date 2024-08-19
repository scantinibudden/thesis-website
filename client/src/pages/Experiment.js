// Paula's imports
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import './experiment.css'

import NextButton from '../components/NextButton.js';

// My imports
import data from '../data_dev.json';
import catch_data from '../catch.json';

import WordSelector from '../components/WordSelector.js';
import Loader from "react-spinners/ClockLoader.js";

import { generateDataset } from '../utils/experimentMapper.js';
import { getSeed } from '../utils/getSeed.js';
import LogosHeader from '../components/LogosHeader.js';

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
  const seed = getSeed(userId)
  const realTrialsLength = 3
  const catchLength = 1
  const stepLength = realTrialsLength + catchLength
  const [dataset, setDataset] = useState(generateDataset(data, catch_data, seed, realTrialsLength, catchLength))

  const [progress, setProgress] = useState(parseInt(sessionStorage.getItem('progress')) || 1);

  // My states
  const dataset_length = dataset.length
  const [barProgress, setBarProgress] = useState((parseInt(sessionStorage.getItem('barProgress')) || 0) % stepLength)
  const [maxProgress, setMaxProgress] = useState(Math.min(stepLength, dataset_length - progress))


  const [exp_index, setExperimentIndex] = useState(0);
  const [exp, setExperiment] = useState(dataset[exp_index]);
  const wordSelectorRef = useRef(null);

  const [loading, setLoading] = useState(false)

  const [startTrial, setStartTrial] = useState(false)

  const divRef = useRef(null)
  const [height, setHeight] = useState('400px');

  // Facu

  // update next image 
  useEffect(() => {
    console.log(exp_index)
    setExperiment(dataset[exp_index]);
  }, [exp_index]);

  useEffect(() => {
    if (divRef.current) {
      console.log(divRef.current.offsetHeight)
      setHeight(`${divRef.current.offsetHeight}px`);
    }
  }, []);

  const submitRating = async (timestamp) => {
    if (!navigator.onLine) {
      alert('No se pudo enviar la selección. Por favor, revisa tu conexión a internet.');
      return;
    }

    axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/addTrial`, {
      userId: userId,
      trialNumber: exp_index,
      wordID: exp.wordID,
      meaningID: exp.meaningID,
      word: exp.word,
      context: exp.context,
      answers: wordSelectorRef.current.result(),
      wordOrder: exp.words,
      lastTrialSubmitted: exp_index,
      submitTime: timestamp,
    }).then(response => {
      console.log('Selection added successfully!');
    }).catch(error => {
      console.error('Error adding selection:', error);
    });

    const new_exp_index = exp_index + 1
    const next_change_step = new_exp_index % stepLength === 0

    if (!next_change_step) {
      setLoading(true)
    }

    setTimeout(() => {
      setLoading(false)
    }, 1500);

    setProgress(prevProgress => {
      const updatedProgress = prevProgress + 1;
      return updatedProgress > maxProgress ? maxProgress : updatedProgress;
    });
    setBarProgress(prevBarProgress => {
      const updatedProgress = prevBarProgress + 1
      return updatedProgress % stepLength === 0 ? 0 : updatedProgress;
    })

    if (next_change_step && dataset_length - new_exp_index < stepLength) {
      setMaxProgress(dataset_length - new_exp_index)
    }
    setStartTrial(new_exp_index % stepLength === 0)
    sessionStorage.setItem('progress', progress);
    setExperimentIndex(new_exp_index);
    sessionStorage.setItem('exp_index', new_exp_index);
  };


  const handleNextClick = async () => {
    if (wordSelectorRef) {
      // !Repeated Code
      if (!wordSelectorRef.current.isFull()) {
        alert('Selecciona todas las palabras antes de continuar');
        return;
      }
      const timestamp = new Date().getTime();
      submitRating(timestamp);
    }
  }

  const handleFinishClick = async () => {
    navigate('/thank-you');
  }

  const handleExitClick = async () => {
    if (!wordSelectorRef.current.isFull()) {
      alert('Selecciona todas las palabras antes de continuar');
      return;
    }
    const timestamp = new Date().getTime();
    submitRating(timestamp);
    // !Es temporal
    sessionStorage.setItem('progress', 0);
    navigate('/thank-you');
  }

  const handleNextStep = async () => {
    setStartTrial(false)
  }

  return (
    <div className='container'>
      <LogosHeader />
      {
        startTrial ? (
          <div className='next-step-container'>
            <p className='BlueSubHeader'>¡Felicitaciones llegaste al final de esta etapa! <br />
              Puedes elegir continuar con el experimento o finalizarlo en este momento.</p>

            <div className='step-buttons-container'>
              <div className='inner-button-container'>
                <div className='button-container'>
                  <button onClick={handleNextStep} className='StepButton' style={{ backgroundColor: 'green' }}>Continuar</button>
                </div>
              </div>
              <div className='inner-button-container'>
                <div className='button-container'>
                  <button onClick={handleFinishClick} className='StepButton' style={{ backgroundColor: 'red' }}>Terminar</button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div>
            <div className='BlueSubHeader'>
              Experimento
            </div>

            <div className='experiment-container'>
              {
                !loading ? (
                  <div ref={divRef}>
                    <WordSelector ref={wordSelectorRef} exp={exp} />
                    <div className='inner-button-container'>
                      {(exp_index < dataset_length - 1) ? (
                        <NextButton handleOnClick={handleNextClick} />
                      ) : (<button onClick={handleExitClick} className='SubmitButton'>Salir del experimento</button>)
                      }
                    </div>
                  </div>
                ) : (
                  <div class="loader-container" style={{height:height}}>
                    <Loader
                      color={'grey'}
                      loading={true}
                      size={150}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                )
              }
            </div>
            <div className='progress-bar-container'>
              <ProgressBar value={barProgress} max={maxProgress} className='progress' />
            </div>
          </div>
        )
      }
    </div>

  );
}

export default ExperimentCompareImages;