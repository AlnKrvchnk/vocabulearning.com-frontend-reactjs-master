import React from 'react'
import {getOne} from '../../../../../functions'

function toggleCrossHamburgerButton(evt, elementOfTheLess) {
    const buttonToggler = evt.target;
    console.log(`buttonToggler.dataset.img `, buttonToggler.dataset.img )
    if (buttonToggler.dataset.img === 'cross') {
        console.log(`close`)
        buttonToggler.src = '/img/icons/icon_anotation_hamburger.svg'
        buttonToggler.dataset.img = 'hamburger'
        getOne(elementOfTheLess).removeClass('open')
    } else {
        console.log(`open`)
        buttonToggler.src = '/img/icons/icon_anotation_cross.svg'
        buttonToggler.dataset.img = 'cross'
        getOne(elementOfTheLess).addClass('open')
    }
}
export default function HamburgerCrossButton({elementOfLesson, elementClass, defaultImageButton}) {
    
    return (
        <div className={`Tsds-english__lesson__${elementOfLesson}__controls`}>
            <a 
                className={`Tsds-english__${elementOfLesson}__toggle`}
                onClick={(evt) => {
                    evt.preventDefault();
                    toggleCrossHamburgerButton(evt, elementClass);
                }}
            >
                <img data-img={defaultImageButton} src={`/img/icons/icon_anotation_${defaultImageButton}.svg`} alt=""/>
            </a>
        </div>
    )
}
