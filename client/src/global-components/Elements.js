import React from 'react'

export const LinkA = props => {
    return <a {...props} onClick={e => {
        if(!props.href) {
            e.stopPropagation()

            if(props.onClick)
                props.onClick(e.target, props)
        }
    }}>{props.children}</a>
}