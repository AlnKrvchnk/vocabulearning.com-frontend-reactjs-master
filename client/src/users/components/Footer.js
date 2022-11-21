import React from 'react';
import './Footer/footer.less';

import {Link} from 'react-router-dom';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teacherLinks: [
                {link: "/", text: 'Как создать курс'},
                {link: "/contacts/", text: 'Контакты'},
                {link: "/tarify/", text: 'Тарифы'},
                {link: "/", text: 'О нас'},
                {link: "/", text: 'Вакансии'},
                {link: "/", text: 'Блог'},
                {link: "/", text: 'Связаться с нами'}
            ],
            studentLinks: [
                {link: "/", text: 'Как учиться'},
                {link: "/", text: 'Вопросы и ответы'},
            ]
        }
    }
    render() {
        return (
            <React.Fragment>
                <footer className='Tsds-english__footer'>
                    <div className="container">
                        <div className="row">
                            <div className="Tsds-english__footer__item">
                                <div className="Tsds-english__footer__category">
                                    <p>Преподавателю</p>
                                </div>
                                <div className="Tsds-english__footer__menu">
                                    <ul>
                                        {this.state.teacherLinks.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <Link to={item.link}>
                                                        {item.text}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="Tsds-english__footer__item">
                                <div className="Tsds-english__footer__category">
                                    <p>Ученику</p>
                                </div>
                                <div className="Tsds-english__footer__menu">
                                    <ul>
                                        {this.state.studentLinks.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <Link to={item.link}>
                                                        {item.text}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="Tsds-english__footer__item">
                                    <div className="Tsds-english__footer__category">
                                    <p>Навигация</p>
                                </div>
                                <div className="Tsds-english__footer__menu">
                                    <ul>
                                        <li>
                                            <Link to={''}>Перейти в профиль</Link>
                                        </li>
                                        <li>
                                            <Link to={''}>Оплатить курс</Link>
                                        </li>
                                        <li>
                                            <Link to={''}>Все курсы</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="Tsds-english__footer__item">
                                    <div className="Tsds-english__footer__category">
                                    <p>Связь с нами</p>
                                </div>
                                <div className="Tsds-english__footer__menu">
                                    <ul className="Tsds-english__footer__social__list">
                                        <Link className="Tsds-english__footer__social__item" to={'/'}>
                                            <i className={'fab fa-instagram'}></i>
                                        </Link>
                                        <Link className="Tsds-english__footer__social__item" to={'/'}>
                                            <i className={'fab fa-facebook-f'}></i>
                                        </Link>
                                        <Link className="Tsds-english__footer__social__item" to={'/'}>
                                            <i className={'fab fa-vk'}></i>
                                        </Link>
                                        <Link className="Tsds-english__footer__social__item" to={'/'}>
                                            <i className={'fas fa-envelope'}></i>
                                        </Link>
                                    </ul>
                                </div>
                            </div>
                            <div className="Tsds-english__footer__item">
                                <div className="Tsds-english__footer__category">
                                    <p>Подписаться на новости</p>
                                </div>
                                <div className="Tsds-english__footer__menu">
                                    <form className="Tsds-english__footer__subscribe">
                                        <input type="email" placeholder="Ваш e-mail"/>
                                        <button type="submit" className="Tsds-english__footer__subscribe__btn">Подписаться</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/*<div className="row">*/}
                        {/*    <div className="Tsds-english__footer__left">*/}
                        {/*        <Link to={'/'} className='Tsds-english__footer__logo'>*/}
                        {/*            <img src="../img/sidebar-logo.png" alt=""/>*/}
                        {/*        </Link>*/}
                        {/*    </div>*/}
                        {/*    <div className="Tsds-english__footer__right">*/}
                        {/*        <form className="Tsds-english__footer__subscribe">*/}
                        {/*            <input type="email" placeholder="Ваш e-mail"/>*/}
                        {/*            <button type="submit" className="Tsds-english__footer__subscribe__btn">Подписаться</button>*/}
                        {/*        </form>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className="row">*/}
                        {/*    <div className="Tsds-english__footer__left">*/}
                        {/*        <h2 className="Tsds-english__footer__heading">Пообщаемся?</h2>*/}
                        {/*        <a className="Tsds-english__footer__bigtext" href="mailto:support@vocabulearning.com">support@vocabulearning.com</a>*/}
                        {/*        <div className="Tsds-english__footer__social">*/}
                        {/*            <Link className="Tsds-english__footer__social__item" to={'/'}>*/}
                        {/*                <i className={'fab fa-vk'}></i>*/}
                        {/*            </Link>*/}
                        {/*            <Link className="Tsds-english__footer__social__item" to={'/'}>*/}
                        {/*                <i className={'fab fa-linkedin'}></i>*/}
                        {/*            </Link>*/}
                        {/*            <Link className="Tsds-english__footer__social__item" to={'/'}>*/}
                        {/*                <i className={'fab fa-facebook-f'}></i>*/}
                        {/*            </Link>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="Tsds-english__footer__right">*/}
                        {/*        <div className="Tsds-english__footer__right__container">*/}
                        {/*        <div className="Tsds-english__footer__nav">*/}
                        {/*            <h3 className="Tsds-english__footer__nav__heading">Преподавателю</h3>*/}
                        {/*            <ul>*/}
                        {/*                {this.state.teacherLinks.map((item, index) => {*/}
                        {/*                    return (*/}
                        {/*                        <li key={index}>*/}
                        {/*                            <Link to={item.link}>*/}
                        {/*                            {item.text}*/}
                        {/*                            </Link>*/}
                        {/*                        </li>*/}
                        {/*                    )*/}
                        {/*                })}*/}

                        {/*            </ul>*/}
                        {/*        </div>*/}
                        {/*        <div className="Tsds-english__footer__nav">*/}
                        {/*            <h3 className="Tsds-english__footer__nav__heading">Студенту</h3>*/}
                        {/*            <ul>*/}
                        {/*                {this.state.studentLinks.map((item, index) => {*/}
                        {/*                    return (*/}
                        {/*                        <li key={index}>*/}
                        {/*                            <Link to={item.link}>*/}
                        {/*                                {item.text}*/}
                        {/*                            </Link>*/}
                        {/*                        </li>*/}
                        {/*                    )*/}
                        {/*                })}*/}

                        {/*            </ul>*/}
                        {/*        </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className="row">*/}
                        {/*    <div className="Tsds-english__footer__w100">*/}
                        {/*        <p className="Tsds-english__footer__amalltext">&copy; ООО Белталода, 2020</p>*/}
                        {/*        <Link to={'/policy'}>Политика конфиденциальности</Link>*/}
                        {/*        <Link to={'/terms'}>Условия использования</Link>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </footer>
            </React.Fragment>
        )
    }
}