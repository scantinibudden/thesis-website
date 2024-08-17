import './home.css';
import ExperimentExplanation from '../components/ExperimentExplanation.js';
import CellPhoneLogin from '../components/CellPhoneLogin.js';

export default function Home() {

  return (
    <div className='container'>
      <Header/>
      <SubHeader/>
      <ExperimentExplanation/>
      <CellPhoneLogin/>
    </div>
  );
}

function Header(){
  return (
    <div className="Header">
      <h1> Experimento de Neurociencia 🧠 </h1>
    </div>

  );
}

function SubHeader(){
  return (
    <div className="SubHeader">
      En este experimento buscamos comparar como hace ChatGPT para darle significado a algunas palabras frente a como lo hacemos los humanos.  
    </div>
  );
}










