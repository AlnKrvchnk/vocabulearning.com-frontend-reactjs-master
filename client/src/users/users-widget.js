import React from 'react'

export default function UsersWidget ({ isAdmin }) {
    return (
        <React.Fragment>
            {
                (isAdmin) ? 
                <a href="/admin/" className="Tsds-english__editButton">Редактировать</a>
                : ''
            }
        </React.Fragment>
    )
}