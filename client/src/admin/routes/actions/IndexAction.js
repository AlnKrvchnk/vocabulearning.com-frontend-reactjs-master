import React from 'react'

import FilterModulesForm from '../../../users/pages/Index/FilterCourseForm'
import Modules from './components/IndexAction/Modules'
import ModuleCreateModal from './components/IndexAction/Module-Create'
import Modal from '../../../global-components/layout/Modal'
import ModalCourseCreate from './components/IndexAction/CreateCourseModal'
import axios from 'axios'
import API from '../../../config/API'
import Loader from '../../../global-components/layout/Loader'
import {getCurrentUserToken, updateSelects, openModal, closeSidebar} from '../../../functions'
import M from 'materialize-css'

import ChatWidget from '../../../global-components/ChatWidget'

export default class IndexAction extends React.Component {
    constructor () {
        super()

        this.state = {
            modules: [],

            modules_modal: {
                module: ''
            },

            wordData: null,
            waiting: true
        }

        this.updateModalData = this.updateModalData.bind(this)
        this.loadModules = this.loadModules.bind(this)
        this.getCurrentStateModules = this.getCurrentStateModules.bind(this)
        this.filterModules = this.filterModules.bind(this)
    }

    updateModalData (data, otherData, callback = null) {
        if(data !== null) {
            const { id } = data
            const TOKEN = getCurrentUserToken();

            // получем данные
            axios.get(`${API.host}/admin/modules/${id}`, {
                headers: {
                    'Authorization': TOKEN
                }
            }).then(response => {
                let data = response.data

                axios.get(API.host + '/api/courses-heads/' + id).then(headResponse => {
                    data.data.course_heads = headResponse.data.data;

                    if(data.success) {
                        // получаем домен курса
                        axios.get(`${API.host}/domain/${id}`, {
                            headers: {
                                'Authorization': TOKEN
                            }
                        }).then(response_data => {
                            if(response_data.data) {
                                let domain = (response_data.data.domain == null) ? '' : response_data.data.domain;

                                data.data.domain = domain;
                            }

                            this.setState(() => ({
                                modules_modal: data.data
                            }), () => {
                                if(callback) callback()
                            })
                        })
                    }
                })
            })
        } else {
            const { newData, event } = otherData

            if(this[event]) {
                this[event](newData)
            }
        }
    }

    loadModules () {
        const TOKEN = getCurrentUserToken();

        axios.get(`${API.host}/admin/modules`, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            const data = response.data;

            if(data.success) {
                this.setState(() => ({
                    modules: data.data
                }))
            } else {
                this.setState(() => ({
                    modules: []
                }))
            }
        })
    }

    componentWillMount () {
        this.loadModules();
    }

    filterModules (data) {
        if(data.length) {
            this.setState(() => ({ modules: data }))
        } else {
            this.loadModules()
        }
    }

    getCurrentStateModules () {
        setTimeout(() => {
            if(!this.state.modules.length) {
                this.setState(() => ({
                    waiting: false
                }))
            }
        }, 3000);

        if(!this.state.modules.length && this.state.waiting) {
            return <Loader/>
        } else {
            return <p>Курсы не найдены</p>
        }
    }

    componentDidMount () {
        updateSelects()
        let newModals = M.Modal.init( document.querySelectorAll('.modal') )
        window.modals = {};
        newModals.forEach(item => {
            window.modals[item.id] = item;
        })
    }
    /**
     * /Попап разбиения слов (ВЫБОР)
     */

    render () {
        const ModalData = this.state.modules_modal;

        return (
            <div className="Tsds__page Tsds__page--admin" id="index-page">
                <ChatWidget />

                <div className="row">
                    <div className="col admin-page__top">
                        <h1>Добро пожаловать в админ-панель!</h1>
                        <p><a href="#modal-create-module" className="modal-trigger btn-new btn-new--green" onClick={(evt)=>{evt.preventDefault(); closeSidebar()}}><i className="material-icons">add</i> Добавить курс</a></p>
                    </div>
                </div>
                <div className="admin-page__filters">
                    <FilterModulesForm isSingle={true} onUpdate={this.filterModules} />
                </div>
                {
                    (!this.state.modules.length) ? this.getCurrentStateModules() :
                    <Modules list={this.state.modules}/>
                }
                <Modal modalClass={'modules-create'} content={ModuleCreateModal} data={ModalData} triggerEvent={this.updateModalData} />
                <Modal modalClass={'create-module'} triggerEvent={this.loadModules} content={ModalCourseCreate} />
            </div>
        )
    }
}
