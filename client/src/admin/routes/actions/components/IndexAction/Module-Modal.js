import React from 'react'

import TextInput from '../../../../../global-components/TextInput'
import Button from '../../../../../global-components/layout/Button'
import AudioPlayer from '../../../../../global-components/layout/AudioPlayer/AudioPlayer'
import { File, Select, Vcheckbox } from '../../../../../global-components/layout/Inputs'
import InputToggler from '../../../../../global-components/layout/InputToggler/InputToggler'

import { Row, Col } from '../../../../../global-components/layout/Bootstrap'
import ModuleWord from './Module-Word-Item';

import axios from 'axios'
import API from '../../../../../config/API'

import M from 'materialize-css'

import {
    getCurrentUserToken, fetchLangueges,
    fetchLanguege, updateSelects,
    clearForm,
    formObject,
    Toast,
    $API,
    openModal,
    dynamicSort,
    tappingElement, loadAllAudios,
    closeSidebar
} from '../../../../../functions'

import CourseGlavs from './components/CourseGlavs/CourseGlavs'
import LemmaComponent from '../../../../components/lemma/LemmaComponent'
import Axios from 'axios'
import LemmaTexts from '../../../../components/lemma/LemmaTexts'
import SubtitlesComponent from "../../../../components/subtitles/SubtitlesComponent";
import LandingCourse from './components/LandingCourse'
import ToolTip from '../../../../../global-components/layout/ToolTip/ToolTip'
import TestsWidget from "../TestsAction/TestsWidget";

export default class ModuleModal extends React.Component {
    constructor (props) {
        super(props)

        // default window parameters
        window.currentGlav = { index: 0, id: 0, course_id: 0 }

        this.state = {
            langueges: [],
            defaultColorSave: 'default',
            defaultForm: null,
            form_id: "modal-modules-form",
            currentGlav: window.currentGlav,
            searching: {
                on_word: false,
                search_text: '',

                sorting_element: '',
                sorting_element_value: false
            },

            // Пагинация
            default_slice_value: 10,
            from_slice: 0,
            to_slice: 1
        }

        this.deleteWord = this.deleteWord.bind(this)
        this.parseSubmit = this.parseSubmit.bind(this)
        this.setSaveColor = this.setSaveColor.bind(this)
        this.changeInput = this.changeInput.bind(this)
        this.loadWord = this.loadWord.bind(this)
        this.addOrChangeDomain = this.addOrChangeDomain.bind(this)
        this.updateCurrentGlav = this.updateCurrentGlav.bind(this)
        this.showUsersConnected = this.showUsersConnected.bind(this)
        this.triggerSorting = this.triggerSorting.bind(this)
        this.paginate = this.paginate.bind(this)
        this.onUpdateProperty = this.onUpdateProperty.bind(this)
        this.wordsSelector = this.wordsSelector.bind(this)
        this.setSearchWord = this.setSearchWord.bind(this)

        // Предотавляем глобальный доступ для редактирования фразы
        window.loadWord = this.loadWord
    }

    setSearchWord (val) {
        this.setState(prevState => ({ searching: {
            ...prevState.searching,
            search_text: val
        } }))
    }

    wordsSelector () {
        const changeWordSearchType = (event, val) => {
            event.preventDefault()

            this.setState(prevStage => ({ searching: {
                ...prevStage.searching,
                on_word: val
            } }))
        }

        return <div className={'search__words__tooltip'}>
            <a href={''} onClick={e => changeWordSearchType(e, 1)}>Поиск по фразе</a>
            <a href={''} onClick={e => changeWordSearchType(e, 0)}>Поиск по слову</a>
        </div>
    }

    showUsersConnected () {

        if(this.props.connected_users) {
            return <div className="chips-words">
                <TextInput className="form-control" onInput={this.changeInput} id={'email_connect_user'} name={'email_connect_user'} placeholder={'Введите e-mail пользователя...'} />
                {this.props.connected_users.map((item, i) => {
                    return <div key={i} className="chips-words__chip">{item.email} <i onClick={e => {
                        e.preventDefault()
                        $API.delRoleSettings(item.id, data => {
                            if(data.success)
                                this.props.triggerEvent({ id: this.props.id })

                            Toast(data.error_message, (data.success) ? 'green' : 'red')
                        })
                    }} className="close material-icons">close</i></div>
                })}
            </div>
        }

        return '';
    }

    componentDidMount () {
        {/*TODO - прописать классы из сайдбара вместо .nav-link*/}
        $('.sidebar__item a, .sidebar-item a').each(function () {
            $(this).click(e => {
                const targetId = $(this)[0].id
                history.pushState('', '', targetId)
                loadAllAudios()
            })
        })

        fetchLangueges(data => {
            this.setState(() => ({ langueges: data }))
        })

        loadAllAudios()
    }

    updateCurrentGlav ({ index, id, name }, cd = null) {
        cd = (cd !== null) ? cd : parseInt(this.props.id)

        window.currentGlav = { index, id, course_id: cd  }

        // Устанавливаем название главы для родительского компонента
        this.props.onChangeCurrentGlav(name)

        this.setState(() => ({
            currentGlav: window.currentGlav
        }), () => {
            loadAllAudios()
        })
    }

    addOrChangeDomain (action, domain, courseId) {

        const TOKEN = getCurrentUserToken();
        const TOKEN_OBJECT = {
            headers: {
                'Authorization': TOKEN
            }
        };

        domain = domain.replace(/(http|https)|(www\.|(www))|(\:)|(\/)/g,'');

        switch(action) {
            case 'add':
                axios.post(`${API.host}/domain`, {
                    domain, courseId
                }, TOKEN_OBJECT).then(response => {
                    if(response.data) {
                        const data = response.data;

                        Toast(data.error_message, (data.success) ? 'green' : 'red');
                    }
                })
            break;
            case 'delete':
                if(domain !== '') {
                    axios.delete(`${API.host}/domain/${domain}`, TOKEN_OBJECT).then(response => {
                        if(response.data) {
                            const data = response.data;

                            Toast(data.error_message, (data.success) ? 'green' : 'red');

                            if(data.success) {
                                domain_field.value = '';
                            }
                        }
                    });
                }
            break;
        }
    }

