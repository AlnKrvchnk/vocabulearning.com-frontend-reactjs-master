import React from 'react'
import PulseCircle from '../WidgetsComponent/Widgets'

export default function ChatLinkItem ({ 
    href = '#', on_click = () => {}, 
    class_name = 'app-chat__link', postfix = '',
    title = 'Link not found', pulse_circle,
    type = '' }) {

    return (
        <a className={class_name} href={href} onClick={e => {
            e.preventDefault()
            on_click()
        }}>{title} {pulse_circle !== null ? <PulseCircle action={pulse_circle} /> : ''}
            {postfix ? <i className={class_name + '__postfix'}>{postfix}</i> : ''}
        </a>
    )
}