import './home.css';
import UserFormExplanation from '../components/UserFormExplanation.js';
import UserForm from '../components/UserForm.js';
import LogosHeader from '../components/LogosHeader.js';
import Contact from '../components/Contact.js';

export default function Form() {

  return (
    <div className='container' style={{maxWidth:'1200px'}}>
      <LogosHeader />
      <Header />
      <UserFormExplanation />
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