import React from 'react'
import { Row } from '../../../global-components/layout/Bootstrap'
import LemmaTextsItem from './LemmaTextsComponent/LemmaTextsItem'

import CourseGlavs from '../../routes/actions/components/IndexAction/components/CourseGlavs/CourseGlavs'
import Axios from 'axios'
import API from '../../../config/API'
import { getCurrentUserToken, Toast } from '../../../functions'

import Modal from '../../../global-components/layout/Modal'

import LemmaHighlightModal from './modals/LemmaHighlightModal';
import LemmaReaderModal from './modals/LemmaReaderModal';

export default class LemmaTexts extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            currentGlav: { index: 0, id: 0, course_id: 0 },
            search_text: '',
            data: [],
            words: {},
            current_word_data: {},

            /**
             * Читалка
             */
            showWords: true,
            showPhrases: false,

            /**
             * 0 = обычный текст
             * 1 = текст для разбиения
             * 2 = текст с курса
             */
            type_text_view: (props.is_course_page) ? 2 : 1
        }

        this.updateCurrentGlav = this.updateCurrentGlav.bind(this)
        this.changeTypeTextView = this.changeTypeTextView.bind(this)
        this.updateLemmaTexts = this.updateLemmaTexts.bind(this)
        this.sendLemmaText = this.sendLemmaText.bind(this)
        this.searchText = this.searchText.bind(this)
        this.onDeleteFragment = this.onDeleteFragment.bind(this)
        this.getLemmaTexts = this.getLemmaTexts.bind(this)
        this.onActionModalReaderSetting = this.onActionModalReaderSetting.bind(this)
        this.onLoadInfoWord = this.onLoadInfoWord = this.onLoadInfoWord.bind(this)
    }

    onLoadInfoWord (word_data) {
        const TOKEN = getCurrentUserToken()

        Axios.get(API.host + `/api/repeating/${userData.id}/${this.props.course_id}/${word_data.id}`, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            const data = response.data;

            if(data.success) {
                const currentData = data.data;

                word_data.indicator = currentData.indicator

                this.setState(() => ({ current_word_data: word_data }))
            }
        })
    }

    onDeleteFragment (fragment_id = 0) {
        const TOKEN = getCurrentUserToken()
        const { course_id } = this.props

        Axios.delete(API.host + '/api/lemma-text/' + fragment_id + '/' + course_id, {
            headers: {'Authorization': TOKEN}
        }).then(response => {
            const data = response.data

            this.getLemmaTexts( course_id )

            Toast(data.error_message, data.success ? 'green' : 'red')
        })
    }

    sendLemmaText (result_text, words_on_check, lemmaTextChanged) {
        // Отправляем текст на разбиение в таблицу "Деление"
        if(self.autoTextConvertLemma)
            autoTextConvertLemma(result_text, words_on_check, {
                course_id: this.props.course_id,
                head_id: this.state.currentGlav.id
            })
    }

    changeTypeTextView (val = 0) {
        this.setState(() => ({ type_text_view: val }))
    }

    updateCurrentGlav ({ index, id, name = '' }, cd = null) {
        cd = (cd !== null) ? cd : parseInt(this.props.id)

        const data_to_save = { name, index, id, course_id: cd  }

        this.setState(() => ({
            currentGlav: data_to_save
        }))
    }

    updateLemmaTexts (index_word, word) {
        let JSON_data = JSON.parse(word.lemma_text_json)

        if(!JSON_data.length) return;

        let set_selected = (iw, prop, val = null) => {
                JSON_data[iw][prop] = (val !== null) ? val : (!JSON_data[iw][prop])
                return JSON_data[iw]
            }

        set_selected(index_word, 'selected')

        JSON_data.forEach((_text, i) => {
            if(_text.data.toUpperCase() == JSON_data[index_word].data.toUpperCase()) {
                set_selected(i, 'selected', JSON_data[index_word].selected)
            }
        })

        JSON_data = JSON.stringify(JSON_data)

        Axios.put(API.host + '/api/lemma-text-save/' + this.props.course_id, {
            lemma_text_json: JSON_data,
            id: word.id
        }, { headers: {'Authorization': getCurrentUserToken()} }).then(response => {
            const data = response.data

            this.getLemmaTexts( this.props.course_id )
        })
    }

    searchText (data = '') {
        if(data.length < 2)
            data = ''

        this.setState(() => ({ search_text: data }))
    }

    // Загрузка текстов после разбиения
    getLemmaTexts (course_id = 0) {
        const TOKEN = getCurrentUserToken()

        Axios.get(API.host + '/api/lemma-text-save/' + course_id, {
            headers: {'Authorization': TOKEN}
        }).then(response => {
            const data = response.data

            if(data.success) {
                this.setState(() => ({ data: data.data }))
            }
        })
    }

    componentDidMount () {
        this.getLemmaTexts( this.props.course_id )

        // Получаем все слова и фразы
        Axios.get(API.host + '/words/' + this.props.course_id, {
            headers: {'Authorization': getCurrentUserToken()}
        }).then(responseWords => {
            const dataWords = responseWords.data
            const wordsCourse = dataWords.data.words

            if(wordsCourse.length && dataWords.success) {
                let words = {}

                wordsCourse.forEach(item => {
                    words[item.word.toUpperCase()] = item
                })

                words.custom_user_anotation = {}

                this.setState(() => ({ words }))

                if(self.userData) {
                    Axios.get(API.host + `/api/word-anotation-register/${userData.id}/${this.props.course_id}`).then(response => {
                        if(response.data) {
                            const data = response.data;
                            let dataObject = {};
    
                            data.data.forEach(item => {
                                dataObject[item.word_id] = item;
                            });
    
                            words.custom_user_anotation = dataObject
                        }
    
                        this.setState(() => ({ words }))
                    })
                }
            }
        })

    }

    componentWillReceiveProps () {
        this.getLemmaTexts( this.props.course_id )
    }

    onActionModalReaderSetting (action, value) {
        switch (action) {
            // Изменение шрифта в читалке
            case 'fontSize':
                $('.lemma .reader__container__text .lemma-word-change-item').css({
                    [action]: value
                })
            break;

            // Вкл/вкл показ выделенных слов/фраз
            case 'showWords':
                this.setState(() => ({
                    [action]: value
                }))
            break;

            case 'showPhrases':
                this.setState(() => ({
                    [action]: value
                }))
            break;
        }
    }

    render() {
        let { course_id, heads, is_course_page = false, courseUrl = '' } = this.props
        let { data, currentGlav } = this.state

        // Показываем только актуальные тексты на основе главы
        if(data.length) {
            data = data.filter(item => item.head_id == this.state.currentGlav.id)
        }

        let header_title = ''
        if(currentGlav.name) header_title = currentGlav.name

        return (
            <Row>
                <div className="fingman_panel_wrapper textslemma__courseglavs">
                    <CourseGlavs
                        onUpdate={this.props.onUpdate}
                        onSetGlav={this.updateCurrentGlav}
                        activeGlav={this.state.currentGlav}
                        modalId={'modal-change-glavs-lemmatexts'}
                        courseId={course_id}
                        data={heads}
                        notWidgets={false}
                    />
                </div>

                <hr className="fingman__divider"/>
                <div className="lemma-text__flex">
                    <div className="lemma-text__flex__item">
                        {!is_course_page ? <React.Fragment>
                            <div className="fingman-selector mr-4">
                                Показать текст
                                <i className="material-icons">expand_more</i>
                                <div className="fingman-selector__btns">
                                    <a href="" name={'change_type_view'} onClick={(evt) => { evt.preventDefault(); is_checked => this.changeTypeTextView(1)}}>Показать текст для разбиения</a>
                                    <a href="" name={'change_type_view'} onClick={(evt) => { evt.preventDefault(); is_checked => this.changeTypeTextView(2)}}>Показать фразы из курса</a>
                                    <a>Показать слова из курса</a>
                                </div>
                            {/*<Checkbox type={'radio'} title={'Показать текст для разбиения'} checked={true} name={'change_type_view'} onChange={is_checked => this.changeTypeTextView(1)} />*/}
                            {/* <Checkbox type={'radio'} title={'Показать исходный текст'} checked={false} name={'change_type_view'} onChange={is_checked => this.changeTypeTextView(0)} /> */}
                            {/*<Checkbox type={'radio'} title={'Показать фразы/слова из курса'} checked={false} name={'change_type_view'} onChange={is_checked => this.changeTypeTextView(2)} />*/}
                            </div>

                        </React.Fragment> : ''}
                    </div>
                
                    {!is_course_page ? <div className="app-lemma-texts__search">
                        <input placeholder={'Поиск по слову в фрагментах...'} type="search" onInput={e => this.searchText(e.target.value.trim())} />
                    </div> : ''}
                </div>

                <div className="app-lemma-texts col">
                    <div className="wrapper">
                        <div className="container reader__container">
                            <div className="row">
                                <div className="col-md-12">
                                    {data.length ? <LemmaTextsItem
                                        header_title={header_title}
                                        // Показ слов в курсе
                                        showWords={this.state.showWords}
                                        // Слова
                                        data={data}
                                        search_text={this.state.search_text}
                                        getLemmaTexts={this.getLemmaTexts}
                                        course_id={course_id}
                                        head_id={currentGlav.id}
                                        onLoadInfoWord={this.onLoadInfoWord}
                                        words={this.state.words}
                                        is_course_page={is_course_page}
                                        updateLemmaTexts={this.updateLemmaTexts}
                                        type_text_view={this.state.type_text_view}
                                        sendLemmaText={this.sendLemmaText}
                                        onDeleteFragment={this.onDeleteFragment}
                                    /> : 'Тексты не найдены (возможно, вы не выбрали главу).'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal modalClass={'LemmaHighlightModal'} data={{
                        current_word_data: this.state.current_word_data
                    }} content={LemmaHighlightModal} />

                    <Modal modalClass={'LemmaReaderModal'} data={{
                        onActionModalReaderSetting: this.onActionModalReaderSetting
                    }} content={LemmaReaderModal} />
                    </div>
            </Row>
        )
    }
}
