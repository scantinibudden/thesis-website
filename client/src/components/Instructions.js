import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogosHeader from '../components/LogosHeader.js';
import '../pages/experiment.css';

function Instructions({ title, navigateTo, isFirstTime }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [show0, setShow0] = useState(false)
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)
    const [show4, setShow4] = useState(false)


    useEffect(() => {
        const offset = isFirstTime ? 0 : 1000

        const timer0 = setTimeout(() => setShow0(true), 1300 + offset);
        const timer1 = setTimeout(() => setShow1(true), 2600 + offset);
        const timer2 = setTimeout(() => setShow2(true), 3900 + offset);
        const timer3 = setTimeout(() => setShow3(true), 5200 + offset);
        const timer4 = setTimeout(() => setShow4(true), 6800 + offset);


        return () => {
            clearTimeout(timer0);
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, []);

    const handleGoToTutorial = async () => {
        navigate(navigateTo, { state: location.state });
    }

    return (
        <div className='container' style={{ maxWidth: '1200px' }}>
            <LogosHeader />
            <div className='BlueSubHeader'>
                {title}
            </div>

            {
                !isFirstTime ? (
                    <div>
                        <p className='experiment-explanation'>
                            Te recordamos las instrucciones.
                        </p>
                    </div>
                ) : (
                    <div></div>
                )
            }

            {
                show0 && (
                    <p className='experiment-explanation'>
                        Te vamos a mostrar una historia con palabras faltantes.
                    </p>
                )
            }

            {
                show1 && (
                    <p className='experiment-explanation'>
                        Solo se mostrara el texto previo a una palabra faltante.
                    </p>
                )
            }

            {
                show2 && (
                    <p className='experiment-explanation'>
                        Escriba la palabra que crees que continua la historia.
                    </p>
                )
            }


            {
                show3 && (
                    <p className='experiment-explanation'>
                        Una vez escrita, se mostrara la palabra correcta junto con el texto que continua la historia.
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