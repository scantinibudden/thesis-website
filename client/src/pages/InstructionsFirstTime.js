import './experiment.css';
import Instructions from '../components/Instructions.js';

function InstructionsFirstTime() {
    return (
        <Instructions title={"Instrucciones"} navigateTo={"/tutorial"} isFirstTime={true}/>
    )
}

export default InstructionsFirstTime;