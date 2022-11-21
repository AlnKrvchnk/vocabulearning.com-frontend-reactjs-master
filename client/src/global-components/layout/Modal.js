import React from 'react'

export default function Modal (props) {
    const {
        modalClass,
        data
    } = props;
    
    const Content = props.content;

    return (
        <div id={`modal-${modalClass}`} draggable={'true'} className={`modal Tsds__modal Tsds__modal--${modalClass}`}>
            {props.children ? props.children : <Content triggerEvent={props.triggerEvent} {...data} />}
        </div>
    )
}