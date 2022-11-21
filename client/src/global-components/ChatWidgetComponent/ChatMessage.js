import React from 'react'

export default function ChatMessage ({ r_cls = 'app-chat', login = '', msg = '', date = '' }) {
    const message_class = r_cls + '__message';

    return (
        <div className={message_class}>
            <p className={message_class + '__author'}>{login}</p>
            <p className={message_class + '__data'}>{msg}</p>
            <p className={message_class + '__date'}>{date}</p>
        </div>
    )
}