import React from 'react'

export default function LessonWords (props) {
    function changeStudyHeading (studyNumber) {
        switch(studyNumber) {
            case 1:
                return <div className="Tsds-english_study_heading"><h3>{props.textTranslateWord}</h3></div>;
            case 2:
                return <div className="Tsds-english_study_heading"><div className="Tsds-english_study_img" onClick={() => props.playSound()}><img src="/img/icons/icon_input_phrase.svg" /></div></div>;
            case 3:
                return <div className="Tsds-english_study_heading"><div className="Tsds-english_study_img" onClick={() => props.playSound(null, true)}><img src="/img/icons/icon_input_phrase.svg" /></div></div>;
            default:
                return ''
        }
    }
    return (
        <div className={`Tsds-english__lesson__words study--${props.studyType}`} >
            {changeStudyHeading(props.studyType)}
            {props.children}
        </div>
    )
}