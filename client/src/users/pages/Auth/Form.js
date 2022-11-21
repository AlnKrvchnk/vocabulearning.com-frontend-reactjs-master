import React from 'react'

import Button from '../../../global-components/layout/Button'
import Input from '../../../global-components/layout/Input'

import API from '../../../config/API'
import { Toast, closeSidebar } from '../../../functions'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ResetPassword from '../ResetPassword/ResetPasswordComponent'

export default class AuthForm extends React.Component {
    constructor (props) {
        super(props)
        this.submitForm = this.submitForm.bind(this)
    }

    submitForm (form) {
        const login = form.login.value;
        const password = form.password.value;

        if(login.length > 2 & password.length > 2) {
            axios.post(`${API.host}/auth`, {
                login, password
            }).then(response => {
                if(response.data) {
                    const { data } = response;
                   
                    if(data.success && data.token) {
                        this.props.onAuthorize(data)
                    } else {
                        Toast(data.error_message, 'red');
                    }
                }
            })
        }
    }

    componentDidMount () {
        this.form.reset()
        closeSidebar()
    }

    render () {
        return (
            <div className="row center">
                <div className="col m3 s0"></div>
                <form ref={el => this.form = el} onSubmit={e => {
                    e.preventDefault();
                    this.submitForm(e.target)
                }} className="col m6 s12">
                    <div className="row">
                        <Input label={'Логин или E-mail'} name={'login'} isRequire />
                    </div>
                    <div className="row">
                        <Input type={'password'} name={'password'} label={'Пароль'} isRequire />
                    </div>
                    <ResetPassword />
                    <div className="row center-align">
                        <Button color={'blue'} title={'Войти'} large submit />
                    </div>
                </form>
                <div className="col m3 s0"></div>
            </div>
        )      
    }
}