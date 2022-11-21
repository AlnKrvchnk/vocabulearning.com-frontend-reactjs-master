import React from 'react'
import HamburgerCrossButton from '../hamburger-cross-button/HamburgerCrossButton'

export default function Promt ({word, phrase, isOpen, getFullPhraseCheck}) {
    const phraseClass = '.Tsds-english__lesson__promt-phrase';
    const elementOfLesson = `promt`;
    const defaultImageHamburgerButton = `hamburger`;
    const isOpenClass = (isOpen) ? 'open' : '';
        return (
            <div className="Tsds-english__lesson__promt-container"> 
                <p className={`Tsds-english__lesson__promt-phrase ${isOpenClass}`}>{getFullPhraseCheck(word, phrase)}</p>
                <HamburgerCrossButton elementOfLesson={elementOfLesson} elementClass={phraseClass} defaultImageButton={defaultImageHamburgerButton}/>
            </div>
        )

}