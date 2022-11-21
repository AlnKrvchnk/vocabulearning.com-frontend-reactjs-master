import React from 'react'

export default function GlobalLoader ({ isHidden }) {
    const hiddenClass = (isHidden) ? 'hidden' : ''

    return (
        <div className={`global-loader ${hiddenClass}`}>
            <h5>Загружаю...</h5>
            <img src={'/img/Loader.svg'} alt="Загружаю..." />
        </div>
    )
}