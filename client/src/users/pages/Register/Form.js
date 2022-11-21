import React from 'react'

import Button from '../../../global-components/layout/Button'
import Input from '../../../global-components/layout/Input'

import { formObject, localSave, Toast, showLoader, hideLoader, getCurrentUserToken, closeSidebar } from '../../../functions'

import API from '../../../config/API'
import axios from 'axios'
import ResetPassword from '../ResetPassword/ResetPasswordComponent'


export default class RegisterForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            worldtimeapi: null,
            formShow: true
        }


        this.loadGeo = this.loadGeo.bind(this)
        this.onSubmitFormRegister = this.onSubmitFormRegister.bind(this)

        this.form = React.createRef()
        this.resetForm = this.resetForm.bind(this)
    }

    resetForm (formShow = false) {
        this.setState(() => ({
            formShow
        }), () => {
            if(!formShow)
                this.resetForm(true)
        })
    }

    onSubmitFormRegister (event) {
        event.preventDefault();
        let data = formObject(event.target);
        const { password, password_repeat } = data;
        showLoader('Проводим процесс регистрации...');

        // Чистим форму
        this.resetForm()

        // Загружаем часовой пояс москвы
        if(this.state.worldtimeapi) {
            let responseWT = this.state.worldtimeapi
            data.world_data = responseWT

            if(password !== password_repeat) {
                Toast('Пароли не совпадают!', 'red');
            } else {
                axios.get('//api.sypexgeo.net/json/' + responseWT.client_ip).then(geoData => {
                    if(geoData.data && geoData.status >= 200) {
                        data.geoData = geoData.data;

                        axios.post(`${API.host}/register`, data).then(response => {
                            if(response.data) {
                                const dataRegister = response.data;

                                hideLoader(dataRegister.error_message);
                                Toast(dataRegister.error_message, 'green')
                                
                                this.resetForm()

                                if(!dataRegister.success) {
                                    alert(dataRegister.error_message);
                                    /*axios.post(`${API.host}/auth`, {
                                        login: data.login,
                                        password: data.password
                                    }).then(responseAuth => {
                                        if(responseAuth.data) {
                                            const responseAuthData = responseAuth.data;
                                            localSave('USER', JSON.stringify(responseAuthData));
                                            location.href = '/auth';
                                        }
                                    })*/
                                } 
                            }
                        })
                    }
                })
            }    
        }
    }

    loadGeo (cb = null) {
        let loadMoscowApi = () => {
            axios.get('//api.db-ip.com/v2/free/self').then(response => {

                if(response.data) {
                    let date = new Date();
                    let dateCurrent = date.toLocaleDateString().replace(/\./g, '-').split('-').reverse().join('-')
                    let timeCurrent = new Date().toLocaleTimeString()

                    const d = response.data
                    const worldtimeapi = {
                        client_ip: d.ipAddress,
                        datetime: dateCurrent + 'T' + timeCurrent,
                        data: {
                            ...d
                        }
                    }

                    console.log(worldtimeapi)

                    this.setState(() => ({ worldtimeapi }))
                }
            }).catch(error => {
                loadMoscowApi()
            })
        }

        loadMoscowApi()
    }

    showTeacherRow() {
        const teacherRows = document.querySelectorAll(`.teacher__row`);
        teacherRows.forEach((item) => {
            item.classList.contains(`d--none`) ? item.classList.remove(`d--none`) : item.classList.add(`d--none`)
        })
    }

    componentDidMount () {
        if(getCurrentUserToken()) {
            location.href = '/auth'
        }

        closeSidebar()

        this.loadGeo()
        this.form.current.reset();
    }

    render () {
        
        if(!this.state.formShow)
            return ''

        return (
            <div className="row register__row">
                <div className="register__message">
                    <div className="register__text">
                        <h3>Зарегистрируйтесь прямо сейчас!</h3>
                        <p>Учетная запись на Vocabulearning необходима, чтобы продолжить изучать курсы или создать свой!</p>
                        <p>Изучайте новое вместе с нами!</p>
                    </div>
                </div>
                <form ref={this.form} onSubmit={this.onSubmitFormRegister} className="register-form">
                    <div className="row">
                        <Input label={'Логин'} name={'login'} isRequire />
                    </div>
                    <div className="row">
                        <Input type={'email'} name={'email'} label={'E-mail'} isRequire={'required'} />
                    </div>
                    <div className="row password__row">
                        <Input type={'password'} generate minLength={6} autocomplete={'new-password'} name={'password'} label={'Пароль'} isRequire={'required'} />
                    </div>
                    <div className="row">
                        <Input type={'password'} minLength={6} autocomplete={'new-password'} name={'password_repeat'} label={'Повторите пароль'} isRequire={'required'} />
                    </div>
                    <a href="" className="register-form__teacherLink" onClick={(evt) => {evt.preventDefault(); this.showTeacherRow()}}>Для студентов ВУЗов</a>
                    <div className="row teacher__row d--none">
                        <Input name={'name'} label={'Имя'} />
                    </div>
                    <div className="row teacher__row d--none">
                        <Input name={'group_name'} label={'Группа'} />
                    </div>
                    <div className="row teacher__row d--none">
                        <Input name={'course_name'} label={'Курс'} />
                    </div>
                    <div className="row">
                        <label className={'register-form__agree'}>
                            <input defaultChecked={true} required type="checkbox" />
                            <span>Согласен на <a target="_blank" href="/policy">обработку персональных данных</a></span>
                        </label>
                    </div>
                    <div className="row resetpassword__row">
                        <ResetPassword />
                    </div>
                    <div className="row center-align">
                        <Button title={'Регистрация'} submit color={'#1BBC9B'} customClass={'btn-new btn-new--green margin--auto'} />
                    </div>
                </form>
            </div>
        )
    }
}
