import './home.css';
import ExperimentExplanation from '../components/ExperimentExplanation.js';
import CellPhoneLogin from '../components/CellPhoneLogin.js';
import LogosHeader from '../components/LogosHeader.js';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = location.state;
    
    const handleGoToExperiment = async () => {
        navigate('/experiment', { state: { userId: userId } });
    }

    return (
        <div className='container'>
            <LogosHeader />
            <div className="Header">
                <h1> ¡Ahora si comenzemos! </h1>
            </div>
            <div className='inner-button-container'>
                <div className='button-container'>
                    <button onClick={handleGoToExperiment} className='SubmitButton'>Comenzar con el experimento</button>
                </div>
            </div>
        </div>
    );
}
