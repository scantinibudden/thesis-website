import '../pages/experiment.css';
import { useEffect } from 'react';

export default function ThankYouMessage() {
  useEffect(() => {
    window.history.pushState(null, null, '/');
    window.history.pushState(null, null, '/thank-you');
  }, []);

  return (
    <div>
      <h1 className='ThankYou'> ¡Gracias por participar! </h1>
    </div>
  );
}
