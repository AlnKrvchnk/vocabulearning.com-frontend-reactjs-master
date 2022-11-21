import React from 'react'
import { Link } from 'react-router-dom'

import HeaderMenu from '../../../config/HeaderMenu'

export default function DisplayMenu ({ history }) {

    return (
        <React.Fragment>
            {
                HeaderMenu.map(
                    ($link, i) => {
                        if($link != '' && $link.isValid) {
                            return <li key={i}>
                                <Link to={$link.path}>
                                    {$link.name}
                                </Link>
                            </li>
                        }
                    }
                )
            }
        </React.Fragment>
    )
}