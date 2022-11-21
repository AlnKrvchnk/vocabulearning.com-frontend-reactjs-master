import React from 'react'
import './index.less'
import { $API, $doUser } from '../../../functions'

import Menu from '../Header/Menu'
import Dropdown from "../../../global-components/layout/Dropdown";
import API from '../../../config/API';
export default class AuthChecker extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            menu_component_double: ''
        }

        this.setMenuComponentShow = this.setMenuComponentShow.bind(this)

        self.setMenuComponentShow = this.setMenuComponentShow
    }

    setMenuComponentShow ($component) {
        this.setState(() => ({ menu_component_double: $component }))
    }

    componentDidMount () {
        // Проверяем (парсим авторизацию). Если пользователь не авторизован - выбрасываем его из профиля
        if(this.props.token && self.userData) {
            let checker_authorization = setInterval(() => {
                $API.getUser(data => {
                    if(!data.success) {
                        clearInterval(checker_authorization)
                        $doUser('EXIT', '/auth')
                        return
                    }
                })
            }, 5000)
        }
    }

    render() {
        const { token } = this.props

        function profileWindowClose(e){
            e.preventDefault();
            let profileWindow = document.querySelector('.user_profile_mobile_menu')
            profileWindow.classList.contains('user_profile_mobile_menu_open') ? profileWindow.classList.remove('user_profile_mobile_menu_open') : null
        }

        let authorisationContent = '';

        const adminLocation = window.location.pathname.indexOf('admin');

        if(self.userData && adminLocation == 1) {
            const user = self.userData;
            authorisationContent =
            <div className={'fingman_admin_main_user_wrapper'}>
                <div className={'fingman_admin_user_wrapper'}>
                    <div className={'avatar'}>
                        <img src={API.host + user.data.info.avatar} />
                    </div>
                    <div className={'admin_user_border'}></div>
                    <p>{user.role_text}</p>
                </div>
                <div className={'fingman_admin_user_description_wrapper'}>
                    <div>
                        <h4>{user.data.login}</h4>
                        <a href={""}>Перейти в профиль</a>
                        <a href={'/logout'}>Выйти</a>
                    </div>

                </div>
            </div>
        }
        else if(self.userData && adminLocation !== 1) {
            const user = self.userData;
            authorisationContent =
                <div className="user_profile_menu">
                    <div className="user_profile_left">
                        <div className="user_profile_mobile_menu_icon">
                            <div className="user_profile_icon">
                                <img width={75} src={API.host + user.data.info.avatar} />
                            </div>
                        </div>
                        <div className="user_profile_title">
                            <h4>{user.data.login}</h4>
                            <h6>{user.role_text}</h6>
                        </div>
                        <div>
                            <ul className="user_profile_mobile_menu_items">
                                <li>
                                    <a href={"/auth"}>Перейти в профиль</a>
                                </li>
                                <li>
                                    <a href={"#modal-payment-course"} className={"modal-trigger"}>Оплатить курс</a>
                                </li>
                                <li>
                                    <a href={"/"}>Все курсы</a>
                                </li>
                                <li className="inactive">Мои курсы</li>
                                <li>
                                    {/*TODO - перенести сюда проверку isAdmin*/}
                                <a href="/admin/">Кабинет учителя</a>
                                </li>
                            </ul>
                        </div>

                        {this.state.menu_component_double}

                        {/*<div className="user_profile_mobile_close">*/}
                        {/*    /!*<img src="../img/icons/down_icon.svg" />*!/*/}
                        {/*    <i className={"fa fa-chevron-left"}></i>*/}
                        {/*</div>*/}
                        <Dropdown
                            title={'Язык'}
                            items={[
                                'Русский', 'English'
                            ].sort()}
                            icons={[
                                '/img/icons/icon-russian.svg',
                                '/img/icons/icon-english.svg'
                            ]}
                            onChange={languege => {
                                localStorage.setItem('lang', languege);
                                location.reload();
                            }}
                            local={'lang'}
                        />
                        </div>

                    <a className="user_profile_close" href={""} onClick={profileWindowClose}>
                        <i className={"fa fa-chevron-left"}></i>
                    </a>
                </div>
        } else {
            authorisationContent =
                <div className="user_profile_menu">
                    <div className="user_profile_left">
                        <p>
                            Вы не авторизованы. Пожалуйста, <a href="/auth">авторизируйтесь</a> для того, чтобы получить доступ ко всем функциям
                        </p>
                        <ul className="user_profile_mobile_menu_items">
                            <Menu />
                        </ul>
                    </div>
                    <a className="user_profile_close" href={""} onClick={profileWindowClose}>
                        <i className={"fa fa-chevron-left"}></i>
                    </a>
                </div>
        }
        return (
            <React.Fragment>
                {authorisationContent}
            </React.Fragment>
        )
    }
}
