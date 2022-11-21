import React from 'react'

import Button from '../../../global-components/layout/Button'

import axios from 'axios'
import API from '../../../config/API'
import TableUsers from './components/UsersAction/TableUsers'
import Loader from '../../../global-components/layout/Loader'

import { getCurrentUserToken, $API, showLoader, hideLoader, tappingElement, Toast } from '../../../functions'

export default class UsersAction extends React.Component {
    constructor () {
        super()

        this.state = {
            currentRole: window.__user_role
        }

        this.deleteUser = this.deleteUser.bind(this)
        this.loadUsers = this.loadUsers.bind(this)
    }

    loadUsers () {
        const TOKEN = getCurrentUserToken();
        axios.post(`${API.host}/admin/users`, {}, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            if(response.data.success) {
                this.setState(() => ({
                    users: response.data.data,
                    currentRole: window.__user_role
                }))
            }
        })
    }

    componentDidMount () {
        this.loadUsers()

        tappingElement()
    } 
    
    deleteUser (id, index) {
        if(confirm("Вы точно хотите удалить этого пользователя?")) {
            showLoader()
            $API.delUser(id, data => {
                if(data.success) {
                    let users = this.state.users
                    users.users.splice(index, 1)
    
                    Toast(data.error_message, data.success ? 'green' : 'red')

                    this.setState(() => ({ users }))
                    hideLoader()
                }
            })
        }
    }

    render() {
        return (
            
            <div className="Tsds__page Tsds__page--users" id="users-page">
                <h1>Пользователи</h1>

                <div className="Tsds__page--users__table tapping-scrolling">
                    {
                        (this.state.users) ? <TableUsers loadUsers={this.loadUsers} onDeleteUser={this.deleteUser} totalRole={this.state.currentRole} data={this.state.users} /> : <Loader />
                    }
                </div>
            </div>
        )
    }
}