import React from 'react'

import { Link } from 'react-router-dom'

export default function SidebarItem (props) {
    const {
         path,
         title,
         elementClass,
         icon,
         material_icon,
         updateSelects
    } = props;
    
    return (
        <ul>
            <li className={elementClass}>
                <Link onClick={updateSelects} to={path}>
                    <span className={'nav-icon material-icons'}>{material_icon}</span>
                    {/* {icon ? <Link to={path} className={'nav-icon material-icons'}></Link> : ''} */}
                    <span>{title}</span>
                </Link>
            </li>
        </ul>
    )
}