import '../pages/experiment.css';
import { useState } from 'react';


const NextButton = ({handleOnClick}) => {
    const [isLoading, setIsLoading] = useState(false);
    

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await handleOnClick();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
        return(
                <div className='button-container'>
                {isLoading ? (
                            <div className="loader"></div>
                        ) : (
                            <button className='SubmitButton' onClick={handleClick} style={{ display: 'none', marginBottom: '10%'}}> Siguiente </button>
                        )}
                </div>        
        )
}; 

export default NextButton;
