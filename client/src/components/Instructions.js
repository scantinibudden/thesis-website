import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogosHeader from '../components/LogosHeader.js';
import '../pages/experiment.css';

function Instructions({ title, navigateTo, isFirstTime }) {
    const navigate = useNavigate();
    const location = useLocation();

    const { userId } = location.state;

    const [show0, setShow0] = useState(false)
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)
    const [show4, setShow4] = useState(false)


    useEffect(() => {
        const offset = isFirstTime ? 0 : 1500

        const timer0 = setTimeout(() => setShow0(true), 1000 + offset);
        const timer1 = setTimeout(() => setShow1(true), 3500 + offset);
        const timer2 = setTimeout(() => setShow2(true), 6000 + offset);
        const timer3 = setTimeout(() => setShow3(true), 8500 + offset);
        const timer4 = setTimeout(() => setShow4(true), 11000 + offset);


        return () => {
            clearTimeout(timer0);
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, []);

    const handleGoToTutorial = async () => {
        navigate(navigateTo, { state: { userId: userId } });
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
                        Te vamos a mostrar una oración que contiene una palabra en color naranja.
                    </p>
                )
            }

            {
                show1 && (
                    <p className='experiment-explanation'>
                        Debajo aparecerán 8 palabras.
                    </p>
                )
            }

            {
                show2 && (
                    <p className='experiment-explanation'>
                        Seleccioná las 3 palabras que mejor se relacionen con la palabra en naranja.
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