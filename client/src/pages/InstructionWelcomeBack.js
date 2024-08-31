import './experiment.css';
import Instructions from '../components/Instructions.js';

function InstructionsWelcomeBack() {
    return (
        <Instructions title={"¡Bienvenido nuevamente!"} navigateTo={"/experiment"}/>
    )
}

export default InstructionsWelcomeBack;