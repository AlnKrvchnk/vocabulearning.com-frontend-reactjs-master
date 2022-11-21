import React from 'react'
import './index.less'
import Button from '../../../../../../../global-components/layout/Button'
import { Row, Col } from '../../../../../../../global-components/layout/Bootstrap'
import Checkbox from '../../../../../../../global-components/layout/Inputs'
import Modal from '../../../../../../../global-components/layout/Modal'
import Axios from 'axios'
import API from '../../../../../../../config/API'
import {closeSidebar, getCurrentUserToken, openModal, Toast} from '../../../../../../../functions'
import CourseGlavsChange from "../CourseGlavsChange/CourseGlavsChange";
import  ToolTip from '../../../../../../../global-components/layout/ToolTip/ToolTip'

const TOKEN = getCurrentUserToken()
export default class CourseGlavs extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            activeGlavs: {},
            activeGlavIndex: 0,
            glavs_visible: true,
            searching: {
                on_word: false,
                search_text: '',

                sorting_element: '',
                sorting_element_value: false
            },
        }

        this.changeActiveGlav = this.changeActiveGlav.bind(this)
        // this.updateGlav = this.updateGlav.bind(this)
        // this.saveGlav = this.saveGlav.bind(this)
        this.loadWordsFromGlav = this.loadWordsFromGlav.bind(this)
        this.triggerSorting = this.triggerSorting.bind(this)
        // this.deleteGlav = this.deleteGlav.bind(this)

        this.nameGlav = React.createRef()
    }
    // Загрузка слов с ID главы
    loadWordsFromGlav (agId) {
        const CI = this.props.courseId

        Axios.get(`${API.host}/api/courses-heads/${CI}/${agId}`).then(response => {
            const data = response.data

            this.props.onUpdate(null, {
                event: 'onLoadWordsGlav',
                newData: data.data
            })

            Toast(data.error_message, (data.success) ? 'green' : 'red')
        })
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

    changeActiveGlav (i, value = null, name = '') {
        if(value !== null) {
            this.setState(prevState => ({ glavs_visible: false, activeGlavs: {
                    ...prevState.activeGlavs,
                    [i]: value
                } }))
        } else {
            const agId = this.props.data[i].id

            console.log(this.props)

            this.props.onSetGlav({
                index: i,
                id: agId,
                name
            })
        }

        // Скрываем список глав
        this.setState(() => ({ glavs_visible: false }))
    }

    render() {
        const defaultClass = "module-modal-public module-modal-select"
        let { data = [], notWidgets, noTitle, course_id, modalId = 'modal-change-glavs' } = this.props

        if(data.length) {
            if(data[0].id !== 0) {
                data.unshift({
                    id: 0,
                    name: 'Все главы'
                })
            }
        }
        
        const ActiveGlav = (data[this.props.activeGlav.index]) ? data[this.props.activeGlav.index] : {id: 0, name: ''}

        return (
            <div className={"course-glavs__container"}>
                {!notWidgets ?
                <div className="course-glavs__top">
                    <div className="course-glavs__total">
                        <p>Всего: </p>
                        <p className="course-glavs__total__number">{ (data.length > 0) ? data.length - 1 : 0}</p>
                    </div>
                    <div className="course-glavs__top__item">
                        <div className="course-glavs__current">
                            <div className="course-glavs__current__number">
                                <p>{(this.props.activeGlav.index > 0) ? this.props.activeGlav.index : ''}</p><br />
                                <small>{(this.props.activeGlav.length > 0) ? 'Глава' : ''}</small>
                            </div>
                            <div className="course-glavs__current__name">
                                <a href="#" onClick={evt => {
                                    evt.preventDefault()
                                    openModal(modalId)
                                    closeSidebar()
                                }}>{ActiveGlav.name || 'Добавить главу'}</a>
                            </div>
                        </div>
                        <ToolTip info={'Выберите активную главу'} icon={'help'}/>
                    </div>
                </div>
                :
                    <div className="course-glavs__top">
                        <div className="course-glavs__top__item">
                            <p>{this.state.activeGlavs[0]}</p>
                            <div className="course-glavs__list">
                                <div className="course-glavs__list__wrapper">
                                    {(data !== undefined) ? data.map((item, i) => {
                                        const input_id = "input_glav_" + i
                                        const is_active_glav_check = this.props.activeGlav.id == item.id
                                        const isActive = (is_active_glav_check) ? 'active' : ''

                                        return <div onClick={
                                            () => {this.changeActiveGlav(i, null, item.name); }
                                            }
                                            className={"course-glavs__item " + isActive}
                                            key={i}
                                            >

                                            {
                                                (this.state.activeGlavs[i]) ? <input autoFocus={true} id={input_id} onBlur={e => {
                                                        this.updateGlav(item.id, e.target.value)
                                                        this.changeActiveGlav(i,false)
                                                    }} type="text" defaultValue={item.name} /> :

                                                    <React.Fragment>
                                                        <b>{item.name}</b> {notWidgets ? '' :
                                                        item.count_words ? `(${item.count_words} шт.)` : ''
                                                    }

                                                        {notWidgets ? '' : <a href="" className="course-glavs__icon" onClick={e => {
                                                            e.preventDefault()
                                                            this.changeActiveGlav(i,true)
                                                        }}><i className="material-icons">create</i></a>}

                                                        {notWidgets ? '' :<a href="" className="course-glavs__icon" onClick={e => {
                                                            e.preventDefault()

                                                            if(confirm('Точно хотите удалить главу?'))
                                                                if(confirm('Действительно хотите удалить главу?'))
                                                                    this.deleteGlav(item)
                                                        }}><i className="material-icons">delete</i></a>}
                                                    </React.Fragment>
                                            }

                                        </div>
                                    }) : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <Modal modalClass={modalId.replace('modal-', '')} content={CourseGlavsChange} data={{...this.props}} />
            </div>
        )
    }
}
