import React, { Component } from 'react';


export default class WordSelector extends Component {
    constructor(props) {
        super(props);
        this.state = { selected: new Set() };
    }

    isFull() {
        return this.state.selected.size === 3
    }

    reset() {
        this.setState({ selected: new Set() });
    }

    result() {
        return Array.from(this.state.selected);
    }

    wrapWords(text, words) {
        // Convertir todas las palabras a minúsculas
        const wordsLowerCase = words.map(word => word.toLowerCase());

        // Dividir el texto en palabras y signos de puntuación
        const parts = text.split(/(\b[\wáéíóúüñ]+[\.,!?]?\b)/);

        return parts.map((part, index) => {
            // Verificar si la palabra (en minúsculas) debe ser envuelta
            if (wordsLowerCase.includes(part.toLowerCase().trim().replace(/[\.,!?]$/, ''))) {
                return <span className='highlight-word' key={index}>{part}</span>;
            }
            return part;
        });
    };

    render() {
        const { exp } = this.props
        const list = exp.words // !Change
        console.log(exp)
        return (
            <div className='word-selector-container'>
                <div className='SubHeaderExp'>
                    <p className='no-margin'>
                        {this.wrapWords(exp.context, [exp.word])}
                    </p>
                </div>
                <p className='word-selector-instruction'>                       
                    Seleccioná las 3 palabras que más se relacionen con la palabra en naranja.
                </p>
                <div className='grid-container'>
                    {list.map((item) => {
                        let selected = this.state.selected
                        return (
                            <button
                                // TODO: change styles to css file
                                className='grid-item'
                                style={{ backgroundColor: this.state.selected.has(item) ? 'coral' : 'var(--pale-cyan)'  }}
                                key={item}
                                onClick={() => {
                                    if (selected.size > 3) {
                                        return
                                    }

                                    if (this.state.selected.has(item)) {
                                        selected.delete(item)
                                    } else if (selected.size < 3) {
                                        selected.add(item)
                                    } else {
                                        return
                                    }
                                    this.setState({ selected: new Set(selected) })
                                }}
                            >
                                {item}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }
}