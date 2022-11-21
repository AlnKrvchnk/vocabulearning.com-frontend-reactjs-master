import React from 'react'

export default function LessonProgress ({ countLessons, currentLesson }) {
    const widthInPercent = (100/countLessons) * currentLesson;
    
    return (
        <div className="Tsds-english__lesson__progress">
            <div className="Tsds-english__lesson__progress__bar" data-lesson={currentLesson} style={{
                width: widthInPercent+'%'
            }}></div>
        </div>
    )
}