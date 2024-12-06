import './home.css';
import ExperimentExplanation from '../components/ExperimentExplanation.js';
import UserForm from '../components/UserForm.js';
import LogosHeader from '../components/LogosHeader.js';
import Contact from '../components/Contact.js';

export default function UserForm() {

  return (
    <div className='container' style={{maxWidth:'1200px'}}>
      <LogosHeader />
      <Header />
      <SubHeader />
      <ExperimentExplanation />
      <UserForm />
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
      Para realizar este experimento te vamos a pedir que completes un breve cuestionario. Esto es de gran importancia para el análisis de los resultados que obtengamos. Este cuestionario te llevará menos de un minuto y te lo preguntaremos por única vez.
    </div>
  );
}










