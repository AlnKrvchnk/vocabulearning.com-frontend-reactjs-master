import React from 'react'
import './index.less'
import Button from '../../../global-components/layout/Button'
import Axios from 'axios'
import API from '../../../config/API'
import { getCurrentUserToken, Toast, $API, createFormHTML, parseSelectingFunc } from '../../../functions'
import CourseGlavs from '../../routes/actions/components/IndexAction/components/CourseGlavs/CourseGlavs'
import { Col } from '../../../global-components/layout/Bootstrap'
import SubtitlesTable from './SubtitlesTable'

export default class SubtitlesComponent extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            activeSubtitles: [], // активный текст,
            activeTranslates: [],
            loadedSubtitles: false,
            course_heads: [],
            course_id: null,
            apiSubtitles: [],
            currentGlav: { index: 0, id: 0, course_id: 0 }
        }

        this.getSRTdata = this.getSRTdata.bind(this)
        this.createSubtitles = this.createSubtitles.bind(this)
        this.createWord = this.createWord.bind(this)
        this.loadGlavs = this.loadGlavs.bind(this)
        this.updateCurrentGlav = this.updateCurrentGlav.bind(this)
        this.saveSubtitles = this.saveSubtitles.bind(this)
        this.getSubtitles = this.getSubtitles.bind(this)
    }

    get getData () {
        const { currentGlav, activeSubtitles, activeTranslates, course_id } = this.state

        return {
            subtitles: activeSubtitles,
            translates: activeTranslates,
            head_id: currentGlav.id,
            course_id
        }
    }

    getSubtitles () {
        let data = this.getData
            data.action = 'GET'

        Axios.post(API.host + '/api/subtitles', data, { headers: { 'Authorization': getCurrentUserToken() }}).then(response => {
            this.setState(() => ({ apiSubtitles: response.data.data }))
        })
    }

    saveSubtitles () {
        let data = this.getData
            data.action = 'POST'

        Axios.post(API.host + '/api/subtitles', data, 
            { headers: { 'Authorization': getCurrentUserToken() } 
        }).then(response => {
            if(response.data.success) {
                Toast('Данные сохранены', 'green')
                this.getSubtitles()
                this.setState(() => ({ activeSubtitles: [], activeTranslates: [] }))
            }
        })
    }

    createSubtitles ($form) {
        const DEF_OBJ = {
            course_id: this.state.course_id,
            head_id: this.state.currentGlav.id
        }

        if(DEF_OBJ.head_id <= 0) {
            Toast('Вы не выбрали главу!', 'red')
            return
        }

        const data = new FormData($form);

        this.getSRTdata(data, response => {
            const srt_data = response.data

            if(!srt_data) return

            if(srt_data.text) {

                if(this.state.activeSubtitles.length) {
                    this.setState(() => ({
                        activeTranslates: srt_data.text
                    }))
                } else {
                    this.setState(() => ({
                        activeSubtitles: srt_data.text,
                        loadedSubtitles: true
                    }))
                }
            }
        })

        $form.reset()
    }

    getSRTdata (data, cb) {
        Axios.post(API.host + '/api/lemma', data, { headers: { 'Authorization': getCurrentUserToken() } }).then(response => cb(response.data))
    }

    createWord (word = '', inputVal = '', explanation_second, cb) {
        const findIndex = inputVal.split(' ').indexOf(word)
        const course_id = this.state.course_id,
            head_id = this.state.currentGlav.id

        parseSelectingFunc({
            word,
            index: findIndex,
            inputVal,
        }, data => {
            $API.createWordInCourse(createFormHTML({
                phrase_top: inputVal,
                phrase: data.inputVal,
                explanation: '-',
                word: word,
                explanation_word: '-',
                explanation_second,
                morph_priz: '-',
                etymology: '-'
            }), {
                course_head_id: head_id,
                currentEditModule: course_id,
                id: course_id,
                currentGlav: { id: head_id, index: 0, course_id },
                callback: data => {
                    if(cb) cb(data.data)
                }
            })
        })
    }

    loadGlavs (id) {
        Axios.get(API.host + '/api/courses-heads/' + id).then(headResponse => {
            this.setState(() => ({ course_heads: headResponse.data.data, course_id: id }))
        })
    }

    componentDidMount () {
        this.loadGlavs(this.props.course_id)
    }

    updateCurrentGlav ({ index, id }, cd = null) {
        cd = (cd !== null) ? cd : parseInt(this.props.id)

        const data_to_save = { index, id, course_id: cd  }

        self.currentGlavLemma = data_to_save

        this.setState(() => ({
            currentGlav: data_to_save
        }), () => {
            this.getSubtitles()
        })
    }

    render() {
        const { activeSubtitles, activeTranslates, apiSubtitles } = this.state
        // проверка на наличие главы
        const glavs_isset = (this.state.course_heads.length)

        // Параметры
        const btnLoadText = activeSubtitles.length ? 'Загрузить перевод' : 'Загрузить субтитры'

        return (
            <div className="lemma">
                <div className="course-edit__name">
                    <div className="course-edit__single">
                        <div className="module-modal-name">
                            <div className="module-modal__name">
                                <label htmlFor="name">Название курса</label>
                                <p>{this.props.course_name}</p>
                            </div>
                            <div className="module-modal__page">
                                <label htmlFor="">Страница</label>
                                <p>Субтитры</p>
                            </div>
                        </div>
                    </div>
                </div>
                <form id="subtitles-form" className="row">
                    {glavs_isset ? <React.Fragment>
                        <Col col='m12'>
                            {!activeTranslates.length ? <div className="lemma__upload__book">
                                <input type="file" placeholder="Загрузить" name="book" />
                                <p>Поддерживаемые форматы файлов: .srt</p>

                                <Button customClass='btn-success--new' color='successnew' onChange={() => {
                                    this.createSubtitles( $('#subtitles-form')[0] )
                                }} title={btnLoadText} />
                            </div> : <Button color='successnew' title='Сохранить' onChange={() => this.saveSubtitles()} />}
                            
                            <div className="lemma__select__glavs">
                                <CourseGlavs
                                    onSetGlav={this.updateCurrentGlav} activeGlav={this.state.currentGlav}
                                    notWidgets={false}
                                    modalId={'modal-changeGlavs-subtitles'}
                                    onSetNameGlav={this.props.onSetNameGlav}
                                    onUpdate={this.props.onUpdate}
                                    courseId={this.props.course_id} data={this.state.course_heads}
                                />
                            </div>

                            {!apiSubtitles.length ? 
                                <SubtitlesTable onCreateWord={this.createWord} listTranslates={activeTranslates} list={activeSubtitles} /> :
                                <SubtitlesTable onCreateWord={this.createWord} isApiData={true} list={apiSubtitles} />}
                        </Col>
                    </React.Fragment> : <h3>В данном курсе не найдены главы!</h3>}
                </form>
            </div>
        )
    }
}
