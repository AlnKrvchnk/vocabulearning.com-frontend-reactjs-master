import React from 'react'

export default function LessonContainer (props) {
    return (
        <div data-course-id={props.id} className="Tsds-english__lesson">{props.children}</div>
    )
}