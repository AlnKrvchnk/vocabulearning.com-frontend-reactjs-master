import React from 'react'

import TextChip from './Text-Selecting-Chip'

export default function TextSelectingItem ({ text, onSelect, onRemoveWord, selectFromIndex }) {
    let splittingText = text.split(' ');
    return (
        <div className="chips-words text-selecting-item">
            {
                (splittingText.length) ?
                    splittingText.map((item, i) => {
                        if(item !== "") {
                            return <TextChip 
                                key={i} 
                                word={item.trim()}
                                index={i}
                                isSelected={selectFromIndex(i)}
                                onSelectWord={onSelect}
                                onRemoveWord={onRemoveWord}
                            />
                        }
                    })
                : ''
            }
        </div>
    )
}