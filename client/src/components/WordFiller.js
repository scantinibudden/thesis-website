import React, { Component } from 'react';


export default class WordFiller extends Component {
    constructor(props) {
        super(props);
    
        this.setStory(props.exp)
    }

    setStory(exp) {
        const story = exp.story;
        const missingWordsIdx = exp.fillInWords;
    
        // Extract the missing words based on the indices
        const missingWords = story.filter((_, index) => missingWordsIdx.includes(index));
    
        this.state = {
            currentIndex: 0,
            guesses: Array(missingWordsIdx.length).fill(''),
            showAnswer: Array(missingWordsIdx.length).fill(false),
            missingWords, // Add the missing words directly to the state
            missingWordsIdx, // Store the indices of the missing words
        };
    }

    isFinished() {
        const { exp } = this.props;
        const { fillInWords } = exp;

        return this.state.currentIndex >= fillInWords.length
    }

    reset() {
        this.setState({ selected: new Set() });
    }

    result() {
        return Array.from(this.state.selected);
    }

    handleGuess = (index, guess) => {
        // Update guess
        this.setState(prevState => {
            const updatedGuesses = [...prevState.guesses];
            updatedGuesses[index] = guess;
            return {
                currentIndex: prevState.currentIndex + 1,
                guesses: updatedGuesses,
                showAnswer: prevState.showAnswer.map((val, idx) => idx === index ? true : val),
                missingWords: prevState.missingWords, // Add the missing words directly to the state
                missingWordsIdx: prevState.missingWordsIdx
            };
        }, () => {
            const nextInput = document.getElementById(`input-${index + 1}`);
            if (nextInput) {
                nextInput.focus(); // Focus the next input after state is updated
            }
        });
    };
    
    wrapWords(prefixes) {
        const { currentIndex, guesses, showAnswer, missingWords } = this.state;
    
        return (
            <div style={{ textAlign: 'justify', textJustify: 'inter-word', display: 'block', width: '100%' }}> {/* Container for left alignment */}
                {prefixes.map((prefix, index) => {
                    const missingWord = missingWords[index];
                    const isVisible = showAnswer[index];
                    const isLastInput = index === missingWords.length - 1; // Check if this is the last input
    
                    return (
                        <span key={index} className="word-wrap">
                            {index <= currentIndex ? ( // Show the prefix only if index is less than or equal to currentIndex
                                <>
                                    <span>{prefix}</span>
                                    {index === currentIndex && index < missingWords.length ? (
                                        <input
                                            id={`input-${index}`} // Unique ID for each input
                                            type="text"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    this.handleGuess(index, e.target.value);
                                                    if (isLastInput) {
                                                        const submitButton = document.querySelector('.SubmitButton');
                                                        if (submitButton) {
                                                            submitButton.style.display = 'block'; // Unhide the submit button
                                                            const instruction = document.querySelector('.word-selector-instruction')
                                                            instruction.style.paddingBottom = '20px'; // Unhide the submit button
                                                        }
                                                    }
                                                }
                                            }}
                                            style={{ 
                                                marginLeft: '4px', 
                                                width: '15%',  // Set input width to half the container
                                                border: 'none', 
                                                borderBottom: '1px solid #000', 
                                                fontSize: 'inherit', 
                                                textAlign: 'left' // Align text inside the input to the left
                                            }}
                                        />
                                    ) : (
                                        isVisible && <span style={{ marginLeft: '4px' }}>{missingWord} </span> // Add space after revealed word
                                    )}
                                </>
                            ) : null}
                        </span>
                    );
                })}
            </div>
        );
    }
    
    render() {
        const { exp } = this.props;
        const story = exp.story;
        const { missingWordsIdx } = this.state;  // No need to calculate missingWords and missingWordsIdx again
    
        // Generate prefixes for each word
        const prefixes = [];
    
        // prefix for first word
        let subArray = story.slice(0, missingWordsIdx[0]);
        prefixes.push(subArray.join(' '));
    
        for (let i = 0; i < missingWordsIdx.length - 1; i++) {
            const start = missingWordsIdx[i] + 1; // Start from the next index
            const end = missingWordsIdx[i + 1]; // End at the current index of the next pair
            subArray = story.slice(start, end); // Get words between the indices
            prefixes.push(subArray.join(' ')); // Join and push to result
        }
    
        // last prefix (actually suffix)
        subArray = story.slice(missingWordsIdx[missingWordsIdx.length-1]+1, story.length);
        prefixes.push(subArray.join(' '));
    
        return (
            <div className='word-selector-container'>
                <div className='SubHeaderExp'>
                    <p className='no-margin'>
                        {this.wrapWords(prefixes)}
                    </p>
                </div>
                <p className='word-selector-instruction'>                       
                    Escribe la palabra que creas correcta.
                </p>
            </div>
        );
    }
}
