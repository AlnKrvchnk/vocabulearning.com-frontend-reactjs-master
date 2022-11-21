import React from 'react'

import DisplayMenu from './DisplayMenu'

export default function MobileMenu () {
    return (
        <div className="mobile-menu__wrapper">
            <ul id="slide-out" className="sidenav">
                <DisplayMenu />
            </ul>
            <a href="#" data-target="slide-out" className="sidenav-trigger hide-on-large-only"><i className="material-icons">menu</i></a>
        </div>
    )
}