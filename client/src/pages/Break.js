import './home.css';
import LogosHeader from '../components/LogosHeader.js';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleGoToExperiment = async () => {
        navigate('/experiment', { state: location.state });
    }

    return (
        <div className='container'>
            <LogosHeader />
            <div className="Header">
                <h1> ¡Ahora si comencemos! </h1>
            </div>
            <div className='inner-button-container'>
                <div className='button-container'>
                    <button onClick={handleGoToExperiment} className='SubmitButton'>Comenzar con el experimento</button>
                </div>
            </div>
        </div>
    );
}
