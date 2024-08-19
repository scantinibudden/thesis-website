import '../pages/home.css';

import laboratoryLogo from '../assets/liaa-logo.png';

// TODO: Add UBA logo

function ExperimentExplanation() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', }}>
      <p className='experiment-explanation'>
        Podes realizar este experimento desde cualquier dispositivo.
      </p>
    </div>
  );
};

export default ExperimentExplanation;