import React from 'react'

import { randomNumbers, getOne } from '../../../../functions'
import HamburgerCrossButton from './hamburger-cross-button/HamburgerCrossButton';

import LessonItem from './LessonItem'

export default function Anotation ({ type, description, isOpen = true, DataHTML = false, explanationSecond, typeExplanation, typeWord, morphPriz, textWord }) {
    const isOpenClass = (isOpen) ? 'open' : '';
    const anotationId = 'anotation_' + randomNumbers() + '_' + randomNumbers();
    let anotationIdForToggler = '#'+anotationId;
    const elementOfLesson = `anotation`;
    const dopClass = (DataHTML) ? 'anotation-with-data' : '';
    const defaultImageCrossButton = `cross`;
    // Alexandra 25/06/2021: Перенесла эту функцию в HumburgerCrossButton.js
    // function toggleAnotation(evt, id) {
    //     const anotationToggler = evt.target;
    //     if (anotationToggler.dataset.img === 'cross') {
    //         console.log(`close`)
    //         anotationToggler.src = '/img/icons/icon_anotation_hamburger.svg'
    //         anotationToggler.dataset.img = 'hamburger'
    //         getOne(anotationIdForToggler).removeClass('open')
    //     } else {
    //         console.log(`open`)
    //         anotationToggler.src = '/img/icons/icon_anotation_cross.svg'
    //         anotationToggler.dataset.img = 'cross'
    //         getOne(anotationIdForToggler).addClass('open')
    //     }
    // }

    return (
        <div id={anotationId} className={`Tsds-english__lesson__anotation-${type} ${isOpenClass} ${dopClass}`}>
            <div className="Tsds-english__lesson__anotation__wrapper">
                <div className="Tsds-english__lesson__anotation__flex">
                    <div className="Tsds-english__lesson__anotation__text">
                        {
                            (DataHTML) ? <DataHTML.component data={DataHTML.data} /> : description
                        }
                    </div>
                    <HamburgerCrossButton elementOfLesson={elementOfLesson} elementClass={anotationIdForToggler} defaultImageButton={defaultImageCrossButton}/>
                    {/* <div className="Tsds-english__lesson__anotation__controls">
                        <a 
                            className="Tsds-english__anotation__toggle"
                            onClick={(evt) => {
                                evt.preventDefault();
                                toggleAnotation(evt, anotationId);
                            }}
                        >
                            <img data-img='cross' src="/img/icons/icon_anotation_cross.svg" alt=""/>
                        </a>
                        <a 
                        href="" 
                        className="Tsds-english__lesson__anotation__close"
                        onClick={e => {
                            e.preventDefault()
                            console.log('#'+anotationId);
                            getOne('#'+anotationId).toggle('open')
                        }}
                        >
                             <img src="../img/icons/icon_anotation_hamburger.svg" alt=""/>
                        </a>
                        <a 
                            href="" 
                            className="Tsds-english__lesson__anotation__hamburger"
                            onClick={e => {
                                e.preventDefault()
                                getOne('#'+anotationId).addClass('hidden');
                            }}    
                        >
                            <img src="../img/icons/icon_anotation_cross.svg" alt=""/>
                           
                        </a>
                    </div> */}
                </div>
                {/* <div onClick={e => {
                    e.preventDefault()
                    getOne('#'+anotationId).toggle('open');
                }} className="Tsds-english__lesson__anotation-acordeon acordeon">
                    <img src={'/img/down-arrow-new.svg'} width={20} />
                </div> */}
                {/* <div onClick={e => {
                    e.preventDefault()
                    getOne('#'+anotationId).addClass('hidden');
                }} className="Tsds-english__lesson__anotation-acordeon trashcan"><i className="material-icons">delete</i>
                </div> */}
            </div>

            <div className="Tsds-english__lesson__anotation__flex">
                <div className="tooltip__container">
                    <LessonItem 
                            type={typeExplanation} 
                            text={explanationSecond}
                        />
                    <LessonItem 
                            type={typeWord} 
                            text={morphPriz}
                    />
                </div>
            </div>
            
        </div>
    )
}