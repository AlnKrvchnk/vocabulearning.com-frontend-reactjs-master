import React from 'react'

export default function Loader ({ text = false, isRow = true }) {
    let isRowClass = (isRow) ? 'row' : 'col s12 '
    return (
        <div className={`${isRowClass} center-align`}>
            {text ? <p>{text}</p> : ''}
            <img src={'/img/Loader.svg'} alt="Загружаю..." />
        </div>
    )
}