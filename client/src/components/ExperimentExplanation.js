import '../pages/home.css';

import laboratoryLogo from '../assets/liaa-logo.png';

// TODO: Add UBA logo

function ExperimentExplanation() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', }}>
      <p className='experiment-explanation'>
        Para ello te mostraremos una oración con una palabra resaltada y una lista de palabras. Necesitamos que elijas las tres palabras que mejor se relacionen con la palabra resaltada.
      </p>
      <div className='image-container-home'>
        <img src={laboratoryLogo} alt="Logo del Laboratorio de Inteligencia Artifical Aplicada UBA" ></img>
      </div>
      <p className='experiment-explanation'>
        Podes realizar este experimento desde cualquier dispositivo y te llevará XXX minutos completarlo.
      </p>
    </div>
  );
};

export default ExperimentExplanation;