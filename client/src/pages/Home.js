import './home.css';
import ExperimentExplanation from '../components/ExperimentExplanation.js';
import EmailLogin from '../components/EmailLogin.js';
import LogosHeader from '../components/LogosHeader.js';
import Contact from '../components/Contact.js';

export default function Home() {

  return (
    <div className='container' style={{maxWidth:'1200px'}}>
      <LogosHeader />
      <Header />
      <SubHeader />
      <ExperimentExplanation />
      <EmailLogin />
      <Contact />
    </div>
  );
}

function Header() {
  return (
    <div className="Header">
      <h1> Experimento de Neurociencia 🧠 </h1>
    </div>

  );
}

function SubHeader() {
  return (
    <div className="SubHeader">
      Este experimento es parte de una investigación para entender mejor cómo funciona la predicción de texto en chatGPT y nuestro cerebro.
    </div>
  );
}










