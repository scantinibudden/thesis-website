import {  useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogosHeader from '../components/LogosHeader.js';
import './experiment.css';

function Instructions() {
    const navigate = useNavigate();
    const location = useLocation();

    const { userId } = location.state;

    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)
    const [show4, setShow4] = useState(false)


    useEffect(() => {
        const timer1 = setTimeout(() => setShow1(true), 1000);
        const timer2 = setTimeout(() => setShow2(true), 2000);
        const timer3 = setTimeout(() => setShow3(true), 3000);
        const timer4 = setTimeout(() => setShow4(true), 4000);


        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, []);

    const handleGoToTutorial = async () => {
        navigate('/tutorial', { state: { userId: userId } });
    }

    return (
        <div className='container'>
            <LogosHeader />
            <div className='BlueSubHeader'>
                Instruciones
            </div>

            {
                show1 && (
                    <p className='experiment-explanation'>
                        Te vamos a mostrar una palabra que va a estar resaltada en una oración.
                    </p>
                )
            }

            {
                show2 && (
                    <p className='experiment-explanation'>
                        Necesitamos que selecciones las 3 palabras que pienses que mejor se relacionen con la palabra destacada.
                    </p>
                )
            }


            {
                show3 && (
                    <p className='experiment-explanation'>
                        Una vez seleccionadas, pulsa el boton de Siguiente.
                    </p>
                )
            }

            {
                show4 && (
                    <div className='inner-button-container'>
                        <div className='button-container'>
                            <button onClick={handleGoToTutorial} className='SubmitButton'>¡Entendido!</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default Instructions;