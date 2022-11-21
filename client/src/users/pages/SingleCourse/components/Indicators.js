import React from 'react'

import LessonIndicator from './LessonIndicator'

export default function LessonBigIndicator ({ text, triggerModal, customClass, type='new' }) {
    return (
        <div className={`Tsds-english__lesson__indicators ${customClass}`} data-target={triggerModal}>
            <div className="Tsds-english__lesson__indicators__info indicator_btn">

                <LessonIndicator type={type} text='' />
                <div className="indicator_popup">
                    <p>{text}</p>
                </div>
            </div>
        </div>
    )
}