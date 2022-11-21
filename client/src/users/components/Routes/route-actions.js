import React from 'react'

import RegisterForm from '../../pages/Register/Form'
import Courses from '../Courses'
import FilterCourseForm from '../../pages/Index/FilterCourseForm'
import Modal from '../../../global-components/layout/Modal'
import L from '../../../config/languege'
import { getCurrentUserToken, Toast, $doUser, showComponent, redirect, openModal } from '../../../functions'

import axios from 'axios'
import API from '../../../config/API'

// auth page
import Loader from '../../../global-components/layout/Loader'
import AuthForm from '../../pages/Auth/Form'
import Profile from '../../pages/Auth/Profile'

// courses page
import {
    DisplayCourse
} from '../../pages/SingleCourse/index'
import Input from '../../../global-components/layout/Input'
import Button from '../../../global-components/layout/Button'
import LessonHeadsModal from '../../pages/SingleCourse/components/LessonHeadsModal'

import TestsWidget from '../../../admin/routes/actions/components/TestsAction/TestsWidget'
import LemmaTexts from '../../../admin/components/lemma/LemmaTexts'

import Footer from '../Footer'

// contacts page
import Contacts from '../../pages/Contacts/Contacts'

// prices page
import Prices from '../../pages/Prices/Prices'
import LandingCoursePage from "../../pages/LandingCourse";

// change language
import ChangeLanguage from '../../../global-components/layout/ChangeLanguage/ChangeLanguage';

import CourseGlavsChanges
    from "../../../admin/routes/actions/components/IndexAction/components/CourseGlavsChange/CourseGlavsChange";
import { LinkA } from '../../../global-components/Elements'
import { VModal, VModalAction } from '../../../global-components/layout/VModal'

export class IndexAction extends React.Component {
    constructor () {
        super()

        this.state = {
            listCourses: null,
            courses_length: null
        }

        this.filterCourses = this.filterCourses.bind(this)
        this.parseSearch = this.parseSearch.bind(this)
        this.showCoursesAmount = this.showCoursesAmount.bind(this)
    }

    getCourses () {
        axios.post(`${API.host}/courses`).then(response => {
            this.setState(() => ({ listCourses: response.data.data }))
        })
    }


    filterCourses (filteringCourses, loading = true) {
        if(filteringCourses.length || loading) {
            this.setState(() => ({ listCourses: filteringCourses }))
        } else {
            this.getCourses()
        }
    }

    parseSearch (val) {
        if(val.length == 0) {
            this.getCourses()
        } else {
            let otherFilter = (self.globalFilterData !== undefined) ? self.globalFilterData : {
                name: '',
                author: '',
                langueges: ''
            }
            axios.post(API.host + '/api/search', {
                type: 'course',
                search_string: val,
                otherFilter
            }).then(response => {
                let data = response.data;

                this.setState(() => ({ listCourses: data.courses }))
            })
        }
    }

    showCoursesAmount () {
        if(!this.state.courses_length) axios.post(`${API.host}/courses`)
            .then(response => {
                this.setState(prevState => ({
                    courses_length: response.data.data.length
                }))
        })
    }

    componentDidMount () {
        self.setMenuComponentShow('')
    }

    get SearchFormComponent () {
        return (<React.Fragment>
            <div className="Tsds-english__page__search">
                <input
                    type="search" name="search"
                    onKeyUp={e => {
                        // 13 - Enter
                        if(e.keyCode == 13 || e.target.value.length == 0) this.parseSearch(e.target.value)
                    }}
                    // placeholder={__e.f('search_field', 'Поле - Поиск по курсам')}
                    className="Tsds-english__page__search__input"
                />
                <a className="Tsds-search-icon">
                    <img src="img/icons/icon_feather_search.svg" alt=""/>
                </a>
            </div>
            <FilterCourseForm onUpdate={this.filterCourses}/>
        </React.Fragment>)
    }

