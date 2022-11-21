import React from 'react'

export default function SoundButton ({ onChange, customClass }) {
    const soundButtonClass = 'sound-button';

    function ToggleActiveClassSoundButton (e) {
        e.preventDefault();
    
        e.target.classList.toggle(soundButtonClass + '--active');
    }

    return (
        <div className={soundButtonClass + ' ' + customClass} onMouseUp={e => {
            e.preventDefault();
            onChange(e.target);
        }} onClick={ToggleActiveClassSoundButton}>
            <img src="/img/sound_icon1.svg" />
        </div>
    )
}