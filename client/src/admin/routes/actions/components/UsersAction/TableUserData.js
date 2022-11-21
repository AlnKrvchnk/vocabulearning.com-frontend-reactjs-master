import React from 'react'
import { $API, Toast } from '../../../../../functions'

export default function TableUserData (props) {
    const {
        id, country, date, email, first_name, last_name,
        login, phone, role, languege,
        course_name, group_name, blocked
    } = props.data;

    let totalRole = props.totalRole;
    
    let userRole = '';
    const ALL_ROLES = [
        'Ученик',
        'Преподаватель',
        'Суперадмин'
    ];

    if(role == 1) 
        userRole = ALL_ROLES[1];
    else if(role == 0) 
        userRole = ALL_ROLES[0];
    else if(role == 2) 
        userRole = ALL_ROLES[2];

    
    const is_user_blocked = (blocked > 0) ? 'Заблокирован' : 'Активен'

    return (
        <tr>
            <td>{id}</td>
            <td>
                {login}
                <p>{totalRole >= 2 ? <a href="" onClick={e => { e.preventDefault(); props.onDeleteUser(id, props.index); }}>Удалить</a> : ''}</p>
            </td>
            <td>{totalRole >= 2 ? <select onChange={e => {
                    $API.changeRoleUser(id, e.target.value, data => {
                        const MSG = data.error_message;
                        Toast(MSG, (data.success) ? 'green' : 'red');
                    }, 'blocked')
                }} name="role" className="browser-default">
                    <option value="" disabled="true" selected={true}>{is_user_blocked}</option>
                    <option value="1">Заблокировать</option>
                    <option value="0">Разблокировать</option>
                </select> : is_user_blocked}</td>
            <td>{group_name || '-'}</td>
            <td>{course_name || '-'}</td>
            <td>
                {totalRole >= 2 ? <select onChange={e => {
                    $API.changeRoleUser(id, e.target.value, data => {
                        const MSG = data.error_message;
                        Toast(MSG, (data.success) ? 'green' : 'red');
                    })
                }} name="role" className="browser-default">
                    <option value="" disabled="true" selected={true}>{userRole}</option>
                    <option value="0">Ученик</option>
                    <option value="1">Преподаватель</option>
                    <option value="2">Суперадмин</option>
                </select> : userRole}
            </td>
            <td>{country}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{email}</td>
            <td>{phone}</td>
            <td>{date}</td>
        </tr>
    )
}