    render() {

        return (
            <div className="Tsds-english__page Tsds-english__page--index">
                <div className="container">
                    <a id={"top"}></a>
                    <div className="Tsds-english__language display--desktop">
                        <div className="Tsds-english__language-selector">
                            <p className="small__subheading">Язык интерфейса</p>
                            <div className="Tsds-english__language-selector__block">
                                <a href="#modal-change-language" className="modal-trigger" onClick={(evt) => {evt.preventDefault(); openModal(`modal-change-language`)}}>
                                    Выбрать
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container Tsds-english__page__container">
                    <div className="row display--mob">
                        <div className="Tsds-english__page__mobileNav">
                            <LinkA className="Tsds-english__mob__filter" onClick={() => {
                                VModalAction({
                                    id: 'courses-filters',
                                    type: 'OPEN'
                                })
                            }}>
                                <img src="/img/icons/icon-mobile-main-menu.svg" alt=""/>
                            </LinkA>

                            <LinkA className="Tsds-english__mob__language" onClick={() => {openModal(`modal-change-language`)}}>
                                <img src="/img/icons/icon-mobile-main-language.svg" alt=""/>
                            </LinkA>
                        </div>
                    </div>
                    <div className="row">
                        <div className="Tsds-english__sidebar">
                            {/*
                            //TODO - разместить куда-то заголовок страницы
                            <div className="Tsds-english__page__title">
                                <h1>{__e.f('title', 'Заголовок страницы')}</h1>
                            </div> */}
                            {this.showCoursesAmount()}
                            <div className="Tsds-english__page__filter">
                                {screen.width > 600 && <>
                                    <p className="small__subheading">Поиск по курсам</p>
                                    {this.SearchFormComponent}

                                    <div className="Tsds-english__page__coursesFound">
                                        <p>Общее число курсов: <span>{this.state.courses_length}</span></p>
                                        <p>Найдено курсов: <span>{this.state.listCourses > 0 ? this.state.listCourses.length : '0'}</span></p>
                                    </div>
                                </>}
                            </div>
                        </div>
                        <div className="Tsds-english__page__courses">
                            <Courses list={this.state.listCourses} />
                        </div>
                    </div>
                </div>
                {showComponent('footer', true)}

                <VModal id={'courses-filters'}>
                    <p className="small__subheading">Поиск по курсам</p>
                    <div className="Tsds-english__page__search">
                        <input
                            type="search" name="search"
                            onKeyUp={e => {
                                // 13 - Enter
                                if(e.keyCode == 13 || e.target.value.length == 0) this.parseSearch(e.target.value)
                            }}
                            // placeholder={__e.f('search_field', 'Поле - Поиск по курсам')}
                            className="Tsds-english__page__search__input"
                        />
                        <a className="Tsds-search-icon">
                            <img src="img/icons/icon_feather_search.svg" alt=""/>
                        </a>
                    </div>
                    <FilterCourseForm onUpdate={this.filterCourses}/>
                </VModal>
                
                <Modal modalClass={'change-language'} content={ChangeLanguage} data={''} />

                <a href={"#top"} className={"button__top"}>
                    <i className="material-icons">expand_less</i>
                </a>
            </div>
        );
    }
}

export class RegisterAction extends React.Component {
    constructor () {
        super()
    }

    addRegisterUser () {

    }

    render () {

        return (
            <div className="Tsds-english__page Tsds-english__page--register container">
                <h1 className="center-align">{L.current.pages.register.title}</h1>

                <RegisterForm onRegister={this.addRegisterUser} />
            </div>
        )
    }
}

export class LandingCourseAction extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            land_loaded: false
        }
    }

    componentDidMount () {
        const { id = 0 } = this.props

        axios.post(API.host + '/courses/' + id).then(response => {
            const data = response.data

            if(data.data) {
                axios.get(API.host + '/api/users/' + data.data.author_id).then(response_author => {
                    axios.get(API.host + '/words/' + data.data.id).then(response_words => {
                        const data_words = response_words.data

                        if(data_words.data) {
                            this.setState(() => ({
                                ...data_words.data,
                                total_author: response_author.data.data,
                                land_loaded: true
                            }))
                        }
                    })
                })
            } else {
                return redirect('/')
            }
        })
    }

    render() {
        const { id } = this.props
        const { land_loaded } = this.state

        return (
            <div id={'land-' + id} className="Tsds-english__page Tsds-english__page-landing">
                <div className="container">
                    {land_loaded ? <LandingCoursePage course={this.state} /> : <Loader />}
                </div>
            </div>
        )
    }
}

