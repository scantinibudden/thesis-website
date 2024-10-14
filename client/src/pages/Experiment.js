// Paula's imports
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import './experiment.css'

import NextButton from '../components/NextButton.js';

// My imports
import data from '../data.json';
import catch_data from '../catch.json';
import result_data from '../result_data.json';


import WordSelector from '../components/WordSelector.js';
import Loader from "react-spinners/PulseLoader.js";

import { generateDataset, processJson } from '../utils/experimentMapper.js';
import { getSeed } from '../utils/getSeed.js';
import LogosHeader from '../components/LogosHeader.js';
import Contact from '../components/Contact.js';


function ProgressBar({ value, max }) {
  const percentage = Math.min((value / max) * 100, 99);

  return (
    <div className="progress-bar-inner-container">
      <progress value={value} max={max}></progress>
      <span className="progress-bar-text">{`${percentage.toFixed(0)}%`}</span>
    </div>
  );
}


function RunExperiment() {
  // Paula's states
  const navigate = useNavigate();
  const location = useLocation();
  const now = () => {
    return new Date().getTime()
  }

  const { userId } = location.state;
  const { isNew } = location.state;
  const stored_exp_index = parseInt(sessionStorage.getItem('exp_index')) || 0;
  const currentTrial = (location.state.currentTrial || 0) > stored_exp_index ? location.state.currentTrial : stored_exp_index;
  const seed = getSeed(userId)
  const realTrialsLength = 10
  const catchLength = 2
  const stepLength = realTrialsLength + catchLength
  const dataset = isNew > 0 ? processJson(data,catch_data,result_data[seed%1000]) : generateDataset(data, catch_data, seed, realTrialsLength, catchLength)
  

  const dataset_length = dataset.length
  const catch_length = catch_data.length

  const idx = currentTrial || 0
  const [exp_index, setExperimentIndex] = useState(idx);

  if (idx >= dataset_length + catch_length) {
    alert("Ya completaste el experimento, gracias por participar")
    navigate('/thank-you');
  }

  const [startTime, setStartTime] = useState(now())

  const [exp, setExperiment] = useState(dataset[exp_index]);

  // My states
  
  // const [barProgress, setBarProgress] = useState((parseInt(sessionStorage.getItem('barProgress')) || currentTrial) % stepLength)
  const [barProgress, setBarProgress] = useState(currentTrial % stepLength)
  const [maxProgress, setMaxProgress] = useState(Math.min(stepLength, dataset_length - exp_index + 1))

  

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
      setHeight(`${divRef.current.offsetHeight}px`);
    }
  }, []);

  const submitRating = async (timestamp, hasFinished) => {
    if (!navigator.onLine) {
      alert('No se pudo enviar la selección. Por favor, revisa tu conexión a internet.');
      return;
    }

    axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/addTrial`, {
      userId: userId,
      trialNumber: exp_index,
      wordID: exp.wordID,
      meaningID: exp.meaningID + 1,
      word: exp.word,
      context: exp.context,
      answers: wordSelectorRef.current.result(),
      wordOrder: exp.words,
      lastTrialSubmitted: exp_index,
      startTime: startTime,
      submitTime: timestamp,
      hasFinished: hasFinished,
    }).then(response => {
      console.log('Selection added successfully!');
    }).catch(error => {
      console.error('Error adding selection:', error);
    });

    const new_exp_index = exp_index + 1
    const next_change_step = new_exp_index % stepLength === 0

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setStartTime(now())
    }, 1500);

    setBarProgress(prevBarProgress => {
      const updatedProgress = prevBarProgress + 1
      return updatedProgress % stepLength === 0 ? 0 : updatedProgress;
    })

    if (next_change_step && dataset_length - new_exp_index < stepLength) {
      setMaxProgress(dataset_length - new_exp_index)
    }
    setStartTrial(new_exp_index % stepLength === 0)
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
      const timestamp = now();
      submitRating(timestamp, false);
    }
  }

  const handleFinishClick = async () => {
    sessionStorage.setItem('exp_index', 0);
    navigate('/thank-you');
  }

  const handleExitClick = async () => {
    if (!wordSelectorRef.current.isFull()) {
      alert('Selecciona todas las palabras antes de continuar');
      return;
    }
    const timestamp = now();
    submitRating(timestamp, true);
    // !Es temporal
    sessionStorage.setItem('exp_index', 0);
    navigate('/thank-you');
  }

  const handleNextStep = async () => {
    setStartTrial(false)
    setStartTime(now())
  }

  return (
    <div className='container'>
      <LogosHeader />
      {
        startTrial && !loading ? (
          <div className='next-step-container'>
            <div className='BlueSubHeader'>¡Felicitaciones llegaste al final de esta etapa! </div>
            <p className="continue-message">
              Puedes elegir continuar con el experimento o finalizarlo en este momento
            </p>
            <div className='step-buttons-container'>
              <div className='inner-button-container'>
                <div className='button-container'>
                  <button onClick={handleNextStep} className='StepButton'>Continuar</button>
                </div>
              </div>
              <div className='inner-button-container'>
                <div className='button-container'>
                  <button onClick={handleFinishClick} className='StepButton' style={{ backgroundColor: 'var(--pale-cyan)', color: 'var(--deep-red)', border: 'solid', borderColor: 'var(--deep-red)' }}>Terminar</button>
                </div>
              </div>
            </div>
            <Contact />
          </div>
        ) : (
          <div className='center-items'>
            <div>
            </div>

            <div className='experiment-container'>
              {
                !loading ? (
                  <div ref={divRef} style={{ width: '100%', marginTop: '10px' }}>
                    <WordSelector ref={wordSelectorRef} exp={exp} />
                    <div className='inner-button-container'>
                      {(exp_index < dataset_length - 1) ? (
                        <NextButton handleOnClick={handleNextClick} />
                      ) : (<button onClick={handleExitClick} className='SubmitButton'>Salir del experimento</button>)
                      }
                    </div>
                  </div>
                ) : (
                  <div class="loader-container" style={{ height: height }}>
                    <Loader
                      color={'var(--deep-red)'}
                      loading={true}
                      size={40}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                      speedMultiplier={0.5}
                    />
                  </div>
                )
              }
            </div>
            {
              !startTrial ? (
                <div className='progress-bar-container'>
                  <ProgressBar value={barProgress} max={maxProgress} className='progress' />
                </div>
              ) : (
                <div></div>
              )
            }
          </div >
        )
      }
    </div >

  );
}

export default RunExperiment;