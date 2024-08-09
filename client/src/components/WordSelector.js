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
        console.log(exp)
        const list = exp.meanings[0].words // !Change
        return (
            <div className='word-selector-container'>
                <div className='SubHeaderExp'>
                    <p className='no-margin'>
                        {this.wrapWords(exp.meanings[0].context, [exp.word])}
                    </p>
                </div>
                <div className='grid-container'>
                    {list.map((item) => {
                        let selected = this.state.selected
                        return (
                            <button
                                // TODO: change styles to css file
                                className='grid-item'
                                style={{ fontWeight:'bold',color:'black', borderRadius: '5px', height: '50px', width: "100%", display: 'block', padding: '5px', backgroundColor: this.state.selected.has(item.id) ? 'coral' : 'yellow' }}
                                key={item.id}
                                onClick={() => {
                                    if (selected.size > 3) {
                                        return
                                    }

                                    if (this.state.selected.has(item.id)) {
                                        selected.delete(item.id)
                                    } else if (selected.size < 3) {
                                        selected.add(item.id)
                                    } else {
                                        return
                                    }
                                    this.setState({ selected: new Set(selected) })
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