import '../pages/experiment.css';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ThankYouMessage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event) => {
      // Use the replace method to avoid adding another entry to the history stack
      navigate('/', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  return (
    <div>
      <h1 className='ThankYou'> ¡Gracias por participar! </h1>
    </div>
  );
}
