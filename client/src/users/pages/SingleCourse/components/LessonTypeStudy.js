import React from 'react'

export default function LessonTypeStudy ({ type_studies, onUpdateTypeStudy, active_type_study }) {
    function handleTypeStudiesClick() {
        const topMenu = document.querySelector('.top_menu_open')
        const topMenuOverlay = document.querySelector('.top_menu_overlay_open')
        topMenu.classList.contains('top_menu_open_active') ? topMenu.classList.remove('top_menu_open_active') : null
        topMenuOverlay.classList.contains('top_menu_overlay_open') ? topMenuOverlay.classList.remove('top_menu_overlay_open') : null
    }
    return (
        <React.Fragment>
            <li><a className={`collection-item`} href="" onClick={e => {
                e.preventDefault()
                onUpdateTypeStudy('')
                handleTypeStudiesClick()
            }}>Стандарт</a></li>
            {type_studies.map((item, i) => {
                const isActive = (item.value == active_type_study) ? 'active' : ''

                return <li key={i}><a className={`collection-item ${isActive}`} href={''} onClick={e => {
                    e.preventDefault()
                    onUpdateTypeStudy(item.value)
                    handleTypeStudiesClick()
                }}>{item.title}</a></li>
            })}
        </React.Fragment>
    )
}