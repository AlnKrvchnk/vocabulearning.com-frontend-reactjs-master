import React from 'react'

import M from 'materialize-css'

export default function TextRanger ({ text, onSelect }) {
    const checkSelection = () => {
        const rootSelection = window.getSelection();

        if(rootSelection.anchorNode.parentElement.className.indexOf('Tsds__ranger') > -1) {
            const textData = rootSelection.anchorNode.nodeValue;
            const { anchorOffset, extentOffset } = rootSelection;
            const selectionData = textData.trim().substring(anchorOffset, extentOffset);

            if(selectionData.length > 0) {
                if(selectionData.match(/\{|\}|\*/g) === null) {
                    if(anchorOffset > extentOffset) {
                        M.toast({ html: 'Выделять слова можно только слева направо!' });
                    } else {
                        onSelect(selectionData, anchorOffset, extentOffset)
                    }
                } else {
                    M.toast({ html: 'Вы задели выделенное слово!', classes: 'red' })
                }
            }
        } 
    }
    
    return (
        <p className="Tsds__ranger" onMouseUp={checkSelection}>{text}</p>
    )
}