import '../pages/experiment.css';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ThankYouMessage() {
  useEffect(() => {
    window.history.pushState(null, null, '/');
  }, []);

  return (
    <div>
      <h1 className='ThankYou'> ¡Gracias por participar! </h1>
    </div>
  );
}
