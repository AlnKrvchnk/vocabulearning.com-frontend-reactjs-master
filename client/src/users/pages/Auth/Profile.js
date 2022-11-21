import React from 'react'

import API from '../../../config/API'
import axios from 'axios'

import Input from '../../../global-components/layout/Input' 
import Button from '../../../global-components/layout/Button'

import { formObject, getCurrentUserToken, Toast } from '../../../functions'
import M from 'materialize-css'
import Loader from '../../../global-components/layout/Loader'
import Statistic from './Statistic'
import ChatWidget from '../../../global-components/ChatWidget'

import { File } from '../../../global-components/layout/Inputs'

let TOKEN = getCurrentUserToken();

export default class Profile extends React.Component {
    constructor (props) {
        super(props)
        
        this.state = {
            user: window.userData,
            loadingStatistic: true,
            statisticCourses: null,
            defaultColorSave: 'default'
        }
        
        this.exitUser = this.exitUser.bind(this);
        this.parseBlur = this.parseBlur.bind(this)
    }

    exitUser () {
        this.setState(() => ({
            user: null
        }))

        this.props.onUserExit();
    }

    componentDidMount () {
        axios.get(API.host + '/api/user/statistic', {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            const data = response.data;
            if(data.success) {
                this.setState(() => ({
                    loadingStatistic: false,
                    statisticCourses: data.data
                }))
            }
        })  

        setTimeout(() => {
            if(this.state.loadingStatistic) {
                this.setState(() => ({
                    loadingStatistic: false
                }))
            }
        }, 5000)
    }

    updateUser (form) {
        let UserFormData = new FormData(form)

        UserFormData.append('login', userData.data.login)
        UserFormData.append('token', TOKEN)

        // Загружаем аватарку
        if(form.preview.files.length)
            UserFormData.append('preview', form.preview.files[0])

        if(this.state.defaultColorSave !== 'default') {
            axios.put(`${API.host}/profile`, UserFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                const data = response.data;
                if(data.success) {
                    axios.post(`${API.host}/profile`, {
                        login: userData.data.login,
                        token: TOKEN
                    }).then(profileResponse => {
                        const dataProfileResponse = profileResponse.data;
                        this.props.onProfileUpdate(dataProfileResponse)
                        this.setState(() => ({ defaultColorSave: 'default' }))
    
                        Toast(data.message, 'green')
                    })
                } else {
                    Toast(data.error_message, 'red' )
                }
            })
        } else {
            Toast('Вы не изменили профиль', 'default')
        }
    }

    parseBlur () {
        const data = this.state.user.data.info
        const formData = formObject( document.getElementById('profile-form') )
        let formObjectData = {};

        let invalids = false
        for(let key in formData) {
            if(data[key] || data[key] !== undefined) {
                formObjectData[key] = formData[key];
                if(data[key] != formData[key]) invalids = true
            }
        }

        if(invalids) {
            this.setState(() => ({ defaultColorSave: 'green' }))
        } else {
            this.setState(() => ({ defaultColorSave: 'default' }))
        }
    }

    render () {
        const login = this.state.user.data.login;
        const { first_name, last_name, email, registered_at, phone, group_name, course_name } = this.state.user.data.info

        return (
            <div className="Tsds-english__profile">
                <ChatWidget />

                <p className="col">Дата регистрации: {registered_at} по Московскому времени</p>
                <form id="profile-form" onSubmit={e => {
                    e.preventDefault();
                    this.updateUser(e.target);
                }}>
                    <div className="row">
                        <Input onBlurring={this.parseBlur} val={first_name} col={6} name={'first_name'} label={'Имя'} />
                        <Input onBlurring={this.parseBlur} val={last_name} col={6} name={'last_name'} label={'Фамилия'} />

                        <Input onBlurring={this.parseBlur} val={group_name} col={6} name={'group_name'} label={'Группа'} />
                        <Input onBlurring={this.parseBlur} val={course_name} col={6} name={'course_name'} label={'Курс'} />
                    </div>

                    <div className="row">
                        <Input disabled col={6} label={login} />
                        <Input disabled type={'email'} col={6} label={email} />
                    </div>

                    <div className="row">
                        <Input onBlurring={this.parseBlur} val={phone} col={6} name={'phone'} label={'Номер телефона'} />

                        <div id="profile-avatar">
                            <img src={API.host + userData.data.info.avatar} width={120} />
                        </div>
                        <input onChange={this.parseBlur} type="file" name="preview" placeholder="Выберите файл аватара" />
                    </div>

                    <div className="row">
                        <Button submit color={this.state.defaultColorSave} title={'Обновить'} />
                        <Button color={'red'} onChange={this.exitUser} title={'Выход'} />
                    </div>
                </form>
                { this.state.loadingStatistic ? <Loader /> : <Statistic isAdminPage={false} data={this.state.statisticCourses} /> }
            </div>
        )      
    }
}