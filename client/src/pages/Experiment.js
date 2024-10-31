// Paula's imports
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import './experiment.css'

import NextButton from '../components/NextButton.js';

// My imports
import data from '../data.json'

import WordFiller from '../components/WordFiller.js';
import Loader from "react-spinners/PulseLoader.js";

import LogosHeader from '../components/LogosHeader.js';
import Contact from '../components/Contact.js';

function getFillInWords(n) {
  let word_idx = [];
  let start = Math.floor(Math.random() * 30); // Random start between 0 and 29
  
  for (let i = start; i < n;) {
      word_idx.push(i);
      i += 27 + Math.floor(Math.random() * 7); // Random increment between 27 and 33
  }
  
  return word_idx;
}

function RunExperiment() {
  const storeInterval = 5

  const navigate = useNavigate();
  const location = useLocation();
  const now = () => {
    return new Date().getTime()
  }

  const { userId, trials } = location.state;
  
  const stored_exp_index = parseInt(sessionStorage.getItem('exp_index')) || 0;
  const currentTrial = (location.state.currentTrial || 0) > stored_exp_index ? location.state.currentTrial : stored_exp_index;
  const idx = currentTrial || 0;

  function getStory() {
    if (trials.length > 0){
      const trial = trials[trials.length-1]
      if (!trial.hasFinished){
        const exp = {
          "storyName": trial.trialName,
          "story": data[trial.trialName],
          "fillInWords": trial.missingWordIds,
          "guesses": trial.guessedWords
        }

        return exp;
      }
    }
    const keys = Object.keys(data);
    const randomIndex = Math.floor(Math.random() * keys.length);
    const randomStoryName = keys[randomIndex];
  
    const exp = {
      "storyName": randomStoryName,
      "story": data[randomStoryName],
      "fillInWords": getFillInWords(data[randomStoryName].length),
      "guesses": Array(0)
    }
    
    return exp
  }

  const [exp_index, setExperimentIndex] = useState(idx);
  const [startTime, setStartTime] = useState(now())
  const [exp, setExperiment] = useState(getStory());

  let currentGuesses = exp.guesses.length

  // States
  const wordFillerRef = useRef(null);

  const [loading, setLoading] = useState(false)
  const [inTrial, setInTrial] = useState(true)

  const divRef = useRef(null)

  // Store results
  const submitWords = async (timestamp, hasFinished) => {
    if (!navigator.onLine) {
      alert('No se pudo enviar la selección. Por favor, revisa tu conexión a internet.');
      return;
    }

    axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/addTrial`, {
      userId: userId,
      trialId: exp_index,
      trialName: exp["storyName"],
      startTime: startTime,
      submitTime: timestamp,
      missingWordIds: wordFillerRef.current.state.missingWordsIdx,
      missingWords: wordFillerRef.current.state.missingWords,
      guessedWords: wordFillerRef.current.state.guesses,
      lastTrialSubmitted: exp_index,
      hasFinished: hasFinished
    }).then(response => {
      console.log('Words added successfully!');
    }).catch(error => {
      console.error('Error adding words:', error);
    });
  };

  const handleContinueClick = async () => {
    if (wordFillerRef) {
      if (!wordFillerRef.current.isFinished()) {
        alert('Termina la historia antes de continuar');
        return;
      }
      const timestamp = now();
      submitWords(timestamp, true);
      const new_exp_index = exp_index + 1

      setLoading(true)

      setTimeout(() => {
        setLoading(false)
        setStartTime(now())
      }, 1500);

      setInTrial(false)
      setExperimentIndex(new_exp_index);
      sessionStorage.setItem('exp_index', new_exp_index);
    }
  }

  const handleFinishClick = async () => {
    sessionStorage.setItem('exp_index', 0);
    navigate('/thank-you');
  }

  const handleAnotherClick = async () => {
    setExperiment(getStory())

    setInTrial(true)
    setStartTime(now())
  }

  const newGuess = async () => {
    currentGuesses++
    if (currentGuesses % storeInterval === 0) {
      const timestamp = now();
      submitWords(timestamp, false)
    }
    console.log(wordFillerRef.guesses)
    console.log(wordFillerRef.guessTimestamps)
  }

  return (
    <div className='container'>
      <LogosHeader />
      {
        !inTrial && !loading ? (
          <div className='next-step-container'>
            <div className='BlueSubHeader'>¡Felicitaciones llegaste al final de esta etapa! </div>
            <p className="continue-message">
              Puedes elegir continuar con el experimento o finalizarlo en este momento
            </p>
            <div className='step-buttons-container'>
              <div className='inner-button-container'>
                <div className='button-container'>
                  <button onClick={handleAnotherClick} className='StepButton'>Continuar</button>
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
                    <WordFiller ref={wordFillerRef} exp={exp} observer={newGuess}/>
                    <div className='inner-button-container'>
                        <NextButton handleOnClick={handleContinueClick} />
                    </div>
                  </div>
                ) : (
                  <div class="loader-container" style={{ height: '400px' }}>
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
          </div >
        )
      }
    </div >

  );
}

export default RunExperiment;