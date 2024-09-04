import './home.css';
import ExperimentExplanation from '../components/ExperimentExplanation.js';
import CellPhoneLogin from '../components/CellPhoneLogin.js';
import LogosHeader from '../components/LogosHeader.js';
import Contact from '../components/Contact.js';

export default function Home() {

  return (
    <div className='container' style={{maxWidth:'1200px'}}>
      <LogosHeader />
      <Header />
      <SubHeader />
      <ExperimentExplanation />
      <CellPhoneLogin />
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
      El objetivo de este experimento es entender un poco mejor como funciona ChatGPT.
    </div>
  );
}










