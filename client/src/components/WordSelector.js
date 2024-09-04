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
    
        // Dividir el texto en palabras y espacios, manteniendo la puntuación
        const parts = text.split(/(\s+)/).flatMap(part => {
            if (/\s+/.test(part)) {
                return [part];
            }
            const match = part.match(/^(.*?)([\.,!?]?)$/);
            return match[1] ? [match[1], match[2]] : [match[2]];
        }).filter(Boolean);
    
        return parts.map((part, index) => {
            // Obtener la versión en minúsculas de la parte actual sin puntuación
            const partLowerCase = part.toLowerCase().trim();
            
            // Verificar si la palabra (en minúsculas) debe ser envuelta
            if (wordsLowerCase.includes(partLowerCase)) {
                return <span className='highlight-word' key={index}>{part}</span>;
            }
            return part;
        });
    };

    render() {
        const { exp } = this.props
        const list = exp.words // !Change
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