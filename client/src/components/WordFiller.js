import React, { Component } from 'react';

export default class WordFiller extends Component {
    constructor(props) {
        super(props);

        this.setStory(props.exp); // Pass initial guesses to setStory
        this.observers = [];
        if (props.observer) this.observers.push(props.observer);

        // Create a ref for the first input box
        this.firstInputRef = React.createRef();
    }

    componentDidMount() {
        // Focus the first input when the component mounts
        if (this.firstInputRef.current) {
            this.firstInputRef.current.focus();
        }
    }

    setStory(exp) {
        const story = exp.story;
        const missingWordsIdx = exp.fillInWords;

        // Extract the missing words based on the indices
        const missingWords = story.filter((_, index) => missingWordsIdx.includes(index));

        const guesses = exp.guesses;
        const guessTimestamps = exp.guessTimestamps.map(dateStr => new Date(dateStr).toISOString());

        // Find the first empty guess to determine the starting currentIndex
        const firstEmptyIndex = guesses.length;
        const startIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : missingWords.length; // If all are filled, start at the end

        this.state = {
            currentIndex: startIndex,
            guesses: guesses,
            guessTimestamps: guessTimestamps,
            showAnswer: Array(guesses.length).fill(true).concat(Array(missingWordsIdx.length - guesses.length).fill(false)),
            missingWords,
            missingWordsIdx
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
            observer();
        });

        this.setState(prevState => {
            const updatedGuesses = [...prevState.guesses];
            updatedGuesses.push(guess);

            const updatedTimestamps = [...prevState.guessTimestamps];
            updatedTimestamps.push(new Date().toISOString());

            return {
                currentIndex: prevState.currentIndex + 1,
                guesses: updatedGuesses,
                guessTimestamps: updatedTimestamps,
                showAnswer: prevState.showAnswer.map((val, idx) => (idx === index ? true : val)),
                missingWords: prevState.missingWords,
                missingWordsIdx: prevState.missingWordsIdx
            };
        }, () => {
            const nextInput = document.getElementById(`input-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        });
    };

    wrapWords(prefixes) {
        const { currentIndex, guesses, showAnswer, missingWords } = this.state;

        return (
            <div style={{ textAlign: 'left', textJustify: 'inter-word', display: 'block', width: '100%' }}>
                {prefixes.map((prefix, index) => {
                    const missingWord = missingWords[index];
                    const isVisible = showAnswer[index];

                    return (
                        <span key={index} className="word-wrap">
                            {index <= currentIndex ? (
                                <>
                                    <span style={{ color: index === currentIndex ? '#000000' : '#666666' }}>
                                        {prefix}
                                    </span>
                                    {index === currentIndex && index < missingWords.length ? (
                                        <input
                                            id={`input-${index}`}
                                            type="text"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') this.handleGuess(index, e.target.value);
                                            }}
                                            ref={index === 0 ? this.firstInputRef : null} // Attach ref to the first input only
                                            style={{
                                                marginLeft: '8px',
                                                width: '20%',
                                                border: 'none',
                                                borderBottom: '1px solid #000',
                                                borderRadius: '5pt',
                                                fontSize: 'inherit',
                                                textAlign: 'left',
                                                marginTop: '3px',
                                                marginBottom: '3px',
                                            }}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            spellCheck="false"
                                        />
                                    ) : (
                                        isVisible && (
                                            <span style={{ color: index === currentIndex - 1 ? '#000000' : '#666666', marginLeft: '4px' }}>
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
        const { missingWordsIdx } = this.state;

        const prefixes = [];

        let subArray = story.slice(0, missingWordsIdx[0]);
        prefixes.push(subArray.join(' '));

        for (let i = 0; i < missingWordsIdx.length - 1; i++) {
            const start = missingWordsIdx[i] + 1;
            const end = missingWordsIdx[i + 1];
            subArray = story.slice(start, end);
            prefixes.push(subArray.join(' '));
        }

        subArray = story.slice(missingWordsIdx[missingWordsIdx.length - 1] + 1, story.length);
        prefixes.push(subArray.join(' '));

        return (
            <div className="word-selector-container">
                <div className="SubHeaderExp">
                    <p className="no-margin">
                        {this.wrapWords(prefixes)}
                    </p>
                </div>
                <p className="word-selector-instruction">
                    Escribe la palabra que creas correcta.
                </p>
            </div>
        );
    }
}