export class SingleCourseAction extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            courseUrl: props.url,
            course_heads: [],
            courseHasFind: false,
            course: null,
            loadingCourseText: 'Идет загрузка курса...'
        }

    }

    componentDidMount () {
        const { url, head_id = 0 } = this.props;
        const TOKEN = getCurrentUserToken();

        axios.post(`${API.host}/courses/${url}/${head_id}`, {}, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            const data = response.data, $course = data.data

            self.setMenuComponentShow(<React.Fragment>
                <div className="lesson_description">
                    <h5>{$course.name}</h5>
                    <p>
                        <span>Категория:</span> {$course.category_name}
                    </p>
                    <p>
                        <span>Язык курса:</span> {$course.langueges}
                    </p>
                    <p>
                        <span>Термины:</span> {$course.languege_termins}
                    </p>
                    <p>
                        <span>Автор:</span> {$course.author}
                    </p>
                    <p>
                        <span>Стоимость:</span> {$course.price} руб.
                    </p>
                    <p>
                        <span>Количество слов:</span> {$course.words.length}
                    </p>
                </div>
            </React.Fragment>)

            axios.get(`${API.host}/api/courses-heads/${data.data.id}`).then(responseHead => {
                this.setState(() => ({ course_heads: responseHead.data.data }))
            })

            if(data.success) {
                let resultData = data.data;
                const DEFAULT_WORDS_LENGTH = 50;
                let currentWordsLength = resultData.words.length;
                const REMAINDER_WORDS_LENGTH = DEFAULT_WORDS_LENGTH - currentWordsLength;

                if(REMAINDER_WORDS_LENGTH > 0 && resultData.user_subscribed) {
                    const MAX_ITERATIONS = Math.round(REMAINDER_WORDS_LENGTH / currentWordsLength)
                    const wordsResult = resultData.words.slice(0, currentWordsLength);
                    for (let i = 0; i < MAX_ITERATIONS; i++) {
                        resultData.words.push( ...wordsResult )
                    }

                    window.lastCourseWords = resultData.words;
                }

                this.setState(() => ({
                    courseHasFind: true,
                    course: resultData
                }))
            } else {
                this.setState(() => ({
                    loadingCourseText: data.error_message
                }))
            }
        })
    }

    render () {
        const { head_id = 0, url } = this.props

        let currentHead = this.state.course_heads && this.state.course_heads.filter(item => item.id == head_id)
            currentHead = currentHead.length ? currentHead[0] : {}

        return (
            <React.Fragment>
                {
                    (this.state.courseHasFind && this.state.course !== null) ? (
                        <div className="Tsds-english__page Tsds-english__page-singlecourse">
                            <div className="container">

                            <DisplayCourse currentHead={currentHead} head_id={head_id} info={this.state.course} />

                            <Modal modalClass={'tests'} data={{
                                course_id: this.state.course.id,
                                all_loading_courses: true
                            }} content={TestsWidget}  />

                            <Modal modalClass={'book-reader'}
                                data={{
                                    is_course_page: true,
                                    course_id: this.state.course.id,
                                    heads: this.state.course_heads,
                                    courseUrl: url
                                }}
                                content={LemmaTexts}
                            />

                            <Modal modalClass={'heads'} data={{
                                course_heads: this.state.course_heads,
                                active_head_id: head_id,
                                courseUrl: url
                            }} content={LessonHeadsModal} />
                            </div>
                            {showComponent('footer', false)}
                        </div>
                    ) :
                    <div className="Tsds-english__page">
                        <div className="container">
                        <h3>{this.state.loadingCourseText}</h3>
                        </div>
                        {showComponent('footer', false)}
                    </div>

                }

            </React.Fragment>
        )
    }
}

