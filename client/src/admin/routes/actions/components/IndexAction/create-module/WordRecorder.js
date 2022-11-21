import React from 'react'

export default function WordRecorder ({ start, stop, type, title, checkTitle }) {
    return (
        <a href="" onClick={e => {
            e.preventDefault();
            if(title == checkTitle) {
                start(type);
            } else {
                stop(type);
            }
        }} className="btn"><i className="left material-icons">settings_voice</i> {title} </a>
    )
}