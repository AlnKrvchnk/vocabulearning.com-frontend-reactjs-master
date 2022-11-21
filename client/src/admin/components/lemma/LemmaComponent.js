import React from 'react'
import LemmaTableComponent from './LemmaTableComponent'
import './index.less'
import Axios from 'axios'
import API from '../../../config/API'
import { getCurrentUserToken, showLoader, hideLoader, Toast, openModal, dynamicSort, $API, createFormHTML, parseSelectingFunc, getLocal, localDelete, localSave, closeSidebar } from '../../../functions'
import CourseGlavs from '../../routes/actions/components/IndexAction/components/CourseGlavs/CourseGlavs'
import Loader from '../../../global-components/layout/Loader'
import ToolTip from '../../../global-components/layout/ToolTip/ToolTip'
import Modal from '../../../global-components/layout/Modal'
import LemmaUploadText from './LemmaUploadText/LemmaUploadText'
import LemmaUploadBook from './LemmaUploadBook/LemmaUploadBook'
import {v1 as uuid} from 'uuid'
import CourseGlavsChange from '../../routes/actions/components/IndexAction/components/CourseGlavsChange/CourseGlavsChange'
import { Checkbox } from '../../../global-components/layout/Inputs'

export default class LemmaComponent extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            activeLemma: [], // активный текст,
            course_heads: [],
            course_id: null,
            currentGlav: { index: 0, id: 0, course_id: 0 },
            load_value: true, // true = text, false = file,

            // pagination
            default_slice_value: 10,
            pagination: {

            },

            skip_lemma_text: false,
            cache_from_slice: 0,
            cache_to_slice: 1
        }

        this.convertTextToObjects = this.convertTextToObjects.bind(this)
        this.setActiveLemma = this.setActiveLemma.bind(this)
        this.loadAllWordsTables = this.loadAllWordsTables.bind(this)
        this.updateCurrentGlav = this.updateCurrentGlav.bind(this)
        this.changeLoadValue = this.changeLoadValue.bind(this)
        this.createLemma = this.createLemma.bind(this)
        this.getTextFromFile = this.getTextFromFile.bind(this)
        this.onDeleteLemma = this.onDeleteLemma.bind(this)
        this.txtToJSON = this.txtToJSON.bind(this)
        this.onUpdatePhrase = this.onUpdatePhrase.bind(this)
        this.onDoPhrase = this.onDoPhrase.bind(this)
        this.createWord = this.createWord.bind(this)
        this.autoTextConvertLemma = this.autoTextConvertLemma.bind(this)
        this.changeLocalSavePage = this.changeLocalSavePage.bind(this)

        // Используем во вкладке "Тексты деления"
        window.autoTextConvertLemma = this.autoTextConvertLemma
    }

    onUpdatePhrase (lemma_id, indexWord, indexPhrase, head_id = 0, new_phrase = '') {
        let new_state_lemma = this.state.activeLemma,
            current_lemma = new_state_lemma.filter(item => item.id == lemma_id)[0],
            item = current_lemma.data[indexWord].phrases[indexPhrase];

        current_lemma.data[indexWord].phrases[indexPhrase].phrase = new_phrase

        let json_text = JSON.stringify(current_lemma)

        setTimeout(() => {
            Axios.put(API.host + '/api/lemma-convert/' + this.state.course_id + '/' + head_id, {
                json_text, lemma_id
            }, { headers: {
                'Authorization': getCurrentUserToken()
            } }).then(response => {
                const $data = response.data

                if($data.success) {
                    this.setState(() => ({
                        activeLemma: new_state_lemma
                    }))
                }

                Toast($data.error_message)
            })
        }, 800)
    }

    onDeleteLemma (id, head_id) {
        const yes_delete = confirm('Вы действительно хотите удалить таблицу?')

        if(yes_delete) {
            Axios.delete(`${API.host}/api/lemma-convert/${this.state.course_id}/${head_id}/${id}`, { headers: { 'Authorization': getCurrentUserToken() } })
                .then(response => {
                    if(response.data) {
                        const data = response.data

                        if(data.success) {
                            this.loadAllWordsTables()
                        }

                        Toast(data.error_message, (data.success) ? 'green' : 'red')
                    }
                })
        }
    }

    txtToJSON (text, book_path = '', cb, words_on_check = null) {
        let _defaultText = text
        let wordsOnCheck = (words_on_check == null) ? {} : words_on_check
        let finalText = []
        let head_id = this.state.currentGlav.id;
        let course_id = this.state.course_id;
        let rpOtherSymb = (text) => {
            //text.replace(/[^-A-zА-я]|/gim,'') - эта строка обрезает любые символы кроме букв (русс/англ)
            return text.trim()
        }

        text = text.trim().split(' ')
        let l_text = text.length

        let i = 0
        const finalData = () => {
            let created_lemma_id = uuid(),
            default_object = {
                success: true,
                id: created_lemma_id,
                head_id: this.state.currentGlav.id,
                text: _defaultText,
                data: finalText,
                book_path: book_path
            };

            if(cb) cb({
                obj: default_object,
                json: JSON.stringify(default_object),
                id: created_lemma_id
            })
        }

        const total_loader = $('.total_loader_application .total_loader_application__txt')
        const forInterval = setInterval(() => {
            if(i !== l_text-1) {
                total_loader.text((100/l_text*i).toFixed(2) + '% загружено')
                let item = rpOtherSymb(text[i].toUpperCase())

                if(wordsOnCheck[item] >= 0) {} else {
                    // Если существует дефолтный объект слов на проверку (из LemmaWordChange.js)
                    if(words_on_check !== null) {
                        // Если слово не шаблонное и значение != -1, переходим на следующую итерацию
                        if(wordsOnCheck[item] != -1) {
                            i++
                            return;
                        }
                    }

                    // Если уже существуют дефолтные СЛОВА для разбиения, то новые не добавляем
                    wordsOnCheck[item] = i

                    // ищем предложения предложениях
                    let current_active_index = 0
                    let phrases = text.join(' ').trim().split(/(\.|\?|\!)/).filter(word => {
                        // ищем подходящие слова в предложениях
                        /*
                        Данный вариант плохо работает, не выводит некоторые фразы. Надо поправить
                        let w_i = rpOtherSymb(word.trim().toLowerCase()).split(' ').indexOf(item.toLowerCase())

                        if(w_i > -1) {
                            current_active_index = w_i
                        }

                        return w_i > -1*/

                        let checkWord = word.trim().toLowerCase().split(' ').filter((word_2, k) => {
                            if(rpOtherSymb(word_2) == item.toLowerCase()) {
                                current_active_index = k
                            }

                            return rpOtherSymb(word_2) == item.toLowerCase()
                        })

                        return checkWord.length
                    }).slice(0,11).map((phrase, i) => {
                        return {phrase, index: i, selected: false, archived: false}
                    })

                    finalText.push({
                        word: text[i],
                        index: i,
                        head_id,
                        course_id,
                        current_active_index,
                        selected: false,
                        repeating: phrases.length,
                        phrases
                    })

                }

                i++
            } else {
                finalData()
                clearInterval(forInterval)
                i = 0
                return
            }
        })
    }

    // Данная функция используется во вкладке "Тексты деления"
    autoTextConvertLemma (result_text, words_on_check, DEF_OBJ) {
        showLoader()
        this.txtToJSON( result_text.trim(), '', data => {
            this.convertTextToObjects(data.json, '', DEF_OBJ, data.id)
            this.loadAllWordsTables()
            hideLoader()
        }, words_on_check )
    }

    createLemma ($form) {
        const DEF_OBJ = {
            course_id: this.state.course_id,
            head_id: this.state.currentGlav.id,
            cb: () => {
                this.loadAllWordsTables()
                hideLoader()
            }
        }

        if(DEF_OBJ.head_id <= 0) {
            Toast('Вы не выбрали главу!', 'red')
            return
        }

        if($form.book_text.value !== "") {
            const book_text_val = $form.book_text.value

            this.props.onShowModalChange(book_text_val, (result_text, words_on_check) => {
                this.autoTextConvertLemma(result_text, words_on_check, DEF_OBJ)
            }, this.state.skip_lemma_text)
        } else if ($form.book) {
            let FD = new FormData($form)
            showLoader()
            this.getTextFromFile(FD, response => {
                if(response.success) {
                    const response_text = response.data.text

                    hideLoader()
                    // Выбираем слова в попапе
                    this.props.onShowModalChange(response_text, (result_text, words_on_check) => {
                        // формируем JSON объект
                        showLoader()
                        this.txtToJSON(result_text, response.file_path, data => {
                            // Отправляем на лематизацию (разбиение)
                            this.convertTextToObjects(data.json, response.file_path, DEF_OBJ, data.id)
                            hideLoader()
                        }, words_on_check )
                    }, this.state.skip_lemma_text)
                } else {
                    Toast(response.error_message, 'red')
                    hideLoader()
                }
            })
        }
        $form.reset()
    }

    getTextFromFile (data, cb) {
        Axios.post(API.host + '/api/lemma', data, { headers: { 'Authorization': getCurrentUserToken() } }).then(response => cb(response.data))
    }

    loadAllWordsTables () {
        const id = this.state.course_id

        if(id == null) return

        Axios.get(API.host + '/api/lemma-convert/' + id + '/', {
            headers: { 'Authorization': getCurrentUserToken() }
        }).then(lemmaResponse => {
            let data = lemmaResponse.data
            let success = data.success

            if(success) {
                data = data.data
            } else {
                data = []
            }

            /*data = (data.length) ? data : []

            if(typeof data == "object" && data.length == undefined) data = [data]*/

            this.setState(() => ({ activeLemma: data }))
        })
    }

    loadCurrentLemma ({ id }) {
        Axios.get(API.host + '/api/courses-heads/' + id).then(headResponse => {
            this.setState(() => ({ course_heads: headResponse.data.data, course_id: id }))

            this.loadAllWordsTables()
        })
    }

    convertTextToObjects (default_object, book_path = '', {course_id = 0, head_id = 0, cb}, id = `${Math.random()}`) {
        let index_lemma_active = 0;
        // Проверяем наличие леммы в активных таблицах по ID главы
        const head_id_isset = (this.state.activeLemma.length) ? this.state.activeLemma.filter((item, i) => {
            if(item.head_id == head_id) {
                index_lemma_active = i
                return item.head_id == head_id
            }
        }) : []

        if(this.state.activeLemma.length && head_id_isset.length) {
            let new_state_lemma = this.state.activeLemma
            default_object = JSON.parse( default_object )

            new_state_lemma[index_lemma_active].data = [...default_object.data, ...new_state_lemma[index_lemma_active].data]

            let active_lemma_created_id = new_state_lemma[index_lemma_active].id

            if(new_state_lemma.length) new_state_lemma = new_state_lemma[index_lemma_active]

            let json_text = JSON.stringify(new_state_lemma)

            Axios.put(API.host + '/api/lemma-convert/' + course_id + '/' + head_id, {
                json_text, lemma_id: active_lemma_created_id
            }, { headers: {
                'Authorization': getCurrentUserToken()
            } }).then(response => {
                const $data = response.data

                if($data.success) {
                    this.loadAllWordsTables()
                }

                Toast($data.error_message)
            })
        } else {
            Axios.post(API.host + '/api/lemma-convert/' + course_id + '/' + head_id, {
                default_object, book_path, created_lemma_id: id
            }, {
                headers: {
                    'Authorization': getCurrentUserToken()
                }
            }).then(response => {
                if(response.data) {
                    if(cb) cb()
                    Toast('Вы успешно сделали лемматизацию!', 'green')
                }
            })
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

    onDoPhrase (lemma_id, indexWord, indexPhrase, head_id = 0, action = 'DELETE', elem = 'PHRASE', item, last_item) {
        let TOGGLE_DISABLED_ITEMS = (is_disabled = true) => {
            if(is_disabled) {
                $('.lemma-item').toggleClass('disabled')
            } else {
                $('.lemma-item').removeClass('disabled')
            }
        }

        let ELEM_TYPE = 'Элемент "Фраза"';

        if(elem == 'WORD') ELEM_TYPE = 'Элемент "Слово"';

        if(!head_id || head_id == 0) return Toast('Выберите главу', 'red')

        let new_state_lemma = this.state.activeLemma,
            current_lemma = new_state_lemma.filter(item => item.id == lemma_id)[0],
            msg = `${ELEM_TYPE} успешно удален`

        action = action.toUpperCase()

        TOGGLE_DISABLED_ITEMS()

        // Действия (actions)
        switch(action) {
            case 'ADD_TO_COURSE':
                const curr_word = current_lemma.data[indexWord],
                    curr_phrase = curr_word.phrases[indexPhrase]

                if (curr_phrase.word_id) {
                    Toast('Фраза уже есть в курсе', 'red')
                    TOGGLE_DISABLED_ITEMS(false)
                    return
                }

                msg = `${ELEM_TYPE} успешно добавлен в курс!`
                this.createWord(curr_word.word, curr_phrase.phrase, head_id, data => {
                    if(data.insertId) {
                        current_lemma.data[indexWord].phrases[indexPhrase].word_id = data.insertId;

                        this.setState(() => ({
                            activeLemma: new_state_lemma
                        }), () => {
                            this.setActiveLemma(current_lemma.id, indexWord, 0, head_id)
                        })
                    }
                })
            break;
            case 'DELETE':
                current_lemma.data[indexWord].phrases.splice(indexPhrase,1)
            break;
            case 'ARCHIVE':
                msg = `${ELEM_TYPE} успешно архивирован`

                if(elem == 'WORD') {
                    current_lemma.data[indexWord].archived = !current_lemma.data[indexWord].archived
                } else {
                    current_lemma.data[indexWord].phrases[indexPhrase].archived = !current_lemma.data[indexWord].phrases[indexPhrase].archived
                }
            break;
            case 'DELETE_WORD':
                msg = `${ELEM_TYPE} успешно удален`
                current_lemma.data.splice(indexWord, 1)
            break;
        }

        let json_text = JSON.stringify(current_lemma)

        Axios.put(API.host + '/api/lemma-convert/' + this.state.course_id + '/' + head_id, {
            json_text, lemma_id
        }, { headers: {
            'Authorization': getCurrentUserToken()
        } }).then(response => {
            const $data = response.data

            TOGGLE_DISABLED_ITEMS(false)

            if($data.success) {
                this.setState(() => ({
                    activeLemma: new_state_lemma
                }))

                Toast(msg, 'green')

                return
            }

            Toast('Ошибка!', 'red')
        })
    }

    createWord (word = '', inputVal = '', head_id, cb) {
        const findIndex = inputVal.split(' ').indexOf(word)
        const course_id = this.state.course_id

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
                explanation_second: '-',
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

    setActiveLemma (lemma_id, indexWord, indexPhrase, head_id = 0) {
        let new_state_lemma = this.state.activeLemma,
            current_lemma = new_state_lemma.filter(item => item.id == lemma_id)[0],
            item = current_lemma.data[indexWord].phrases[indexPhrase];
        current_lemma.data[indexWord].phrases[indexPhrase].selected = !item.selected

        let json_text = JSON.stringify(current_lemma)

        Axios.put(API.host + '/api/lemma-convert/' + this.state.course_id + '/' + head_id, {
            json_text, lemma_id
        }, { headers: {
            'Authorization': getCurrentUserToken()
        } }).then(response => {
            const $data = response.data

            if($data.success) {
                const dt_createm = {
                    phrase: item.phrase.trim(),
                    word: current_lemma.data[indexWord].word.trim(),
                    indexWord: current_lemma.data[indexWord].current_active_index,
                    currentGlav: { ...this.state.currentGlav, course_id: this.state.course_id }
                }
                window.currentGlav = dt_createm.currentGlav
                window.currentEditModule = this.state.course_id

                this.setState(() => ({
                    activeLemma: new_state_lemma
                }), () => {
                    this.props.activeLemmaModule.updateModalData( this.props.activeLemmaModule , null, () => {
                        if(item.selected) {
                            // Парсим слово
                            this.createWord(dt_createm.word, dt_createm.phrase, head_id)
                        }
                    })
                })
            }

            Toast($data.error_message)
        })
    }

    componentWillReceiveProps (props) {
        if(props.activeLemmaModule !== null) {
            this.loadCurrentLemma(props.activeLemmaModule)
        }
    }

    componentDidMount () {
        // Проверяем хранилище
        this.changeLocalSavePage()
        this.props.onUpdateLemma({id: this.props.course_id})
    }

    updateCurrentGlav ({ index, id }, cd = null) {
        cd = (cd !== null) ? cd : parseInt(this.props.id)

        const data_to_save = { index, id, course_id: cd  }

        self.currentGlavLemma = data_to_save

        this.setState(() => ({
            currentGlav: data_to_save,
            cache_from_slice: 0,
            cache_to_slice: 1
        }))
    }

    changeLoadValue () {
        this.setState(prevState => ({ load_value: !prevState.load_value }))
    }

    changeLocalSavePage () {
        // Локальное хранилище
        let local_save_page_id = 'lemma_page' + this.props.course_id || this.state.course_id,
        local_save_page = getLocal(local_save_page_id)

        if(local_save_page) {
            let last_page_end = JSON.parse(local_save_page)

            if(last_page_end.from_slice && last_page_end.currentGlav && last_page_end.currentPage == location.hash) {
                const cid = Number(last_page_end.course_id)
                // Удаляем сохраненные данные
                localDelete(local_save_page_id)
                // Восстанавливаем страницу
                this.updateCurrentGlav({
                    index: last_page_end.currentGlav.index,
                    id: last_page_end.currentGlav.id,
                    course_id: cid
                }, cid)

                this.setState(() => ({
                    cache_from_slice: last_page_end.from_slice,
                    cache_to_slice: last_page_end.from_slice+1
                }))

                // Переключаемся между слайдами
                document.getElementById('lemma-tab').click()
            }
        }
    }

    render() {
        const { activeLemma } = this.state
        // проверка на наличие главы
        const glavs_isset = (this.state.course_heads.length && this.props.activeLemmaModule)

        // Если есть сохраненные данные
        let { cache_from_slice, cache_to_slice } = this.state
        return (
            <div className="lemma">
                <form id="lemma-form" className="row">
                    {glavs_isset && this.props.course_id ? <React.Fragment>
                        <div className='lemma__top'>
                            <a id="top"></a>
                            <div className="fingman_panel_wrapper course-glavs__button">
                                <CourseGlavs
                                    onSetGlav={this.updateCurrentGlav}
                                    activeGlav={this.state.currentGlav}
                                    triggerSorting={this.triggerSorting}
                                    onSetNameGlav={this.props.onChangeCurrentGlav}
                                    courseId={this.state.course_id}
                                    data={this.state.course_heads}
                                    onUpdate={this.props.onUpdate}
                                    notWidgets={false}
                                    modalId={'modal-changeGlavs'}
                                />

                                <Checkbox title={'Пропустить этап выделения слов'} checked={this.state.skip_lemma_text} onChange={is_checked => this.setState(() => ({ skip_lemma_text: is_checked }))} />
                            </div>
                            <div className="fingman_panel_wrapper">
                                <div className="course-glavs__top">
                                    <div className="course-glavs__top__item">
                                        <div className="course-glavs__addPhrase">
                                            <a href="#modal-lemma-uploadText"
                                            className="btn-new btn-new--green modal-trigger"
                                               onClick={(e) => {e.preventDefault(); closeSidebar()}}
                                           >Загрузить текст</a>
                                        </div>
                                        <ToolTip info={'Нажмите на кнопку, чтобы загрузить текст'} icon={'help'}/>
                                    </div>
                                    <div className="course-glavs__top__item">
                                        <div className="course-glavs__addPhrase">
                                            <a href="#modal-lemma-uploadBook"
                                            className="btn-new btn-new--grey modal-trigger"
                                            onClick={(e) => {e.preventDefault(); closeSidebar()}}
                                            >Загрузить книгу</a>
                                        </div>
                                        <ToolTip info={'Нажмите на кнопку, чтобы загрузить книгу'} icon={'help'}/>
                                    </div>
                                </div>
                            </div>

                                    <hr className={'fingman__divider'} />
                             {/* <div className="lemma__upload__wrapper d-flex align-items-center justify-content-start">
                                <a id="lemma_show_heads" className="btn btn-success--new shadow--none" href="" onClick={
                                    (e)=>{e.preventDefault();
                                    $('.lemma__upload__text').addClass('d--none');
                                    $('.lemma__upload__book').addClass('d--none');
                                    $('.lemma__select__glavs').toggleClass('d--none');
                                }}>Выбрать главу для добавления фраз</a>
                                <a className="btn btn-info--new shadow--none ml1 mr1" onClick={(e)=>{
                                    e.preventDefault(); $('.lemma__upload__book').addClass('d--none');
                                    $('.lemma__upload__text').toggleClass('d--none');
                                    $('.lemma__select__glavs').addClass('d--none');
                                }}>Загрузить текст</a>
                                <a className="btn btn-info--new shadow--none mr1" onClick={
                                    (e)=>{e.preventDefault();
                                        $('.lemma__upload__text').addClass('d--none');
                                        $('.lemma__upload__book').toggleClass('d--none');
                                        $('.lemma__select__glavs').addClass('d--none');
                                    }}>Загрузить книгу</a>
                            </div>
                             <div className="lemma__upload__text d--none">

                            </div>
                            <div className="lemma__upload__book d--none">

                            </div>  */}
                             {/* <div className="lemma__select__glavs d--none">
                                <CourseGlavs
                                    onSetGlav={this.updateCurrentGlav} activeGlav={this.state.currentGlav}
                                    notWidgets={true}
                                    noTtitle={true}
                                    courseId={this.props.activeLemmaModule.id} data={this.state.course_heads}
                                />
                            </div>  */}
                        </div>
                    </React.Fragment> : <h3>В данном курсе не найдены главы!</h3>}

                    <Modal modalClass={'lemma-uploadText'} content={LemmaUploadText} data={{ createLemma: this.createLemma }} />
                    <Modal modalClass={'lemma-uploadBook'} content={LemmaUploadBook} data={{ createLemma: this.createLemma }} />
                    <Modal modalClass={'changeGlavs'} content={CourseGlavsChange} data={{data: this.state.course_heads, onSetGlav: this.updateCurrentGlav, activeGlav: this.state.currentGlav, ...this.props}} />
                </form>

                {activeLemma.length ? activeLemma.map((item, i) => {
                    if(this.state.currentGlav.id == item.head_id) {
                        return <LemmaTableComponent
                            onDoPhrase={this.onDoPhrase}
                            onUpdatePhrase={this.onUpdatePhrase}
                            book_path={item.book_path}
                            default_slice_value={this.state.default_slice_value}
                            onDeleteLemma={this.onDeleteLemma}
                            id={item.id}
                            indexLemma={i}
                            key={i}
                            course_id={this.state.course_id}
                            currentGlav={this.state.currentGlav}
                            updateCurrentGlav={this.updateCurrentGlav}
                            phrase={item.text}
                            onSetActive={this.setActiveLemma}
                            data={item.data}

                            from_slice={cache_from_slice}
                            to_slice={cache_to_slice}
                        />
                    }
                }) : glavs_isset ? <Loader /> : ''}
            </div>

        )
    }
}
