import React from 'react'

export default function DropdownItem ({ title, onChange }) {
    return (
        <React.Fragment>
            <li><a href="" title={title} onClick={(e) => {
                e.preventDefault();
                onChange(title)
            }}>{title}</a></li>
            <li className="divider"></li>
        </React.Fragment>
    )
}