import React, { Component } from 'react';

export default class WordSelector extends Component {
    constructor(props) {
        super(props);
        this.state = { selected: [] }; // Cambiado a lista
    }

    isFull() {
        return this.state.selected.length === 3; // Cambiado a .length
    }

    reset() {
        this.setState({ selected: [] }); // Cambiado a lista vacía
    }

    result() {
        return this.state.selected;
    }

    wrapWords(text, words) {
        const wordsLowerCase = words.map(word => word.toLowerCase());
        const parts = text.split(/(\b[\wáéíóúüñ]+[\.,!?]?\b)/);
    
        return parts.map((part, index) => {
            if (wordsLowerCase.includes(part.toLowerCase().trim().replace(/[\.,!?]$/, ''))) {
                return <span className='highlight-word' key={index}>{part}</span>;
            }
            return part;
        });
    };

    render() {
        const { exp } = this.props;
        const list = exp.words;
        return (
            <div className='word-selector-container'>
                <div className='SubHeaderExp'>
                    <p className='no-margin'>
                        {this.wrapWords(exp.context, [exp.word])}
                    </p>
                </div>
                <div className='grid-container'>
                    {list.map((item) => {
                        let selected = this.state.selected;
                        console.log(selected);
                        return (
                            <button
                                className='grid-item'
                                style={{
                                    fontWeight: 'bold',
                                    color: 'black',
                                    borderRadius: '5px',
                                    height: '50px',
                                    width: "100%",
                                    display: 'block',
                                    padding: '5px',
                                    backgroundColor: selected.includes(item.id) ? 'coral' : 'yellow'
                                }}
                                key={item.id}
                                onClick={() => {
                                    if (selected.length >= 3 && !selected.includes(item.id)) {
                                        return;
                                    }

                                    if (selected.includes(item.id)) {
                                        selected = selected.filter(id => id !== item.id);
                                    } else {
                                        selected = [...selected, item.id];
                                    }
                                    this.setState({ selected });
                                }}
                            >
                                {item.word}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }
}