    deleteWord (id) {
        const TOKEN = getCurrentUserToken();

        axios.delete(`${API.host}/words/${id}`, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            const data = response.data;
            if(data.success) {
                M.toast({html: `Фраза успешно удалена!`, classes: '#7b1fa2 purple darken-2'})
                // удаляем фразу из таблицы
                this.props.triggerEvent({ id: this.props.id });
            } else {
                alert(data.error_message);
            }
        })
    }

    componentDidUpdate () {
        for(let key in this.props) {
            if($('#' + key).is('select')) {
                $('#' + key).val(this.props[key])
            }
        }

        tappingElement()
    }

    parseSubmit (form, id) {
        // Создание форму
        const formData = new FormData(form);
        formData.append('course_id', id);
        const TOKEN = getCurrentUserToken();

        // Проверяем, добавляем ли пользователя к текущему курсу
        const email_connect_user = form.email_connect_user || {value:''}
        if(email_connect_user.value !== "") {
            axios.post(API.host + '/api/courses/' + id + '/ADD_USER_TO_COURSE', {
                email: email_connect_user.value
            }, { headers: {'Authorization': TOKEN} }).then(response => {
                const data = response.data

                Toast(data.error_message, (data.success) ? 'green' : 'red')
            })
        }

        // Обновляем курс
        axios.post(`${API.host}/admin/modules/${id}`, formData, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            const data = response.data;

            if(data.success) {
                this.setState(() => ({ defaultColorSave: 'default' }))
                this.props.triggerEvent({ id: this.props.id })
                M.toast({ html: data.message, classes: 'green' })
            } else {
                M.toast({ html: data.error_message, classes: 'red' })
            }
        })
    }

    setSaveColor (color) {
        this.setState(() => ({ defaultColorSave: color }))
    }

    changeInput () {
        let form = this.state.defaultForm

        if(!form) {
            form = formObject( document.getElementById(this.state.form_id) )
            this.setState(() => ({ defaultForm: form }))
        }

        if(form) {
            let currentFormData = formObject( document.getElementById(this.state.form_id) )

            let invalids = false
            for(let kk in form) {
                if((form[kk] !== currentFormData[kk]) && kk !== "preview") invalids = true
            }

            if(invalids) {
                this.setSaveColor('green')
            } else {
                this.setSaveColor('default')
            }
        }
    }

    loadWord (id) {
        axios.get(API.host + '/api/word/' + id)
            .then(response => {
                const data = response.data;
                if(data.data && data.success) {
                    this.props.triggerEvent(null, {
                        event: 'onLoadedInfoWord',
                        newData: data.data
                    })
                }
            })
    }

    // Обновление параметра у курса
    onUpdateProperty (property_name = '', new_value = '', word_id) {
        const TOKEN = getCurrentUserToken()

        Axios.put(API.host + '/words/' + word_id, {
            property_name, new_value
        }, { headers: {'Authorization': TOKEN} }).then(response => {
            const data = response.data

            if(!data.success) {
                Toast(data.error_message ,'red')

                return false
            }

            this.props.triggerEvent({ id: this.props.id })
        })
    }

    componentWillReceiveProps (props) {
        const { data_to_load } = props

        // Данные из попапа "Лемматизация"
        if(data_to_load) {
            if(data_to_load.currentGlav) this.setState(() => ({ currentGlav: data_to_load.currentGlav }))
        }
    }

    triggerSorting (data, new_value = false) {
        this.setState(prevState => ({
            searching: {
                ...prevState.searching,
                sorting_element: data,
                sorting_element_value: (new_value ? new_value : !prevState.searching.sorting_element_value)
            }
        }))
    }

    paginate (from_slice) {
        this.setState(() => ({
            from_slice,
            to_slice: from_slice+1
        }))
    }

    render() {
        let {
            name = '', id = 0, author, description, langueges, preview, price, url,
            ga_code, metrika_code, domain, theme, languege_termins, opened_only_domain,
            is_public, def_audio_success, def_audio_wrong, category_name = '',

            onDeleteModule, onUpdateLemmaData
        } = this.props;

        if(!name && !id) return '';

        const user_role = getCurrentUserToken('role');

        let words = this.props.words || [];

        /**
         * Поиск по ФРАЗЕ / СЛОВУ
         */
        if(this.state.searching.search_text.length >= 2 && words.length) {
            const { search_text, on_word } = this.state.searching
            const searching_element = this.state.searching.on_word ? 'phrase' : 'word'

            words = words.filter(item =>
                item[searching_element].toUpperCase().match(eval('/'+search_text.toUpperCase()+'/g')) !== null
            )
        }

        /**
         * Сортировка
         */
        if(this.state.searching.sorting_element && words.length) {
            const { sorting_element, sorting_element_value } = this.state.searching

            if(typeof sorting_element_value === "string") {
                words = words.filter(item => {
                    return item[sorting_element] == sorting_element_value
                })
            } else {
                words = words.sort(dynamicSort(sorting_element, sorting_element_value))
            }
        }

        /**
         * Установка пагинации
         */
        if(this.state.currentGlav.id != 0 && words.length) {
            words = words.filter(item => item.head_id == this.state.currentGlav.id)
        }

        let { from_slice, to_slice } = this.state,
            default_slice_value = this.state.default_slice_value,
            COUNT_SYMB_PAG = Math.floor( words.length/default_slice_value ),
            elements_count_default_valid = default_slice_value == words.length,
            showPagination = () => {
                if(elements_count_default_valid) {
                    return '';
                }

                let alls = []
                let to_slice_val = to_slice+((default_slice_value/2)),
                    minus_val = to_slice_val-COUNT_SYMB_PAG-1;
                    minus_val = (minus_val < 0) ? 0 : minus_val

                to_slice_val-= (minus_val > 0) ? minus_val : 0

                for(let i = from_slice-minus_val; i < to_slice_val; i++) {
                    if(i < 0) continue;

                    let round_i = Math.round(i)

                    alls.push(<li key={i} className={`page-item ${this.state.from_slice == round_i ? 'active' : ''}`}>
                        <a href="" className="page-link" onClick={e => {
                            e.preventDefault()
                            this.paginate(round_i)
                        }}>{round_i+1}</a>
                    </li>)
                }

                return alls
            }

        let slice_words = words.slice(from_slice*default_slice_value, to_slice*default_slice_value)

        let currentPageHash = location.hash.replace('#', '').toUpperCase(),
            cphc = cls => currentPageHash === cls.toUpperCase() ? 'active show' : '',
            isMainPageClass = cphc('BASIC-TAB') || cphc(''),
            isPhrasesPageClass = cphc('PHRASES-TAB'),
            isLemmaPageClass = cphc('LEMMA-TAB'),
            isTestsPageClass = cphc('TESTS-TAB'),
            isLandPageClass = cphc('LAND-TAB'),
            isSubtitlesPageClass = cphc('SUBTITLES-TAB'),
            isTechnicPageClass = cphc('TECHNIC-TAB'),
            isTextsLemmaPageClass = cphc('textslemma-tab')


        return (
            <React.Fragment>
                <form
                    id={this.state.form_id}
                    onSubmit={e => {
                        e.preventDefault();
                        this.parseSubmit(e.target, id)
                    }}
                    data-course-id={id}
                    action=""
                    autoComplete={'off'}
                >
                    <div className="modal-content">
                        {/*<div className="card-header p-0 d-flex justify-content-between">*/}
                        {/*    <ul className="nav nav-tabs active-thik nav-primary border-0" id="myTab" role="tablist">*/}
                        {/*        <li className="nav-item">*/}
                        {/*            <a className="nav-link px-4 py-3 rounded-0 active show" id="basic-tab" data-toggle="tab" href="#basic" role="tab" aria-controls="nasic" aria-selected="true">Основное</a>*/}
                        {/*        </li>*/}
                        {/*        <li className="nav-item">*/}
                        {/*            <a className="nav-link px-4 py-3 rounded-0" id="phrases-tab" data-toggle="tab" href="#phrases" role="tab" aria-controls="phrases" aria-selected="false">Главы и фразы</a>*/}
                        {/*        </li>*/}
                        {/*        <li className="nav-item">*/}
                        {/*            <a className="nav-link px-4 py-3 rounded-0" id="technic-tab" data-toggle="tab" href="#technic" role="tab" aria-controls="technic" aria-selected="false">Технические настройки</a>*/}
                        {/*        </li>*/}
                        {/*        <li className="nav-item">*/}
                        {/*            <a className="nav-link px-4 py-3 rounded-0" onClick={() => onUpdateLemmaData({id})} id="lemma-tab" data-toggle="tab" href="#lemma" role="tab" aria-controls="lemma" aria-selected="false">Деление</a>*/}
                        {/*        </li>*/}
                        {/*        <li className="nav-item">*/}
                        {/*            <a className="nav-link px-4 py-3 rounded-0" id="textslemma-tab" data-toggle="tab" href="#textslemma" role="tab" aria-controls="textslemma" aria-selected="false">Тексты с разбиения</a>*/}
                        {/*        </li>*/}
                        {/*    </ul>*/}
                        {/*</div>*/}
                        <div className="card-body fingman-card-body">
                            <div className="tab-content" id="myTabContent">
                                <div className={`tab-pane show fade ${isMainPageClass}`} id="basic" role="tabpanel" aria-labelledby="basic-tab">
                                    <div className="course-edit__single">
                                        <div className="module-modal-name">
                                            <div className="module-modal__name">
                                                <label htmlFor="name">Название курса</label>
                                                <p>{name}</p>
                                            </div>
                                            <div className="module-modal__page">
                                                <label htmlFor="">Страница</label>
                                                <p>Основное</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="course-edit__row">
                                        <div className="course-edit__single">
                                            <TextInput className="form-control" fingman={'fingman_coursname_input'} onInput={this.changeInput} name={'name'} val={name} />
                                        </div>
                                    </div>
                                    <div className="course-edit__row">
                                        <div className="course-edit__left course-edit--between">
                                            <div className="course-edit__item">
                                                <div className="module-modal-theme">
                                                    <label htmlFor="theme">Тематика курса</label>
                                                    <TextInput onInput={this.changeInput} name={'theme'} val={theme} />
                                                </div>
                                            </div>
                                            <div className="course-edit__item">
                                                <div className="module-modal-categories_courses module-modal-select">
                                                    <label htmlFor="category_name">Категория курса</label>
                                                    <select id="category_name" name="category_name" onChange={this.changeInput} className="browser-default" defaultValue={category_name}>
                                                        <option selected disabled value="">Выберите категорию</option>
                                                        {API.categories_courses.map((item, i) => {
                                                            return <option key={i} value={item.value}>{item.title}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="course-edit__right">
                                            <div className="modal-price-item">
                                                <div className="module-modal-price">
                                                    <label htmlFor="price">Цена / месяц</label>
                                                    <TextInput onInput={this.changeInput} name={'price'} validReg={/[0-9]+/g} val={price} />
                                                </div>
                                                <div className="module-modal-price">
                                                    <label htmlFor="price">Цена / 6 мес.</label>
                                                    <TextInput onInput={this.changeInput} name={'price_6'} validReg={/[0-9]+/g} val={price} />
                                                    <a href="" className="percent_button"><img
                                                        src="/img/icons/percent_button.svg" />
                                                    </a>
                                                </div>
                                                <div className="module-modal-price">
                                                    <label htmlFor="price">Цена / 12 мес.</label>
                                                    <TextInput onInput={this.changeInput} name={'price_12'} validReg={/[0-9]+/g} val={price} />
                                                    <a href="" className="percent_button"><img
                                                        src="/img/icons/percent_button.svg" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="course-edit__row">
                                        <div className="course-edit__left course-edit--between">
                                            <div className="course-edit__item ">
                                                <div className="module-modal-langueges module-modal-select">
                                                    <label htmlFor="languege_termins">Язык курса</label>
                                                    <select id="languege_termins" onChange={this.changeInput} name="languege_termins" className="browser-default" defaultValue={languege_termins}>
                                                        <option selected disabled value="">Выберите язык</option>
                                                        {window.defaultLangueges.map((item, i) => {
                                                            return <option key={i} value={item.value}>{item.title}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="course-edit__item">
                                                <div className="module-modal-langueges module-modal-select">
                                                    <label htmlFor="langueges">Язык обучения</label>
                                                    <select id="langueges" onChange={this.changeInput} name="langueges" className="browser-default" defaultValue={langueges}>
                                                        <option selected disabled value="">Выберите язык</option>
                                                        {window.defaultLangueges.map((item, i) => {
                                                            return <option key={i} value={item.value}>{item.title}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="course-edit__right">
                                            <div className="modal-url-item">
                                                <div className="module-modal-url course-edit__item--wider">
                                                    <label htmlFor="url">Адрес курса (URL)</label>
                                                    <TextInput onChange={this.changeInput} id={'courseAddress'}
                                                               name={'url'} val={url}/>
                                                </div>
                                                <div className="module-modal-url module-modal-full-url course-edit__item--wider">
                                                    <label htmlFor="full-url">Полный адрес курса <span
                                                        className='material-icons'>launch</span></label>
                                                    <a href={'/courses/' + url}>{API.host + '/courses/' + url}</a>
                                                </div>
                                            </div>

                                            {/* <div className="modal-admin-name-item">
                                                <label htmlFor="username">Имя пользователя</label>
                                                <textarea name="username"
                                                          className="materialize-textarea anotation4__textarea"
                                                          placeholder="-Преподаватель/Доктор Наук/ВУЗ"
                                                          id="userNameField"
                                                          disabled
                                                ></textarea>
                                                <InputToggler element={'textarea'} selector={'userNameField'} />
                                            </div>
                                            <div className="add_author_button_container">
                                                <a href="" className="add_admin_button dashed_border_for_button mr-3 disabled">+ добавить
                                                    администратора</a>
                                                <a href="" className="add_admin_button dashed_border_for_button disabled">- удалить
                                                    администратора</a>
                                            </div>
                                            <hr className="fingman__divider"/> */}
                                            {this.showUsersConnected()}
                                        </div>
                                    </div>
                                    <div className="course-edit__row">
                                        <div className="course-edit__left course-edit--between ">
                                            <div className="course-edit__item modal-author-item">
                                                <label htmlFor="author">Автор</label>
                                                <textarea name="author"
                                                          className="materialize-textarea anotation4__textarea"
                                                          defaultValue={author} placeholder={'Введите имя автора курса'}
                                                          onInput={this.changeInput}
                                                          id={'authorTextarea'}
                                                          disabled
                                                ></textarea>
                                                <InputToggler element={'textarea'} selector={'authorTextarea'} />
                                            </div>
                                            <div className="course-edit__item modal-author-item">
                                                <label htmlFor="position">н. степень сокр.ф./должность</label>
                                                <textarea name="position"
                                                          className="materialize-textarea anotation4__textarea"
                                                          placeholder="-Преподаватель/Доктор Наук/ВУЗ">к. ф. н</textarea>
                                            </div>

                                        </div>
                                        {/* <div className="course-edit__right">
                                            <div className="fingman-module-modal-roles-part">
                                                <div className="modal-roles-item course-edit__item--wider">
                                                    <div className="module-modal-roles">
                                                        <label htmlFor="emailAdmin">Добавить администратора</label>
                                                        <div className="chips-words">
                                                            <TextInput
                                                                type="text"
                                                                max="Infinity"
                                                                min="0" id="userEmail"
                                                                placeholder="E-mail пользователя..."
                                                                className="custom-textarea"
                                                                value="" disabled
                                                                data-input={'useremail'}/>
                                                        </div>
                                                    </div>
                                                    <InputToggler element={'input'} selector={'userEmail'} />
                                                </div>

                                                <div className="modal-roles-item">
                                                    <div className="module-modal-admin-roles">
                                                        <label htmlFor="admin_role">Роль</label>
                                                        <select id="admin_role" name="admin_role" disabled
                                                                className="admin_role_select">
                                                            <option disabled="" value="">Выберите роль</option>
                                                            <option value="en">Администратор</option>
                                                        </select>
                                                    </div>
                                                </div>

                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="course-edit__row">
                                        <div className="course-edit__left">
                                            <div className="modal-university-item">
                                                <label htmlFor="university">ВУЗ или компания</label>
                                                <textarea name="university"
                                                          data-input={'univercity'}
                                                          id="universityField"
                                                          className="materialize-textarea anotation4__textarea"
                                                          placeholder="-Преподаватель/Доктор Наук/ВУЗ"
                                                disabled>Университет в Кембридже, Массачусетс</textarea>
                                                <InputToggler element={'textarea'} selector={'universityField'} />
                                            </div>
                                            <div className="add_author_button_container">
                                                <p className="add_author_button dashed_border_for_button">+ добавить
                                                    автора</p>
                                            </div>
                                            <hr className="fingman__divider"/>
                                        </div>
                                    </div>
                                    <div className="course-edit__row">
                                        <div className="course-edit__description">
                                            <label htmlFor="description">Описание</label>
                                            <TextInput onInput={this.changeInput} name={'description'} fingman={'course_description_input'} val={description} />
                                        </div>
                                    </div>
                                    <div className="course-edit__row course-edit__row--triple">
                                        <div className="course-edit__col">
                                            <div className="fingman_left_panel_checkbox_item">
                                                <p>Курс опубликован</p>
                                                {/*TODO - поставить на onInput замену свойства на true*/}

                                                <Vcheckbox
                                                    name={'is_public'}
                                                    defaultChecked={!!is_public}
                                                    values={{
                                                        checked: 1,
                                                        unchecked: 0
                                                    }}
                                                    onChange={this.changeInput}
                                                />

                                                <ToolTip icon={'help'} info={'Отметьте чекбокс, если хотите опубликовать курс'} />
                                            </div>
                                            <div className="fingman_left_panel_checkbox_item">
                                                <p>Только на моем домене</p>

                                                <Vcheckbox
                                                    name={'opened_only_domain'}
                                                    defaultChecked={!!opened_only_domain}
                                                    values={{
                                                        checked: 1,
                                                        unchecked: 0
                                                    }}
                                                    onChange={this.changeInput}
                                                />

                                                <ToolTip icon={'help'} info={'Отметьте чекбокс, если хотите разместить курс на своем домене'} />
                                            </div>
                                            <div className="fingman_left_panel_checkbox_item fingman_left_panel_checkbox_item--short">
                                                <p>Доступ по ссылке</p>
                                                {/*TODO - наверное это свойство надо сделать? или указать мне, как оно называется?*/}
                                                <input onChange={this.changeInput} type="checkbox" name="cours_public" id="cours_link"
                                                       className="checkbox_public" />
                                                <label htmlFor="cours_link">
                                                    <span></span>
                                                </label>
                                                <ToolTip icon={'help'} info={'Отметьте чекбокс, если хотите включить доступ по ссылке'} />
                                            </div>
                                            <div className="fingman_left_panel_checkbox_item">
                                                <p>Чат</p>
                                                <input onChange={this.changeInput} type="checkbox" name="cours_public" id="cours_chat"
                                                       className="checkbox_public" />
                                                <label htmlFor="cours_chat">
                                                    <span></span>
                                                </label>
                                                <ToolTip icon={'help'} info={'Отметьте чекбокс, если хотите чат'} />
                                            </div>
                                        </div>
                                        <div className="course-edit__col">
                                            <File val={preview} type={'image'} onChange={this.changeInput} name={'preview'} validExts={/(\.png|\.jpg|\.jpeg)/g}/>
                                        </div>
                                        <div className="course-edit__col course-edit__audios">
                                            <div className={'course-edit__audio'}>
                                                <input type="hidden" name="def_audio_success"
                                                       value={API.host + def_audio_success} />
                                                <AudioPlayer src={API.host + def_audio_success}/>
                                                <div className="file-input">
                                                    <input type="file" name="def_audio_success"
                                                           id="def_audio_success" />
                                                    <label className="btn-new btn-new--grey btn-new--upload"
                                                           htmlFor="def_audio_success"><img src="/img/icons/upload-icon-arrow--white.svg" /><span
                                                        className="vertical_border_line"></span>Верный ввод</label>
                                                </div>
                                            </div>
                                            <div className={'course-edit__audio'}>
                                                <input type="hidden" name="def_audio_wrong"
                                                       value={API.host + def_audio_wrong} />
                                                <AudioPlayer src={API.host + def_audio_wrong}/>
                                                <div className="file-input">
                                                    <input type="file" name="def_audio_wrong"
                                                           id="def_audio_wrong" />
                                                    <label className="btn-new btn-new--grey btn-new--upload"
                                                           htmlFor="def_audio_wrong"> <img src="/img/icons/upload-icon-arrow--white.svg" alt=""/><span
                                                        className="vertical_border_line"></span>Неверный
                                                        ввод</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="course-edit__row">
                                        <button type="submit" className={`btn-new btn-new--${this.state.defaultColorSave}`}>Сохранить
                                        </button>
                                    </div>
                                    <hr className="fingman__divider"/>
                                    <div className="course-edit__row course-edit__delete">
                                        <div className="add_author_button_container">
                                            <a href="#!"
                                               className="add_admin_button dashed_border_for_button"
                                               onClick={(e) => {
                                                   e.preventDefault();
                                                   if(confirm("Вы действительно хотите удалить курс?"))
                                                       onDeleteModule(id)
                                               }}
                                            >Удалить</a>
                                        </div>

                                    </div>

                                    <div className="fingman_left_panel_wrapper">
                                        <div className="fingman_left_panel_checkboxes_wrapper">


                                            {/*<div className="fingman_left_panel_checkbox_item">
                                                <p>Чат</p>
                                                <input type="checkbox" name="cours_public" id="cours_chat"
                                                       className="checkbox_public" />
                                                <label htmlFor="cours_chat">
                                                    <span></span>
                                                </label>
                                                <div className="checkbox_item_question_icon for_chat_icon">
                                                    <div className="checkbox_item_alert">
                                                        <img className="checkbox_item_alert_close"
                                                             src="/img/icons/checkbox_item_alert_close.svg " />
                                                        <h4>Чат</h4>
                                                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing
                                                            elitr, sed diam nonumy eirmod tempor invidunt ut
                                                            labore et dolore magna aliquyam erat, sed diam
                                                            voluptua. At vero eos et accusam et justo duo
                                                            dolores et ea rebum. Stet clita kasd gubergren, no
                                                            sea takimata sanctus est Lorem ipsum dolor sit
                                                            amet</p>
                                                        <div className="checkbox_item_alert_border"></div>
                                                    </div>
                                                    <img className="question_icon_chat"
                                                         src="img/icons/question_icon.svg" />
                                                </div>
                                            </div>*/}
                                        </div>

                                    </div>



                                    {/*<p>Полный адрес курса <img src="/img/copy.svg" onClick={() => {
                                                    copyTextToClipboard( location.host + '/courses/' + url , () => {
                                                        Toast('Адрес успешно скопирован в буфер обмена!');
                                                    });
                                                }} width="16" className="icon-click" />: <a href={`/courses/${url}`} target="_blank">{location.host}/courses/{url}</a></p>*/}



                                    {/*<div className="module-modal-public module-modal-select">*/}
                                    {/*    {is_public !== -1 || user_role >= 2 ? <React.Fragment>*/}
                                    {/*        <label htmlFor="is_public">Курс опубликован</label>*/}
                                    {/*        <select id="is_public" name="is_public" className="browser-default" defaultValue={is_public}>*/}
                                    {/*            <option selected disabled value="">{(is_public == 1) ? 'Да' : 'Нет'}</option>*/}
                                    {/*            {[{*/}
                                    {/*                value: 1,*/}
                                    {/*            }, {*/}
                                    {/*                value: 0*/}
                                    {/*            }].map((item, i) => {*/}
                                    {/*                return <option key={i} value={item.value}>{(item.value == 1) ? 'Да' : 'Нет'}</option>*/}
                                    {/*            })}*/}

                                    {/*            { // Блокировка курса*/}
                                    {/*                user_role >= 2 ? <option value={'-1'}>Заблокирован</option> : ''*/}
                                    {/*            }*/}
                                    {/*        </select>*/}
                                    {/*    </React.Fragment> : <p>Курс заблокирован.</p>}*/}
                                    {/*</div>*/}

                                    {/*<div className="module-modal-opened_only_domain module-modal-select">*/}
                                    {/*    <label htmlFor="opened_only_domain">Опубликовать курс только на моем домене</label>*/}
                                    {/*    <select id="opened_only_domain" name="opened_only_domain" className="browser-default" defaultValue={opened_only_domain}>*/}
                                    {/*        <option selected disabled value="">{(opened_only_domain == 1) ? 'Да' : 'Нет'}</option>*/}
                                    {/*        {[{*/}
                                    {/*            value: 1,*/}
                                    {/*        }, {*/}
                                    {/*            value: 0*/}
                                    {/*        }].map((item, i) => {*/}
                                    {/*            return <option key={i} value={item.value}>{(item.value == 1) ? 'Да' : 'Нет'}</option>*/}
                                    {/*        })}*/}
                                    {/*    </select>*/}
                                    {/*</div>*/}


                                    {/*<div className="module-modal-preview">*/}
                                    {/*    <div className="module-modal-preview__container" style={{*/}
                                    {/*        backgroundImage: 'url('+preview+')'*/}
                                    {/*    }}></div>*/}
                                    {/*    <File onInput={this.changeInput} name={'preview'} />*/}
                                    {/*</div>*/}
                                    {/*<div className="module-modal-roles">*/}
                                    {/*    <p>Пользователи, подключенные к вашему курсу:</p>*/}
                                    {/*    {this.showUsersConnected()}*/}
                                    {/*</div>*/}

                                    {/*<div className="modal-footer">*/}
                                    {/*    <Button submit title={'Сохранить'} color={this.state.defaultColorSave} />*/}
                                    {/*    <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={e => {*/}
                                    {/*        e.preventDefault();*/}
                                    {/*        if(confirm("Вы действительно хотите удалить курс?")) {*/}
                                    {/*            onDeleteModule(id)*/}
                                    {/*        } else {*/}
                                    {/*            return true;*/}
                                    {/*        }*/}

                                    {/*    }}>Удалить</a>*/}
                                    {/*</div>*/}

                                </div>

                                <div className={`tab-pane fade ${isTestsPageClass}`} id="tests" role="tabpanel" aria-labelledby="tests-tab">
                                    <TestsWidget
                                        is_admin_widget={true}
                                    />
                                </div>

                                <div className={`tab-pane fade ${isPhrasesPageClass}`} id="phrases" role="tabpanel" aria-labelledby="phrases-tab">
                                    <div className="course-edit__name">
                                        <div className="course-edit__single">
                                            <div className="module-modal-name">
                                                <div className="module-modal__name">
                                                    <label htmlFor="name">Название курса</label>
                                                    <p>{name}</p>
                                                </div>
                                                <div className="module-modal__page">
                                                    <label htmlFor="">Страница</label>
                                                    <p>Главы и фразы</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fingman_panel_wrapper phrases__courseglavs">
                                        {id ? <CourseGlavs
                                            onSetGlav={this.updateCurrentGlav}
                                            activeGlav={this.state.currentGlav}
                                            triggerSorting={this.triggerSorting}
                                            courseId={id}
                                            onSetNameGlav={this.props.onChangeCurrentGlav}
                                            onUpdate={this.props.triggerEvent}
                                            data={this.props.course_heads}
                                            notWidgets={false}
                                        /> : ''}

                                        <div className="course-glavs__top__item">
                                            <div className="course-glavs__addPhrase">
                                                <a
                                                    href=""
                                                    className="btn-new btn-new--green"
                                                    onClick={(evt) => {
                                                        evt.preventDefault();
                                                        closeSidebar();
                                                        if (this.props.course_heads.length && this.state.currentGlav.id !== 0) {
                                                            openModal('modal-modules-create')
                                                        } else {
                                                            Toast('Создайте или выберите главу!', 'red');
                                                        }
                                                    }}
                                                >Добавить фразу</a>
                                                <ToolTip info={'Добавьте фразу'} icon={'help'}/>
                                            </div>
                                        </div>

                                        <div className="course-glavs__top__item">
                                            <div className="course-glavs__search">
                                                <div className="course-glavs__search__browse">
                                                    <ToolTip info={this.wordsSelector()} icon={'more_horiz'} />
                                                </div>

                                                <div className="course-glavs__search__input">
                                                    <input 
                                                        type="search" 
                                                        value={this.state.searching.search_text} 
                                                        onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                                                        onInput={e => {
                                                            const val = (e.target.value + '').toString().trim()

                                                            this.setSearchWord(val)
                                                        }} 
                                                        placeholder={`Поиск по ${this.state.searching.on_word ? 'фразе' : 'слову'}`} 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="course-glavs__top__item">
                                            <div className="course-glavs__search__delete">
                                                <div onClick={() => this.triggerSorting('id')} className="course-glavs__search__delete__btn">
                                                    <i className="material-icons">close</i>
                                                    <i className="material-icons">sort</i>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    <hr className={'fingman__divider'} />
                                    <div className="fingman__panel__wrapper">
                                        <div className="fingman__phrases__table">
                                            {
                                                (words.length) ?
                                                    <table className="mb-4 bg-white">
                                                        <thead className="thead-light2">
                                                            <tr>
                                                                <th scope="col" className={"thead__item"}>№ <span onClick={() => this.triggerSorting('id')} className="material-icons align-text-bottom ml-1 md-18">sort</span></th>
                                                                <th scope="col" className={"thead__item thead__item__double thead__item--bordered"}>
                                                                    <span className={"double__span--100"}>Слово обучения<span onClick={() => this.triggerSorting('word')} className="material-icons align-text-bottom ml-1 md-18">sort</span></span>
                                                                    <span className={"double__span--100"}>Фраза обучения<span onClick={() => this.triggerSorting('phrase')} className="material-icons align-text-bottom ml-1 md-18">sort</span></span>
                                                                </th>
                                                                <th scope="col" className={"thead__item thead__item__double thead__item--bordered"}>
                                                                    <span className={"double__span--100"}>Перевод слова <span onClick={() => this.triggerSorting('explanation')} className="material-icons align-text-bottom ml-1 md-18">sort</span></span>

                                                                </th>
                                                                <th scope="col" className={"thead__item thead__item__double thead__item--bordered"}>
                                                                    <span className={"double__span--100"}>Перевод фразы <span onClick={() => this.triggerSorting('explanation_second')} className="material-icons align-text-bottom ml-1 md-18">sort</span></span>
                                                                </th>
                                                                <th scope="col" className={"thead__item thead__item--bordered"}>Морф. пр. <span onClick={() => this.triggerSorting('morph_priz')} className="material-icons align-text-bottom ml-1 md-18">sort</span></th>
                                                                <th scope="col" className={"thead__item thead__item__triple thead__item--bordered"}>
                                                                    <span className={"triple__span--100"}><span onClick={() => this.triggerSorting('explanation_word')} className="material-icons align-text-bottom ml-1 md-18">sort</span> Пояснение</span>
                                                                    <span className={"triple__span--100"}><span onClick={() => this.triggerSorting('etymology')} className="material-icons align-text-bottom ml-1 md-18">sort</span> Этимология</span>
                                                                    <span className={"triple__span--100"}><span onClick={() => this.triggerSorting('association')} className="material-icons align-text-bottom ml-1 md-18">sort</span> Ассоциация</span>
                                                                    <span className={"triple__span--100"}><span className="material-icons align-text-bottom ml-1 md-18">sort</span> Изображение Ассоциации</span>
                                                                </th>
                                                                <th scope="col" className={"thead__item thead__item__triple thead__item--bordered"}>
                                                                    <span className={"triple__span--100"}>Аудио:</span>
                                                                    <span className={"triple__span--100"}>слово</span>
                                                                    <span className={"triple__span--100"}>фраза</span>
                                                                </th>
                                                                <th scope="col" className={"thead__item"}>#</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            slice_words.map((word, i) => {
                                                                // Если глава активна, и совпадает с главой слова
                                                                return <ModuleWord
                                                                    index={word.index}
                                                                    as={def_audio_success}
                                                                    aw={def_audio_wrong}
                                                                    onLoadWord={this.loadWord}
                                                                    triggerSorting={this.triggerSorting}
                                                                    onUpdateProperty={this.onUpdateProperty}
                                                                    onDelete={this.deleteWord}
                                                                    {...word}
                                                                    key={i} />
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                : ''
                                            }
                                        </div>
                                        {(words.length >= 10 && !elements_count_default_valid) ? <div className="fingman__phrases__pagination">
                                            {/* <ul className="pagination justify-content-end">*/}
                                            {/*    <li className="page-item">*/}
                                            {/*        <a onClick={e => { e.preventDefault(); this.paginate((from_slice-1<0?0:from_slice-1)) }} className="page-link" href="#" tabIndex="-1">&lt;</a>*/}
                                            {/*    </li>*/}
                                            {/*    {showPagination()}*/}
                                            {/*    <li className="page-item">*/}
                                            {/*        <a  className="page-link" href="#">&gt;</a>*/}
                                            {/*    </li>*/}
                                            {/*</ul> : ''}*/}
                                            <ul>
                                                {/*TODO - сделать функционал, который позволял бы перевести на первую и последнюю страницу. Оформление блоков - в комментариях*/}
                                                {/* <li><a href="" className="fingman__phrases__pagination__item"  onClick={e => { e.preventDefault(); this.paginate((from_slice-1<0?0:from_slice-1)) }} >
                                                    <i className="material-icons">chevron_left</i>
                                                </a></li> */}
                                                {showPagination()}
                                                {/* <li><a href="" className="fingman__phrases__pagination__item">
                                                    <i className="material-icons">more_horiz</i>
                                                </a></li>
                                                <li><a href="" className="fingman__phrases__pagination__item" onClick={e => { e.preventDefault(); this.paginate((from_slice+1>COUNT_SYMB_PAG?from_slice:from_slice+1)) }}>
                                                    <i className="material-icons">chevron_right</i>
                                                </a></li>
                                                <li><a href="" className="fingman__phrases__pagination__item">
                                                    <i className="material-icons">last_page</i>
                                                </a></li> */}
                                            </ul>
                                        </div> : ''}
                                    </div>
                                </div>

                                <div className={`tab-pane fade ${isLemmaPageClass}`} id="lemma" role="lemma"  aria-labelledby="lemma-tab">
                                    {id ?
                                        <React.Fragment>
                                            <div className="course-edit__name">
                                                <div className="course-edit__single">
                                                    <div className="module-modal-name">
                                                        <div className="module-modal__name">
                                                            <label htmlFor="name">Название курса</label>
                                                            <p>{name}</p>
                                                        </div>
                                                        <div className="module-modal__page">
                                                            <label htmlFor="">Страница</label>
                                                            <p>Деление</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <LemmaComponent
                                                activeLemmaModule={this.props.activeLemmaModule}
                                                onCreateWord={this.props.onCreateWord}
                                                course_id={id}
                                                onUpdate={this.props.triggerEvent}
                                                onShowModalChange={this.props.onShowModalChange}
                                                onUpdateLemma = {this.props.onUpdateLemmaData}
                                            />
                                        </React.Fragment>
                                        : ''}
                                </div>


                                <div className={`tab-pane fade ${isTextsLemmaPageClass}`} id="textslemma" role="textslemma" aria-labelledby="textslemma-tab">
                                    {id ?
                                        <div className="fingman_panel_wrapper ">
                                            <div className="course-edit__name">
                                                <div className="course-edit__single">
                                                    <div className="module-modal-name">
                                                        <div className="module-modal__name">
                                                            <label htmlFor="name">Название курса</label>
                                                            <p>{name}</p>
                                                        </div>
                                                        <div className="module-modal__page">
                                                            <label htmlFor="">Страница</label>
                                                            <p>Тексты с разбиения</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="fingman__panel__wrapper">
                                                <LemmaTexts
                                                    course_id={id}
                                                    courseUrl={url}
                                                    onUpdate={this.props.triggerEvent}
                                                    heads={this.props.course_heads}
                                                />
                                            </div>
                                        </div>
                                        : ''}
                                </div>


                                <div className={`tab-pane fade ${isTechnicPageClass}`} id="technic" role="technic" aria-labelledby="technic-tab">
                                    <div className="fingman__panel__wrapper">
                                        <div className="course-edit__name">
                                            <div className="course-edit__single">
                                                <div className="module-modal-name">
                                                    <div className="module-modal__name">
                                                        <label htmlFor="name">Название курса</label>
                                                        <p>{name}</p>
                                                    </div>
                                                    <div className="module-modal__page">
                                                        <label htmlFor="">Страница</label>
                                                        <p>Технические настройки</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="technic-panel__double">
                                            <div className="technic-panel__left">
                                                <p className="update__modal__heading">Идентификатор отслеживания Google Analytics</p>
                                                <TextInput onInput={this.changeInput} val={ga_code} name={'ga_code'} placeholder={'UA-000000000-0'} id={'gacode-setup'} fingman={'fingman__tech__input'} />
                                                <hr className="technic-panel__divider"/>
                                            </div>
                                            <div className="technic-panel__right">
                                                <a href="#modal-instruction-analytics" className="modal-trigger technic-panel__modalTrigger">Инструкция по подключению аналитики</a>
                                            </div>
                                        </div>
                                        <div className="technic-panel__double">
                                            <div className="technic-panel__left">
                                                <p className="update__modal__heading">Номер счетчика Яндекс.Метрики</p>
                                                <TextInput onInput={this.changeInput} val={metrika_code} name={'metrika_code'} id={'ya-metrika-setup'} fingman={'fingman__tech__input'} placeholder={'00000000'} />
                                                <hr className="technic-panel__divider"/>
                                            </div>
                                            <div className="technic-panel__right">
                                                <a href="#modal-instruction-metrika" className="modal-trigger technic-panel__modalTrigger">Инструкция по подключению Яндекс.Метрики</a>
                                            </div>
                                        </div>
                                        <div className="technic-panel__double">
                                            <div className="technic-panel__left">
                                                <p className="update__modal__heading">Подключенный домен</p>
                                                <TextInput onInput={this.changeInput} id={'domain_field'} val={domain} name={'domain'} fingman={'fingman__tech__input'} placeholder={'asd123.com'} />

                                                <a href="" className="technic-panel__close" onClick={e => {
                                                    e.preventDefault();
                                                    this.addOrChangeDomain('delete', domain_field.value, id);
                                                }}><i className="material-icons">close</i></a>
                                            </div>
                                            <div className="technic-panel__right">
                                                <a href="https://drive.google.com/open?id=1SB3JJcVHX8nb5U1Sb4bKPRkDjhsA8UBDlxlJyc6XKSM" target="_blank" className="modal-trigger technic-panel__modalTrigger">Инструкция по подключению домена</a>
                                            </div>
                                        </div>
                                        <div className="technic-panel__double">
                                            <div className="technic-panel__left">
                                                <Button customClass={'btn__new btn__green shadow--none'} color={'#1BBC9B'} title={'Добавить / Изменить домен'} onChange={() => {
                                                    this.addOrChangeDomain('add', domain_field.value, id);
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`tab-pane fade ${isSubtitlesPageClass}`} id="subtitles" role="subtitles" aria-labelledby="subtitles-tab">
                                    {id ? <SubtitlesComponent
                                            activeLemmaModule={this.props.activeLemmaModule}
                                            onCreateWord={this.props.onCreateWord}
                                            course_id={id}
                                            course_name={name}
                                            onSetNameGlav={this.props.onChangeCurrentGlav}
                                            onUpdate={this.props.triggerEvent}
                                            onUpdate={this.props.triggerEvent}
                                        /> : ''}
                                </div>

                                <div className={`tab-pane fade ${isLandPageClass}`} id="land" role="land" aria-labelledby="land-tab">
                                    {id ? <LandingCourse data={{...this.props, changeInput: this.changeInput, defaultColorSave: this.state.defaultColorSave}} course_id={id} /> : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        )
    }
}
