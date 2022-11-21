import React from 'react'

import Input from '../../../../../global-components/layout/Input'
import Button from '../../../../../global-components/layout/Button'

import { Select, File } from '../../../../../global-components/layout/Inputs'
import { getCurrentUserToken, randomNumbers, updateSelects, closeModal } from '../../../../../functions'
import axios from 'axios'
import API from '../../../../../config/API'

import M from 'materialize-css'
import Cyr from 'cyrillic-to-translit-js'
import DefaultAudios from './components/CreateCourseModal/DefaultAudios'
export default class CreateCourseModal extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            formCleared: false,
            uriValue: '',
            defaultInputValue: '',
            sound_template_active: true
        }

        this.parseInputs = this.parseInputs.bind(this)
        this.parseTitle = this.parseTitle.bind(this)
        this.changeSoundTemplate = this.changeSoundTemplate.bind(this)
        this.changeURI = this.changeURI.bind(this)
    }

    changeSoundTemplate () {
        this.setState(prevState => ({
            sound_template_active: !prevState.sound_template_active
        }))
    }

    parseInputs (form) {
        let formData = new FormData(form);
        const TOKEN = getCurrentUserToken();

        axios.post(`${API.host}/admin/modules`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': TOKEN
            }
        }).then(response => {
            if(response.data.success) {
                this.setState({
                    formCleared: false,
                    uriValue: '',
                    defaultInputValue: ' ',
                });

                this.myForm.reset();

                window.modals['modal-create-module'].close();
                M.toast({html: `Курс успешно создан!`, classes: 'green'})
                // обновляем модули на главном экшене
                this.props.triggerEvent();

                setTimeout(() => { // Редиректим на страницу редактирования
                    location.href = '/admin/courses/' + response.data.data.course_id; }, 1500)

            } else {
                M.toast({ html: response.data.error_message, classes: 'red' })
            }
        })
    }

    changeURI (new_uri = '') {
        this.setState(() => ({ uriValue: new_uri }))
    }

    parseTitle (value) {
        let translistValue = Cyr().transform(value, '-').toLowerCase();

        this.changeURI(translistValue)
    }

    componentDidMount () {
        updateSelects()
    }

    render () {
        const { defaultInputValue, uriValue } = this.state
        return (
            <React.Fragment>
                    <div className="modal-content" id={'createCourseModal'}>
                        {/*<div className="modal-content__row d-flex align-items-center justify-content-between">*/}
                        {/*<h3>Создание курса</h3>*/}
                        {/*     <ul className="nav nav-expander">*/}
                        {/*          <li>*/}
                        {/*            <a href="" className="nav-expander__link" onClick={(e) => {e.preventDefault(); $('.Tsds__modal--create-module').toggleClass('width--100')}}>*/}
                        {/*            <span className="material-icons align-text-top mr-1 md-18">🗔</span>*/}
                        {/*            </a>*/}
                        {/*        </li>*/}
                        {/*        <li>*/}
                        {/*            <a href="" className="nav-expander__link" onClick={(e) => {e.preventDefault(); $('#modal-create-module').fadeOut()}}>*/}
                        {/*                <span className="material-icons align-text-center mr-1 md-18">close</span>*/}
                        {/*            </a></li>*/}
                        {/*     </ul>*/}
                        {/*</div>*/}

                        <form ref={(el) => this.myForm = el} onSubmit={(e) => {
                            e.preventDefault();
                            this.parseInputs( e.target )
                        }}>
                            <div className="modal__row modal__row--between">
                                <div className="modal__row__left">
                                    <Input val={defaultInputValue} onChange={this.parseTitle} isRequire name={'name'} label={'Название курса'} />
                                </div>
                                <div className="modal__row__right">
                                    <Input val={defaultInputValue} isRequire name={'description'} label={'Описание курса'} />
                                </div>
                            </div>
                            <div className="modal__row modal__row--between">
                                <div className="modal__row__left">
                                    <Input val={defaultInputValue} validReg={/[0-9]+/g} isRequire name={'price'} label={'Стоимость курса (рублей)'} />
                                </div>
                                <div className="modal__row__right">
                                    <Input val={defaultInputValue} isRequire name={'author'} label={'Автор'} />
                                </div>
                            </div>
                           <div className="modal__row mb-3">
                               <p><label>Адрес курса (уникальный. не должен совпадать с другим курсом)</label></p>
                               <input value={uriValue} onInput={e => this.changeURI(e.target.value)} required={true} name={'url'} />
                           </div>
                            <div className="modal__row modal__row--between">
                                <div className="modal__row__left">
                                    <p><label>Категория курса</label></p>
                                    <Select
                                        col={6}
                                        name={'category_name'}
                                        isRequire={true}
                                        title={''}
                                        items={API.categories_courses}
                                    />
                                </div>
                                <div className="modal__row__right">
                                    <p><label>Языки курса</label></p>
                                    <Select
                                        col={6}
                                        name={'langueges'}
                                        title={''}
                                        items={window.defaultLangueges}
                                    />
                                    <p><label>Опубликован</label></p>
                                    <Select
                                    col={6}
                                    name={'is_public'}
                                    title={''}
                                    items={[
                                        {value:'1', title:'Да'},
                                        {value:'0', title:'Нет'},
                                    ]}
                                />
                                </div>
                            </div>
                            <hr className={"fingman__divider"}/>
                            <div className="modal__row modal__row--triple mt-4 mb-5">
                                <div className="modal__col">
                                    <p><label>Изображение курса</label></p>
                                    <File val={''} name={'preview'} type={'image'}/>

                                </div>
                                <div className="modal__col">
                                    <p>
                                        <label>
                                            {this.state.sound_template_active ? 'Прослушайте шаблонный звук' : 'Загрузите свой звук верного / неверного ввода'}
                                        </label>
                                    </p>
                                    {this.state.sound_template_active ? <DefaultAudios /> : <React.Fragment>
                                        <File validExts={/(\.mp3|\.wav)/g} title={'Верный ввод'} type={'audio'} name={'def_audio_success'} />
                                        <File validExts={/(\.mp3|\.wav)/g} title={'Неверный ввод'} type={'audio'} name={'def_audio_wrong'} />
                                    </React.Fragment>}
                                </div>
                                <div className="modal__col">
                                    <div className="fingman_left_panel_checkboxes_wrapper">
                                        <div className="fingman_left_panel_checkbox_item">
                                            <p>Использовать шаблонное аудио</p>
                                            <input type="checkbox"
                                                   defaultChecked={true}
                                                   id={"is_template"}
                                                   name={"is_template"}
                                                   onChange={this.changeSoundTemplate}
                                                   className="checkbox_public"/>
                                            <label htmlFor="is_template">
                                                <span></span>
                                            </label>
                                            <p className={"mt-2"}>Отключите чекбокс, если вы хотите использовать свои варианты шаблонных аудио</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal__row mt-5 mb-5">
                                <div></div>
                            </div>
                            <hr className={"fingman__divider mt-5 mb-5"}/>

                            <div className="modal__row modal__row--start">
                                <Button color={'blue'} customClass={'shadow--none modal--submit'} submit title={'Создать курс'} />
                            </div>
                        </form>
                    </div>
            </React.Fragment>
        )
    }
}
