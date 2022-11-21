import React from 'react'

export default function LessonItem ({ type, text }) {
    return (
        <div className={`Tsds-english__lesson__${type}`}>{text}</div>
    )
}