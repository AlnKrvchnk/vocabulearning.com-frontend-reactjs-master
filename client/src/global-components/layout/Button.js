import React from 'react';

import Colors from '../../config/Colors';

export default function Button (props) {
    const typeButton    = (props.submit) ? 'submit' : 'button',
          color         = Colors[props.color || 'blue'],
          isLarge       = (props.large) ? 'btn-large' : 'btn',
          title         = (props.title) ? props.title : 'Кнопка',
          modal         = (props.modal) ? props.modal : '',
          disabled      = (props.disabled) ? props.disabled : false

    return (
        <button
            type={typeButton}
            data-target={modal}
            disabled={disabled}
            onClick={props.onChange || (() => {})}
            className={`${props.customClass || ''} shadow--none ${(modal) ? 'modal-trigger' : ''} ${isLarge} ${color}`}>
            {title}
        </button>
    )
}
