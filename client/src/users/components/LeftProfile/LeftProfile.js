import React from 'react';
import AuthChecker from '../AuthChecker/AuthChecker';

export default function LeftProfile (props) {
    function userProfileOverlayHandler () {
        const profileMenu = document.querySelector('.user_profile_mobile_menu');
        const profileMenuOverlay = document.querySelector('.user_profile_mobile_menu_overlay');
        profileMenu.classList.remove('user_profile_mobile_menu_open');
        profileMenuOverlay.classList.remove('user_profile_mobile_menu_overlay_open');
    }

    return (
        <React.Fragment>
            <div className="user_profile_mobile_menu">
                <div className="fingman_wrapper">
                    <AuthChecker token={props.token} />
                </div>
            </div>
            <div className="user_profile_mobile_menu_overlay" onClick={userProfileOverlayHandler}></div>
        </React.Fragment>
    )
}