export function CoursesAction () {
    //{L.current.pages.courses.title}
    return (
        <div className="Tsds-english__page Tsds-english__page--courses container">
            <h1 className="center-align">{__e.f('title', 'Заголовок страницы курсов')}</h1>

            <Courses />
        </div>
    )
}

export function ContactsAction () {
    //{L.current.pages.courses.title}
    return (
        <div>
            <div className="Tsds-english__page Tsds-english__page--contacts container">
                <h1 className="center-align">Контакты</h1>

                <Contacts />

            </div>
            {showComponent('footer', true)}
        </div>
    )
}

export function PricesAction () {
    //{L.current.pages.courses.title}
    return (
        <div>
            <div className="Tsds-english__page Tsds-english__page--contacts container">
                <h1 className="center-align">Тарифы</h1>

                <Prices />

            </div>
            {showComponent('footer', true)}
        </div>
    )
}

export class PasswordResetAction extends React.Component {
    constructor (props) {
        super(props)

        this.parseSubmit = this.parseSubmit.bind(this);
    }

    parseSubmit ($form) {
        const { param, data } = this.props
        const p1 = $form.new_pass.value;
        const p2 = $form.new_pass_again.value;

        if(p1 !== p2) {
            Toast('Пароли не совпадают!', 'red')
            return;
        } else {
            const form_data = new FormData($form);
            axios.post(API.host + '/auth/reset/' + param + '/' + data, form_data).then(response => {
                if(response.data) {
                    const response_data = response.data;

                    setTimeout(function () {
                        location.href = '/';
                    }, 3000);

                    Toast(response_data.error_message, (response_data.success) ? 'green' : 'red')
                }
            })
        }
    }

    render() {
        const { param, data } = this.props

        return (
            <div className="Tsds-english__page Tsds-english__page--passreset container">
                <div className="row center">
                    <div className="col m3 s0"></div>
                    <form onSubmit={e => {
                        e.preventDefault();
                        this.parseSubmit(e.target);
                    }} className="col m6 s12">
                        <h3 className="center-align">Восстановление пароля</h3>
                        <div className="row">
                            <Input type={'password'} label={'Новый пароль'} name={'new_pass'} isRequire />
                        </div>
                        <div className="row">
                            <Input type={'password'} name={'new_pass_again'} label={'Повторите пароль'} isRequire />
                        </div>
                        <div className="row center-align">
                            <Button color={'blue'} title={'Восстановить пароль'} large submit />
                        </div>
                    </form>
                    <div className="col m3 s0"></div>
                </div>
            </div>
        )
    }
}

export class AuthorizationAction extends React.Component {
    constructor () {
        super()

        this.state = {
            isUserLoggedIn: false
        }

        this.userAuth = this.userAuth.bind(this)
        this.onUserExit = this.onUserExit.bind(this)
        this.saveUser = this.saveUser.bind(this)
    }

    saveUser (data) {
        // ACTION-авторизация
        $doUser('AUTH', data)

        this.setState(() => ({
            isUserLoggedIn: true
        }))
    }

    userAuth (response) {
        this.saveUser(response)
        location.href = '/auth';
    }

    componentDidMount () {
        if(window.userData) {
            this.setState(() => ({
                isUserLoggedIn: true
            }))
        }
    }

    onUserExit (exit_path = '/') {
        this.setState(() => ({
            isUserLoggedIn: false
        }))

        // ACTION выход
        $doUser('EXIT', exit_path)
    }

    render() {
        return (
            <div className="Tsds-english__page Tsds-english__page--auth container">
                <h1 className="center-align">{
                    (this.state.isUserLoggedIn) ? L.current.pages.profile.title : L.current.pages.auth.title
                }</h1>

                {
                    (this.state.isUserLoggedIn) ? <Profile onProfileUpdate={this.saveUser} onUserExit={this.onUserExit} /> :
                    <AuthForm onAuthorize={this.userAuth} />
                }
            </div>
        )
    }
}

export default function DefaultPage (props) {
    const { title = '', descr = '' } = props.data

    return (
        <div className="Tsds-english__page container">
            <h3>{title}</h3>

            <p dangerouslySetInnerHTML={{__html: descr}}></p>
        </div>
    )
}
