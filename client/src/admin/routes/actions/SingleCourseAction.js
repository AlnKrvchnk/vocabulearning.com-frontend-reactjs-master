import React from 'react'

import ModuleCreateModal from './components/IndexAction/Module-Create'
import ModalInstruction from './components/IndexAction/Module-Create-Modal-Instruction'
import ModuleModalInstructionAnalytics from './components/IndexAction/Module-Instruction-Analytics'
import ModulesModal from './components/IndexAction/Module-Modal'
import Modal from '../../../global-components/layout/Modal'
import ModalUpdateWord from './components/IndexAction/Modal-Update-Word'
import ModalCourseCreate from './components/IndexAction/CreateCourseModal'
import axios from 'axios'
import API from '../../../config/API'
import Loader from '../../../global-components/layout/Loader'
import { getCurrentUserToken, updateSelects, openModal, showLoader, hideLoader } from '../../../functions'
import M from 'materialize-css'

import ChatWidget from '../../../global-components/ChatWidget'
import LemmaComponent from '../../components/lemma/LemmaComponent'
import LemmaWordChange from '../../components/lemma/LemmaWordChange'
import Axios from 'axios'
export default class SingleCourseAction extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            modules: [],
            AudioDefaultType: null,

            modules_modal: {
                module: ''
            },
            currentGlav: '',

            activeLemmaModule: null,
            wordData: null,
            waiting: true,

            // текст разбиения в модальном окне
            lemmaTextChanged: [],
            lemmaTextLast: '',
            lemmaTextChangeCallback: null,
            defaultTypeDownloadAudio: ''
        }

        this.updateModalData = this.updateModalData.bind(this)
        this.onDeleteModule = this.onDeleteModule.bind(this)
        this.loadModules = this.loadModules.bind(this)
        this.getCurrentStateModules = this.getCurrentStateModules.bind(this)
        this.filterModules = this.filterModules.bind(this)
        this.onLoadedInfoWord = this.onLoadedInfoWord.bind(this)
        this.onLoadWordsGlav = this.onLoadWordsGlav.bind(this)
        this.onUpdateLemmaData = this.onUpdateLemmaData.bind(this)
        this.createWordFromPhrase = this.createWordFromPhrase.bind(this)
        this.showModalWordsOnChange = this.showModalWordsOnChange.bind(this)
        this.changeLemmaWordSelected = this.changeLemmaWordSelected.bind(this)
        this.saveTextLemmaToInCourse = this.saveTextLemmaToInCourse.bind(this)
        this.onChangeCurrentGlav = this.onChangeCurrentGlav.bind(this)
        this.checkAudioDefaultType = this.checkAudioDefaultType.bind(this)
    }

    // Обновление имени текущей главы
    onChangeCurrentGlav (name) {
        this.setState(() => ({ currentGlav: name }))
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

    onDeleteModule (id) {
        const TOKEN = getCurrentUserToken();

        axios.delete(`${API.host}/admin/modules/${id}`, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            if(response.data.success) {
                location.href = '/admin'
                M.toast({ html: response.data.message, classes: 'green' })
            } else {
                M.toast({ html: response.data.error_message, classes: 'red' })
            }
        });
    }

    loadModules () {
        const TOKEN = getCurrentUserToken();

        showLoader('Загружаем курс...')

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

            hideLoader()
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
        // Загружаем данные в курс
        this.updateModalData({
            id: this.props.course_id
        }, null, () => {
            updateSelects()
            let newModals = M.Modal.init( document.querySelectorAll('.modal') )
            window.modals = {};
            newModals.forEach(item => {
                if(item.id)
                    window.modals[item.id] = item;
            })
        })
    }

    onLoadWordsGlav (data) {
        data = (data !== undefined) ? data : []

        this.setState(prevState => ({
            modules_modal: {
                ...prevState.modules_modal,
                words: data
            }
        }))
    }

    onUpdateLemmaData (data) {
        console.log('Update Lemma...')
        this.setState(() => ({ activeLemmaModule: {
            ...data,
            updateModalData: this.updateModalData
        } }))

    }

    onLoadedInfoWord (data) {
        this.setState(() => ({ wordData: {
            ...data,
            course: this.state.modules_modal
        } }))
        self.modals['modal-update-word'].open()
    }

    createWordFromPhrase (data) {
        this.setState(prevState => ({
            modules_modal: {
                ...prevState.modules_modal,
                data_to_load: data
            }
        }))
    }

    /**
     * Попап разбиения слов (ВЫБОР)
     */
    showModalWordsOnChange (txt = '', cb = null, skip_lemma_text = false) {
        let new_txt = txt.trim().replace(/\`|\'|\"|\,|\.|\:|\;|\!|\?|\_|\-|\\|\//g, (str) => {
            return " " + str.trim() + " "
        }).split(' ').map(item => {
            if(item !== '')
                return { selected: skip_lemma_text, data: item }
        }).filter(item => item !== undefined)

        this.setState(() => ({ lemmaTextChanged: new_txt, lemmaTextChangeCallback: cb, lemmaTextLast: txt }), () => {
            // Если мы не пропускаем шаг двойной проверки
            if(!skip_lemma_text) {
                openModal('modal-lemma-word-change', 0);
            } else {
                // Пропускаем шаг двойной проверки (код из LemmaWordChange.js)
                let words_on_check = {}

                new_txt.forEach(item => {
                    const obj_key = item.data.toUpperCase()

                    if(!words_on_check[obj_key]) {
                        words_on_check[obj_key] = -1
                    }
                })

                cb(txt, words_on_check)
                this.saveTextLemmaToInCourse(txt, new_txt)
            }
        })
    }

    changeLemmaWordSelected (indexWord, item) {
        let lemmaTextChanged = this.state.lemmaTextChanged,
            // назначем активное значение
            set_selected = (iw, prop, val = null) => {
                lemmaTextChanged[iw][prop] = (val !== null) ? val : (!lemmaTextChanged[iw][prop])
                return lemmaTextChanged[iw]
            }

        set_selected(indexWord, 'selected')

        lemmaTextChanged.forEach((_text, i) => {
            if(_text.data.toUpperCase() == lemmaTextChanged[indexWord].data.toUpperCase()) {
                set_selected(i, 'selected', lemmaTextChanged[indexWord].selected)
            }
        })


        this.setState(() => ({ lemmaTextChanged }))
    }

    // Сохраняем текст в курс
    saveTextLemmaToInCourse (lemmaTextLast, lemma_text_obj) {
        const lemma_text_json = JSON.stringify(lemma_text_obj),
            TOKEN = getCurrentUserToken(),
            course_id = this.state.modules_modal.id

        const head_id = (self.currentGlavLemma) ? currentGlavLemma.id : 0

        Axios.post(API.host + '/api/lemma-text-save/' + course_id + '/' + head_id, {
            lemma_text: lemmaTextLast,
            lemma_text_json
        }, { headers: {'Authorization': TOKEN} }).then(response => {
            const response_data = response.data

            if(response_data.success) {
                console.log('Text-lemma successfuly added to database', response_data.data.insertId)
            } else console.log('Text-lemma not added to database')
        })
    }

    checkAudioDefaultType (type_sound) {
        this.setState(() => ({ defaultTypeDownloadAudio: type_sound }))
    }

    render () {
        let ModalData = this.state.modules_modal;

        ModalData.currentGlav = this.state.currentGlav

        let propsDefaultAudio = {
            checkAudioDefaultType: this.checkAudioDefaultType, AudioDefaultType: this.state.AudioDefaultType
        }

        return (
            <div className="Tsds__page Tsds__page--admin" id="course-page">
                <ChatWidget />

                <ModulesModal
                    onUpdateLemmaData={this.onUpdateLemmaData}
                    onDeleteModule={this.onDeleteModule}
                    onUpdateModule={this.updateModalData}
                    triggerEvent={this.updateModalData}
                    activeLemmaModule={this.state.activeLemmaModule}
                    onCreateWord={this.createWordFromPhrase}
                    onShowModalChange={this.showModalWordsOnChange}
                    onChangeCurrentGlav={this.onChangeCurrentGlav}
                    {...ModalData}
                />

                <Modal modalClass={'modules-create'} content={ModuleCreateModal} data={{...ModalData, ...propsDefaultAudio }} triggerEvent={this.updateModalData} />
                <Modal modalClass={'create-module'} triggerEvent={this.loadModules} content={ModalCourseCreate} />
                <Modal modalClass={'modules-create-instruction'} content={ModalInstruction} />
                <Modal modalClass={'instruction-analytics'} content={ModuleModalInstructionAnalytics} />
                <Modal modalClass={'update-word'} data={{
                    ...this.state.wordData, ...propsDefaultAudio, 
                    defaultTypeDownloadAudio: this.state.defaultTypeDownloadAudio, checkAudioDefaultType: this.checkAudioDefaultType}}
                    triggerEvent={this.updateModalData} 
                    content={ModalUpdateWord} 
                />

                <Modal modalClass={'lemma-word-change'} data={{saveTextLemmaToInCourse: this.saveTextLemmaToInCourse, lemmaTextLast: this.state.lemmaTextLast, lemmaTextChanged: this.state.lemmaTextChanged, onTextChange: this.changeLemmaWordSelected, lemmaTextChangeCallback: this.state.lemmaTextChangeCallback, is_admin: true }} content={LemmaWordChange} />
            </div>
        )
    }
}
