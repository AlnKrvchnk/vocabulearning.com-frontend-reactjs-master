import React from 'react'

export default class TextSelectingChip extends React.Component {
    constructor (props) {
        super(props)

        this.toggleActive = this.toggleActive.bind(this)
        
    }

    toggleActive (word, index) {
        if(!this.props.isSelected) {
            this.props.onSelectWord({ index, word })
        } else {
            this.props.onRemoveWord(word, index)
        }
    }

    render() {
        const { word, index, isSelected } = this.props;

        const selectedClass = (isSelected) ? 'active' : ''
        return (
            <div onClick={() => {
                this.toggleActive(word, index)
            }} data-index={index} data-word={word} className={`text-selecting-item__chip chips-words__chip ${selectedClass}`}>{word}</div>
        )
    }
}