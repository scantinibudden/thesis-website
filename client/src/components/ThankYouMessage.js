import '../pages/experiment.css';
import { useEffect } from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon, 
  WhatsappShareButton,
  WhatsappIcon, 
  TelegramShareButton,
  TelegramIcon
} from 'react-share'
import Contact from './Contact';

export default function ThankYouMessage() {
  useEffect(() => {
    window.history.pushState(null, null, '/');
    window.history.pushState(null, null, '/');
  }, []);

  const shareUrl = "https://experiment-webpage.vercel.app/"
  const title = "¡Participá en este experimento!"

  return (
    <div className='container'>
      <h1 className='ThankYou'> ¡Gracias por participar! </h1>
      <h2 className='BlueSubHeader' style={{ padding: '0px' }}> Por favor comparte nuestro experimento </h2>
      <h2 className='BlueSubHeader' style={{ padding: '0px' }}> Para realizar mas experimentos ve a datapruebas.org </h2>
      <div className='share-container'>
        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={50} round={true} />
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={title}>
          <XIcon  size={50} round={true} />
        </TwitterShareButton>

        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon  size={50} round={true} />
        </WhatsappShareButton>

        <TelegramShareButton url={shareUrl} title={title}>
          <TelegramIcon  size={50} round={true} />
        </TelegramShareButton>
      </div>
      <Contact />
    </div>
  );
}
