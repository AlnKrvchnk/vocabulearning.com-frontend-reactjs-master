import React from 'react'

export default function LessonIndicator ({ type, text = '', onChange, index = 0, id = 0, activeIndicatorId = -1 }) {
    let classes = {
        selected: 'indicator_wrapper--selected'
    }

    return (
        <React.Fragment>
            <div 
            onClick={(evt) => {
                if(onChange) onChange(type, text, index, id)
                const wrappers = document.querySelectorAll('.indicator_wrapper')
                
                wrappers.forEach((indicator) => {
                    if (indicator.classList.contains(classes.selected)) {
                        indicator.classList.remove(classes.selected)
                    }
                })
                let wrapper = evt.target.closest('.indicator_wrapper')
                wrapper.classList.toggle(classes.selected)
            }}
            className={`indicator_wrapper ${type} ${activeIndicatorId === id ? classes.selected : ''}`}>
                <span className={`indicator ${type}`}>
                    <i></i>
                </span>
                <p>{text}</p>
            </div>
        </React.Fragment>
    )
}