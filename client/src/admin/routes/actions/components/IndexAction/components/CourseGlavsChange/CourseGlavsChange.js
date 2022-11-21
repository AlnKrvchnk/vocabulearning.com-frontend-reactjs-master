import React from 'react'
import './index.less'
import Axios from "axios";
import API from "../../../../../../../config/API";
import {getCurrentUserToken, Toast, closeModal} from "../../../../../../../functions";

const TOKEN = getCurrentUserToken()

export default class CourseGlavsChange extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            activeGlavs: {},
            activeGlavIndex: 0,
            glavs_visible: true
        }

        this.changeActiveGlav = this.changeActiveGlav.bind(this)
        this.updateGlav = this.updateGlav.bind(this)
        this.saveGlav = this.saveGlav.bind(this)
        this.deleteGlav = this.deleteGlav.bind(this)

        this.nameGlav = React.createRef()
    }

    // Выбор активной главы
    changeActiveGlav (i, value = null, name = '') {
        if(value !== null) {
            this.setState(prevState => ({ glavs_visible: false, activeGlavs: {
                ...prevState.activeGlavs,
                [i]: value
            } }))
        } else {
            const agId = this.props.data[i].id

            this.props.onSetGlav({
                index: i,
                id: agId,
                name
            })
        }

        // Скрываем список глав
        this.setState(() => ({ glavs_visible: false }))
    }

    // Удаление главы
    deleteGlav ({ id, course_id }) {
        Axios.delete(`${API.host}/api/courses-heads/${course_id}/${id}`, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            response = response.data

            this.props.onUpdate({ id: course_id });
            Toast(response.error_message, (response.success) ? 'green' : 'red')
        })
    }

    // Обновление главы
    updateGlav (id, value) {
        const CI = this.props.courseId

        Axios.put(`${API.host}/api/courses-heads/${CI}/${id}`, {
            name: value
        }, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            response = response.data

            this.props.onUpdate({ id: CI });
            Toast(response.error_message, (response.success) ? 'green' : 'red')
        })
    }


    // Сохранение главы
    saveGlav (e) {
        e.preventDefault()

        const value = this.nameGlav.current.value
        const CI = this.props.courseId

        Axios.post(`${API.host}/api/courses-heads/${CI}`, {
            name: value
        }, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            response = response.data

            this.nameGlav.current.value = ''

            this.props.onUpdate({ id: CI });
            Toast(response.error_message, (response.success) ? 'green' : 'red')
        })
    }

    render() {
        let { data = [], notWidgets, noTitle, modalId = 'modal-change-glavs' } = this.props

        if(data.length) {
            if(data[0].id !== 0) {
                data.unshift({
                    id: 0,
                    name: 'Все главы'
                })
            }
        }

        return (
            <React.Fragment>
                <div className="modal-content">
                    <div className="course-glavs__selector">
                        <div className="course-glavs__add mb-5" >
                            <input type="text" ref={this.nameGlav} placeholder="Введите название новой главы" name="name_glav" />
                            <a href="" onClick={this.saveGlav} className="btn-new btn-new--green">Добавить главу</a>
                        </div>
                        <div className="course-glavs__all mt-5 mb-5">
                            <p>Список глав ( <span>{data.length > 0 ? data.length - 1 : 0}</span> )</p>
                        </div>
                        <div className="course-glavs__list">
                            <div className={"course-glavs__list__wrapper"}>
                                {(data !== undefined) ? data.map((item, i) => {
                                    const input_id = "input_glav_" + i

                                    return (
                                        <div onClick={() => {
                                            this.changeActiveGlav(i, null, item.name)
                                        }} className={"course-glavs__item "} key={i}>
                                        {
                                            (this.state.activeGlavs[i]) ?
                                                <input autoFocus={true} id={input_id} onBlur={e => {
                                                    this.updateGlav(item.id, e.target.value)
                                                    this.changeActiveGlav(i,false)
                                                }} type="text" defaultValue={item.name} /> :

                                                <React.Fragment>
                                                    <div className={'course-glavs__item__name'} onClick={(evt)=>{evt.preventDefault(); closeModal(modalId)}}>
                                                        <p >{item.name}</p> {notWidgets ? '' :
                                                        item.count_words ? `(${item.count_words} шт.)` : ''
                                                    }
                                                    </div>
                                                    <div className="course-glavs__item__buttons">
                                                        {notWidgets ? '' : <a href="" className="course-glavs__icon course-glavs__icon_create"  onClick={e => {
                                                            e.preventDefault()
                                                            this.changeActiveGlav(i,true)
                                                        }}><i className="material-icons">create</i></a>}

                                                        {notWidgets ? '' :<a href="" className="course-glavs__icon course-glavs__icon_delete" onClick={e => {
                                                            e.preventDefault()
                                                            if(confirm('Точно хотите удалить главу?'))
                                                                if(confirm('Действительно хотите удалить главу?'))
                                                                    this.deleteGlav(item)
                                                        }}><i className="material-icons">close</i></a>}

                                                        {notWidgets ? '' :<a href="" className="course-glavs__icon course-glavs__icon_phrase" onClick={e => {
                                                            e.preventDefault()
                                                        }}><i className="material-icons">add</i> Добавить фразу</a>}
                                                    </div>
                                                </React.Fragment>
                                        }
                                    </div>
                            )

                        }
                        ) : ''}
                        </div>
                    </div>
                    {/*{(data !== undefined) ? data.map((item, i) => {*/}
                    {/*    */}
                    {/*    const is_active_glav_check = this.props.activeGlav.id == item.id*/}
                    {/*    const isActive = (is_active_glav_check) ? 'active' : ''*/}

                    {/*    // Если главы скрыты и 1 активная = показываем только активную*/}
                    {/*//     if(!this.state.glavs_visible && !is_active_glav_check) return '';*/}
                    {/*//*/}
                    {/*// }) : ''}*/}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
