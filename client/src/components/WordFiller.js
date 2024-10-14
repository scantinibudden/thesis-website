import React, { Component } from 'react';


export default class WordFiller extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            guesses: Array(props.exp.fillInWords.length).fill(''),
            showAnswer: Array(props.exp.fillInWords.length).fill(false),
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
        const { exp } = this.props;
        const { fillInWords } = exp;

        // Update guess
        this.setState(prevState => {
            const updatedGuesses = [...prevState.guesses];
            updatedGuesses[index] = guess;
            return {
                guesses: updatedGuesses,
                showAnswer: prevState.showAnswer.map((val, idx) => idx === index ? true : val),
                currentIndex: prevState.currentIndex + 1,
            };
        });
    };

    wrapWords(prefixes, missingWords) {
        const { currentIndex, guesses, showAnswer } = this.state;
    
        return prefixes.map((prefix, index) => {
            const missingWord = missingWords[index];
            const isVisible = showAnswer[index];
    
            return (
                <div key={index} className="word-wrap" style={{ display: 'flex', alignItems: 'center' }}>
                    {index <= currentIndex ? ( // Show the prefix only if index is less than or equal to currentIndex
                        <>
                            <span>{prefix}</span>
                            {index === currentIndex && index < missingWords.length ? (
                                <input
                                    type="text"
                                    onBlur={(e) => this.handleGuess(index, e.target.value)}
                                    style={{ marginLeft: '8px' }} // Adjust spacing as needed
                                />
                            ) : (
                                isVisible && <span style={{ marginLeft: '8px' }}> {missingWord} </span>
                            )}
                        </>
                    ) : null} {/* Do not render anything if index is greater than currentIndex */}
                </div>
            );
        });
    }
    
    

    render() {
        const { exp } = this.props;
        const story = exp.story;
        const fillInWordsIdx = exp.fillInWords;

        const missingWords = story.filter((_, index) => fillInWordsIdx.includes(index));
        
        // Generate prefixes for each word
        const prefixes = [];

        // prefix for first word
        let subArray = story.slice(0, fillInWordsIdx[0]);
        prefixes.push(subArray.join(' '));

        for (let i = 0; i < fillInWordsIdx.length - 1; i++) {
            const start = fillInWordsIdx[i] + 1; // Start from the next index
            const end = fillInWordsIdx[i + 1]; // End at the current index of the next pair
            subArray = story.slice(start, end); // Get words between the indices
            prefixes.push(subArray.join(' ')); // Join and push to result
        }

        // last prefix (actually sufix)
        subArray = story.slice(fillInWordsIdx[fillInWordsIdx.length-1]+1, story.length);
        prefixes.push(subArray.join(' '));

        return (
            <div className='word-selector-container'>
                <div className='SubHeaderExp'>
                    <p className='no-margin'>
                        {this.wrapWords(prefixes, missingWords)}
                    </p>
                </div>
                <p className='word-selector-instruction'>                       
                    Escribe la palabra que creas correcta.
                </p>
            </div>
        )
    }
}