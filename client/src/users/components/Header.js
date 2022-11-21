import React from 'react'

import L from '../../config/languege'
import Colors from '../../config/Colors'

import { Link } from 'react-router-dom'

export default class Header extends React.Component {
    render () {
        function topPanelDotsHandler () {
            const userProfileMenu = document.querySelector('.user_profile_mobile_menu');
            !userProfileMenu.classList.contains('user_profile_mobile_menu_open') ? userProfileMenu.classList.add('user_profile_mobile_menu_open') : userProfileMenu.classList.remove('user_profile_mobile_menu_open');
            
        }
        function topPanelSettingsHandler () {
            const topPanelSettingsMenu = document.querySelector('.top_menu_open');
            topPanelSettingsMenu.classList.contains('top_menu_open_active') ? topPanelSettingsMenu.classList.remove('top_menu_open_active') : topPanelSettingsMenu.classList.add('top_menu_open_active')
        }
        return (
            <React.Fragment>
                <div className="top_panel">
                    <div className="fingman_wrapper">
                        <div className="see_more">
                            <div className="top_panel_dots" onClick={topPanelDotsHandler}>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <header className="Tsds-english__header navbar-fixed">
                    <nav>
                        <div className={`nav-wrapper ${Colors.header}`}>
                            <div className="container">
                                <a className="brand-logo" href="/"><img src="/img/sidebar-logo.png" /></a>
                                <div className="top_panel_dots" onClick={topPanelDotsHandler}>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
            </React.Fragment>
        )
    }
}