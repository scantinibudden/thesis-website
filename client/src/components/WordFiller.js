import React, { Component } from 'react';

export default class WordFiller extends Component {
    constructor(props) {
        super(props);

        this.setStory(props.exp); // Pass initial guesses to setStory
        this.observers = []
        if(props.observer)
            this.observers.push(props.observer)
    }

    setStory(exp) {
        const story = exp.story;
        const missingWordsIdx = exp.fillInWords;

        // Extract the missing words based on the indices
        const missingWords = story.filter((_, index) => missingWordsIdx.includes(index));

        const guesses = exp.guesses;

        // Find the first empty guess to determine the starting currentIndex
        const firstEmptyIndex = guesses.length;
        const startIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : missingWords.length; // If all are filled, start at the end

        this.state = {
            currentIndex: startIndex, // Start from the first empty guess
            guesses: guesses, // Initialize with provided guesses or empty strings
            showAnswer: Array(guesses.legnth).fill(true).concat(Array(missingWordsIdx.length - guesses.length).fill(false)), // If there's a guess, show the answer
            missingWords, // Add the missing words directly to the state
            missingWordsIdx, // Store the indices of the missing words
        };
    }

    isFinished() {
        const { exp } = this.props;
        const { fillInWords } = exp;

        return this.state.currentIndex >= fillInWords.length;
    }

    handleGuess = (index, guess) => {
        if (!guess || guess.trim() === "") {
            console.warn("Guess can't be empty.");
            alert("Guess can't be empty.");
            return;
        }

        const isLastInput = index === this.state.missingWords.length - 1;

        if (isLastInput) {
            const submitButton = document.querySelector('.SubmitButton');
            if (submitButton) {
                submitButton.style.display = 'block';
                const instruction = document.querySelector('.word-selector-instruction');
                instruction.style.paddingBottom = '20px';
            }
        }

        this.observers.forEach(observer => {
            observer()
        });

        // Update guess
        this.setState(prevState => {
            const updatedGuesses = [...prevState.guesses];
            updatedGuesses.push(guess);
            return {
                currentIndex: prevState.currentIndex + 1,
                guesses: updatedGuesses,
                showAnswer: prevState.showAnswer.map((val, idx) => idx === index ? true : val),
                missingWords: prevState.missingWords, // Add the missing words directly to the state
                missingWordsIdx: prevState.missingWordsIdx
            };
        }, () => {
            const nextInput = sour;
            if (nextInput) {
                nextInput.focus(); // Focus the next input after state is updated
            }
        });
    };

    wrapWords(prefixes) {
        const { currentIndex, guesses, showAnswer, missingWords } = this.state;
    
        return (
            <div style={{ textAlign: 'left', textJustify: 'inter-word', display: 'block', width: '100%' }}>
            {/* <div style={{ textAlign: 'justify', textJustify: 'inter-word', display: 'block', width: '100%' }}> */}
                {prefixes.map((prefix, index) => {
                    const missingWord = missingWords[index];
                    const isVisible = showAnswer[index];
    
                    return (
                        <span key={index} className="word-wrap">
                            {index <= currentIndex ? (
                                <>
                                    <span style={{ color: index === currentIndex ? '000000' : '#666666' }}>
                                        {prefix}
                                    </span>
                                    {index === currentIndex && index < missingWords.length ? (
                                        <input
                                            id={`input-${index}`}
                                            type="text"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter')
                                                    this.handleGuess(index, e.target.value);
                                            }}
                                            style={{
                                                marginLeft: '8px',
                                                width: '20%',
                                                border: 'none',
                                                borderBottom: '1px solid #000',
                                                borderRadius: '5pt',
                                                border: 'solid',
                                                fontSize: 'inherit',
                                                textAlign: 'left'
                                            }}
                                            autocomplete="off"
                                            autoCorrect='off'
                                            spellCheck="false"
                                        />
                                    ) : (
                                        isVisible && (
                                            <span style={{ color: index === currentIndex - 1 ? '000000' : '#666666', marginLeft: '4px' }}>
                                                {missingWord} {' '}
                                            </span>
                                        )
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
        subArray = story.slice(missingWordsIdx[missingWordsIdx.length - 1] + 1, story.length);
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
