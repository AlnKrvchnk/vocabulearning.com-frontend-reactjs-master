import React from 'react'

import { getCurrentUserToken, getUserId } from '../../../../functions'
import { Link } from 'react-router-dom'

export default function LessonTitle ({ title }) {
    const TOKEN = getCurrentUserToken();
    const userId = getUserId();

    return (
        <React.Fragment>
            <h1>{title}</h1>
            {
                (TOKEN == '' || userId == 0) ? <p><b>Это пробная версия курса. Чтобы воспользоваться всеми функциями <Link to={'/auth/'}>авторизируйтесь</Link></b></p>
                : ''
            }
        </React.Fragment>
    )
}