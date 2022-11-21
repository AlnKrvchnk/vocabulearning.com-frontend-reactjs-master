import React from 'react'

import Button from '../../../../../global-components/layout/Button'
import Input from '../../../../../global-components/layout/Input'
import ToolTip from '../../../../../global-components/layout/ToolTip/ToolTip'

import TextSelecting from './create-module/Text-Selecting-Item'
import AudioRecorders from 'audio-recorders'

import { Select, File } from '../../../../../global-components/layout/Inputs'

import { formObject, getCurrentUserToken, updateChips, randomNumbers, Toast, loadAllAudios } from '../../../../../functions'

import axios from 'axios'
import API from '../../../../../config/API'

import WordRecorder from './create-module/WordRecorder'
import Loader from '../../../../../global-components/layout/Loader';
import LoaderPolly from './create-module/polly/Loader';
import InputToggler from "../../../../../global-components/layout/InputToggler/InputToggler";
import Audio from "../../../../../global-components/layout/AudioPlayer/AudioPlayer";

export default class ModuleUpdateWord extends React.Component {
    constructor (props) {
        super(props)

        this.defaultState = {
            inputVal: '',
            selectedWords: [],
            typeDownloadAudio: props.defaultTypeDownloadAudio,
            word: {
                recorderText: 'Записать слово',
                currentRecordingAudio: null,
                currentAudioBlob: null
            },
            phrase: {
                recorderText: 'Записать фразу',
                currentRecordingAudio: null,
                currentAudioBlob: null
            },

            pollyData: {
                loading: false,
                gettingResult: false,
                result: null,
                tmpPhrase: '',
                tmpWord: '',
                isTMP: false
            },

            propsData: {
                loading: true
            },

            maxPhrases: 300,
            currentCountPhrases: 0,

            currentCountWords: 0,
            maxWords: 15,

            defaultSaveColor: 'default',
            currentModalOpen: false
        }
        this.state = this.defaultState

        this.inputPhrase = this.inputPhrase.bind(this)
        this.parseSelectData = this.parseSelectData.bind(this)
        this.getSelectedWords = this.getSelectedWords.bind(this)

        this.getAudioInput = this.getAudioInput.bind(this)
        this.getValidTypeAudio = this.getValidTypeAudio.bind(this)
        this.recordAudio = this.recordAudio.bind(this)
        this.stopRecordAudio = this.stopRecordAudio.bind(this)
        this.clearPhrases = this.clearPhrases.bind(this)
        this.getChips = this.getChips.bind(this)
        this.deleteSelectedWord = this.deleteSelectedWord.bind(this)
        this.parseSelecting = this.parseSelecting.bind(this)
        this.selectFromIndex = this.selectFromIndex.bind(this)
        this.parseInputBlur = this.parseInputBlur.bind(this)
        this.getMax = this.getMax.bind(this)
        this.setNewProps = this.setNewProps.bind(this)
        this.getAssociationType = this.getAssociationType.bind(this)
        this.switchTypeDownloadAudio = this.switchTypeDownloadAudio.bind(this)

        this.myForm = React.createRef()
    }

    switchTypeDownloadAudio (typeDownloadAudio, goProps = true) {
        this.setState(() => ({ typeDownloadAudio }))

        if(this.props.checkAudioDefaultType && goProps)
            this.props.checkAudioDefaultType(typeDownloadAudio)
    }

    selectFromIndex (index) {
        const findSelectWord = this.state.selectedWords.filter(item => {
            return item.index == index;
        })

        if(findSelectWord.length) {
            return true;
        }

        return false;
    }

    clearPhrases () {
        this.setState(() => ({
            inputVal: '',
            selectedWords: []
        }))

        this.myForm.phrase_top.value = ''
    }

    onCreatePhrase (form) {
        const data = new FormData(form);
        const TOKEN = getCurrentUserToken();

        if(this.state.word.currentAudioBlob && this.state.phrase.currentAudioBlob) {
            data.append('audio_word', this.state.word.currentAudioBlob)
            data.append('audio_phrase', this.state.phrase.currentAudioBlob)
        }

        if(this.state.typeDownloadAudio == 'record' && (!this.state.word.currentAudioBlob || !this.state.phrase.currentAudioBlob)) {
            M.toast({ html: 'Вы не записали голос с микрофона!', classes: 'red' })
            return;
        }

        if(this.state.pollyData.isTMP) {
            data.append('audio_word', this.state.pollyData.tmpWord)
            data.append('audio_phrase', this.state.pollyData.tmpPhrase)
            data.append('is_tmp', true)
        }

        data.append('audio_word_loc', this.props.audio_word.replace(API.host,''))
        data.append('audio_phrase_loc', this.props.audio_phrase.replace(API.host,''))
        // отправляем запрос на обновление фразы
        axios.post(`${API.host}/api/word/${this.props.id}`, data, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            const responseData = response.data;
            if(responseData.success) {
                M.toast({ html: responseData.message, classes: 'green' })
                window.modals['modal-update-word'].$el.find('form input:not([name="word"]):not(.select-dropdown), form textarea').val('').attr('value', '');
                window.modals['modal-update-word'].$el.find('input.invalid').removeClass('invalid');
                window.modals['modal-update-word'].close();
                
                let typeDownloadAudio = this.state.typeDownloadAudio
                this.setState( this.defaultState, () => {
                    this.switchTypeDownloadAudio(typeDownloadAudio)
                } );

                this.props.triggerEvent({ id: this.props.course_id });

                loadAllAudios()
            } else {
                M.toast({ html: `${responseData.error_message}`, classes: 'red' })
            }
        })
    }

    getRecorderTextFromType (typeAudio) {
        switch(typeAudio) {
            case 'word':
                return 'Записать слово';
            break;
            case 'phrase':
                return 'Записать фразу';
            break;
        }
    }

    recordAudio (typeAudio) {
        navigator.getUserMedia({audio: true}, (stream) => {
            this.setState(() => ({
                [typeAudio]: {
                    ...this.state[typeAudio],
                    recorderText: 'Идет запись...'
                }
            }))

            const config = {
                exportAudio: 'wav'
            }

            this.recorder = new AudioRecorders(stream, config)

            this.recorder.onReceiveAudioBlob = (blobs) => {
                const audioUrl = URL.createObjectURL(blobs);
                const audio = new Audio(audioUrl);
                const MAX_AUDIO_LENGTH = 500000

                if(blobs.size > MAX_AUDIO_LENGTH) {
                    Toast('Вы записали слишком длинное аудио, попробуйте ещё раз', 'default')
                    this.setState(() => ({
                        [typeAudio]: {
                            currentRecordingAudio: null,
                            currentAudioBlob: null,
                            recorderText: this.getRecorderTextFromType(typeAudio)
                        }
                    }))
                } else {
                    this.setState(() => ({
                        [typeAudio]: {
                            currentRecordingAudio: audioUrl,
                            currentAudioBlob: blobs,
                            recorderText: this.getRecorderTextFromType(typeAudio)
                        }
                    }))
                }
            }

            this.recorder.startRecord();
        }, () => {
            console.warn('не удалось записать аудио')
        })
    }

    stopRecordAudio (typeAudio) {
        this.recorder.stopRecord();
    }

    inputPhrase (e) {
        let data = e.target.value

        // Изменено для input (defaultValue)
        let new_data = data.replace(/,|\.|\?|\!/g, x => {
            return ' ' + x + ' '
        })

        this.setState(() => ({
            inputVal: new_data,
            defaultInputVal: data,
            selectedWords: [],
            currentCountPhrases: data.length,
            currentCountWords: 0
        }))
    }

    parseSelectData (data, fi, li) {
        data = data.trim()
        let newData = this.state.inputVal.splice(fi, li,  `{*}`);

        if(confirm("Сохранить слово?")) {
            this.setState(prevState => ({
                inputVal: newData,
                selectedWords: [...prevState.selectedWords, data]
           }))
        } else {
            window.getSelection().removeAllRanges()
        }
    }

    getSelectedWords () {
        if(this.state.selectedWords.length <= 0) {
            return '';
        }

        const selectedWords = this.state.selectedWords.map(item => {
            return item.word;
        })

        return selectedWords.join(',');
    }

    componentDidUpdate () {
        updateChips()
        M.FormSelect.init(document.querySelectorAll('select'));
    }

    getAudioInput (type) {
        switch(this.state.typeDownloadAudio) {
            case 'download':
                return (
                    <div className="recorder-audio">
                        <div className="recorder-audio__block">
                            <div className="modal__tooltip">
                                <p>Слово</p>
                            </div>
                            <File validExts={/(\.mp3|\.wav)/g} title={'Загрузить слово'} type={'audio'} name={'audio_word'} />
                        </div>
                        <div className="recorder-audio__block">
                            <div className="modal__tooltip">
                                <p>Фраза</p>
                            </div>
                            <File validExts={/(\.mp3|\.wav)/g} title={'Загрузить фразу'} type={'audio'} name={'audio_phrase'} />
                        </div>
                    </div>
                )
            break;

            case 'record':
                return (
                    <div className="recorder-audio">
                        <div className="recorder-audio__block">
                            <div className="modal__tooltip mb-3">
                                <p>Запись слова</p> <ToolTip icon={'help'} info={'Максимальное время записи - 15 сек. Для записи нажмите кнопку и разрешите вашему браузеру доступ к микрофону'} />
                            </div>
                            <WordRecorder
                                start={this.recordAudio}
                                stop={this.stopRecordAudio}
                                title={this.state.word.recorderText}
                                checkTitle={'Записать слово'}
                                type={'word'}
                            />
                            { (this.state.word.currentRecordingAudio) ? <Audio src={`${this.state.word.currentRecordingAudio}`} hidden={''} /> : '' }
                        </div>
                        <div className="recorder-audio__block">
                            <div className="modal__tooltip mb-3">
                                <p>Запись фразы</p> <ToolTip icon={'help'} info={'Максимальное время записи - 15 сек. Для записи нажмите кнопку и разрешите вашему браузеру доступ к микрофону'} />
                            </div>
                            <WordRecorder
                                start={this.recordAudio}
                                stop={this.stopRecordAudio}
                                checkTitle={'Записать фразу'}
                                title={this.state.phrase.recorderText}
                                type={'phrase'}
                            />
                            { (this.state.phrase.currentRecordingAudio) ? <Audio src={`${this.state.phrase.currentRecordingAudio}`} hidden={''} /> : '' }
                        </div>
                    </div>
                )
            break;

            case 'polly':
                const { pollyData, voices } = this.state
                const selectId = 'select_speaker_' + randomNumbers(10)

                const resultLangueges = voices[this.props.course.langueges];

                if(resultLangueges === undefined) {
                    return <p>В данном языке не найдены спикеры</p>
                }

                return (
                    <div className="recorder-audio row">
                        <div className="row">
                            <a href="https://docs.aws.amazon.com/polly/latest/dg/ph-table-russian.html" target="_blank">Перед озвучкой, ознакомьтесь пожалуйста с правилами произношения слов</a>
                        </div>
                        <div className="row">
                            <div className="col m6 s12">
                                <select id={selectId} className="browser-default" defaultValue="">
                                    <option value="" disabled>Выберите спикера</option>
                                    {
                                        Object.keys(resultLangueges).map((item, i) => {
                                            return <option value={item} key={i}>{item}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col m6 s12">
                                <Button color={'blue'} title={'Отправить на обработку'} type={'button'} onChange={() => {
                                    this.getAWSPollyData(selectId)
                                }} />
                            </div>
                        </div>

                        {pollyData.loading ? <LoaderPolly /> : ''}
                        {pollyData.gettingResult ? pollyData.gettingResult.map((aud, i) => {
                            return <div className="input-field" key={i}><audio controls>
                                <source src={API.host + '/' + aud} type="audio/mpeg"></source></audio>
                            </div>
                        }) : ''}
                    </div>
                )
            break;
        }
    }

    getAWSPollyData (selectId) {
        const voice = document.getElementById(selectId).value
        if(voice.length) {
            const phrase = this.state.defaultInputVal
            const lang = this.props.course.langueges
            const words = this.state.selectedWords.map(item => {
                return item.word
            }).join(',')

            if(!words || !phrase) {
                Toast('Вы не выделили ни одного слова', 'red')
                return
            }

            const TOKEN = getCurrentUserToken();
            axios.post(API.host + '/api/polly', {
                pollyText: phrase,
                pollyAudioPrefix: 'phrase',
                pollyVoice: voice,
                pollyLang: lang
            }, {
                headers: {
                    'Authorization': TOKEN
                }
            })
            .then(response => {
                axios.post(API.host + '/api/polly', {
                    pollyText: words,
                    pollyAudioPrefix: 'word',
                    pollyVoice: voice,
                    pollyLang: lang
                }, {
                    headers: {
                        'Authorization': TOKEN
                    }
                }).then(responseWord => {
                    const dataPhrase = response.data;
                    const dataWord = responseWord.data;
                    const result = [dataPhrase.data.path, dataWord.data.path]
                    this.setState(prevState => ({
                        pollyData: {
                            ...prevState.pollyData,
                            loading: false,
                            gettingResult: result,
                            tmpPhrase: result[0],
                            tmpWord: result[1],
                            isTMP: true
                        }
                    }))
                })
            })

            this.setState(prevState => ({
                pollyData: {
                    ...prevState.pollyData,
                    loading: true
                }
            }))
        } else {
            Toast('Вы не выбрали спикера', 'red')
        }
    }

    getValidTypeAudio () {
        const typeDownload = this.state.typeDownloadAudio;

        if(typeDownload == 'download' || typeDownload == 'record' || typeDownload == "polly") {
            return true;
        }

        return false;
    }

    componentDidMount () {
        let findModals = setInterval(() => {
            if(self.modals) {
                let currentModal = self.modals['modal-update-word']

                if(currentModal) {
                    currentModal.options.onCloseEnd = () => {
                        this.setState(this.defaultState)
                        this.setState(() => ({ currentModalOpen: false }))
                    }
                    currentModal.options.onOpenEnd = () => {
                        this.setState(() => ({ defaultSaveColor: 'default', currentModalOpen: true }))
                    }
                    clearInterval(findModals)
                    return
                }
            }
        }, 500);

        axios.get(API.host + '/api/polly/voices').then(response => {
            const data = response.data.data;
            this.defaultState.voices = data
        })
    }

    deleteSelectedWord (word, index) {
        const clearWord = this.state.selectedWords.filter(item => {
            return item.index !== index;
        })

        let defaultWords = this.state.defaultInputVal.split(' ');
        let clearingPhrase = this.state.inputVal.split(' ');
        clearingPhrase[index] = defaultWords[index];

        this.setState(() => ({
            selectedWords: clearWord,
            inputVal: clearingPhrase.join(' '),
            currentCountWords: clearWord.length
        }))

        /*
        TODO - функционал выделения текста
        let selectedText = this.state.inputVal;
        let matchStars = selectedText.split(' ');
        let indexesStars = [];
        matchStars.forEach((star, i) => {
            if(star.match(/\{\*\}/g) !== null) {
                indexesStars.push({
                    index: i
                })
            }
        })
        const currentStar = indexesStars[index];

        if(currentStar) {
            let resultString = matchStars;
            let newSelectedWords = this.getSelectedWords().split(',').filter(wordSelect => {
                return wordSelect !== word;
            });
            resultString[currentStar.index] = word;

            this.setState(() => ({
                inputVal: resultString.join(' '),
                selectedWords: newSelectedWords
            }))
        }*/
    }

    getChips (words) {
        let _words = words.filter(word => {
            if(word !== "" || word.word !== "") return word;
        })
        if(_words.length) {
            _words = _words.map((word, i) => {
                const w = word.word;
                return <div key={i} className="chips-words__chip" data-word={w}>{w} <i onClick={e => {
                    e.preventDefault()
                    this.deleteSelectedWord(w, word.index)
                }} className="close material-icons">close</i></div>
            })

            return _words;
        }
    }

    parseSelecting ({ word, index }) {
        let newSelWords = this.state.selectedWords;
        newSelWords.push({ index, word })

        newSelWords.sort(function(a, b){
            if(a.index < b.index) { return -1; }
            if(a.index > b.index) { return 1; }
            return 0;
        })

        let phr = this.state.inputVal.split(' ');
        newSelWords.forEach(item => {
            phr[item.index] = '{*}';
        })

        if(newSelWords.length <= this.state.maxWords) {
            this.setState(() => ({
                selectedWords: newSelWords,
                inputVal: phr.join(' '),
                currentCountWords: newSelWords.length
            }))
        } else {
            Toast('Вы выделили максимальное количество слов!', 'red')
        }
    }

    parseInputBlur () {
        if(this.myForm) {
            const formData = formObject( this.myForm )

            let oneChanged = false
            for(let key in formData) {
                if(formData[key].trim().length > 0) {
                    oneChanged = true
                }
            }

            if(oneChanged) {
                this.setState(() => ({ defaultSaveColor: 'green' }))
            } else {
                this.setState(() => ({ defaultSaveColor: 'default' }))
            }
        }
    }

    getMax (type) {
        switch(type) {
            case 'phrase':
                return this.state.currentCountPhrases + ' / ' + this.state.maxPhrases
            break;
            case 'words':
                return this.state.currentCountWords + ' / ' + this.state.maxWords;
            break;
        }
    }

    getDefInpVal (phrase, wordsArray) {
        const phraseArray = phrase.split(' ')
        let totalCounter = 0;
        let selectedWords = []

        phraseArray.forEach((item, i) => {
            if(item == '{*}') {
                phraseArray[i] = wordsArray[totalCounter]
                selectedWords.push({
                    word: wordsArray[totalCounter],
                    index: i
                })
                totalCounter++
            }
        })

        return {
            selectedWords,
            data: phraseArray.join(' ')
        }
    }

    setNewProps (data) {
        const selWords = data.word.split(',')
        const D_I_V = this.getDefInpVal(data.phrase, selWords)

        const defaultInputVal = D_I_V.data.replace(/\n/g, ' ')
        const SW = D_I_V.selectedWords

        this.setState(() => ({
            propsData: {
                ...data,
                loading: false
            },
            defaultInputVal,
            selectedWords: SW,
            inputVal: data.phrase,
            currentCountPhrases: defaultInputVal.length,
            currentCountWords: SW.length
        }))
    }

    componentWillReceiveProps (props) {
        if(props.id || props.course_id) {
            this.setNewProps( props )

            // Ставим по умолчанию ассоциацию и тип озвучки
            const { defaultTypeDownloadAudio, association } = props
            const type_association = this.getAssociationType(association)

            this.switchTypeDownloadAudio(defaultTypeDownloadAudio.trim(), false)
        }

        if(props.AudioDefaultType) {
            this.switchTypeDownloadAudio(props.AudioDefaultType)
        }
    }

    getAssociationType (str) {
        let check = (!(!str)) ? str.match(/(\.png|\.jpeg|\.jpg|\.svg)/g) : ''

        return {
            isset: check,
            type: check ? 'image' : 'text'
        }
    }

    togglePhrasesHeight () {
        const phraseTextarea = document.querySelector('#phrasesSelector');
        console.log(phraseTextarea);
        phraseTextarea.classList.toggle('height--0');
    }

    toggleModalSelectWord (evt) {
        const selectWordBlock = document.querySelector('#modalUpdateWordWrapper');
        const selectWordTogglerLink = evt.target;
        if (!selectWordBlock.classList.contains('height--0')) {
            selectWordBlock.classList.add('height--0');
            selectWordBlock.classList.remove('height--auto');
            selectWordTogglerLink.innerHTML = 'Развернуть окно выбора слова <i class="material-icons">expand_more</i>';
        } else {
            selectWordBlock.classList.remove('height--0');
            selectWordBlock.classList.add('height--auto');
            selectWordTogglerLink.innerHTML = 'Свернуть окно выбора слова <i class="material-icons">expand_less</i>';
        }
    }

    render () {
        const selectedWords = this.getSelectedWords();
        let { association_image = '', association, word, explanation, explanation_second, audio_phrase, audio_word, explanation_word, morph_priz, etymology, type_sound } = this.props
        const isAssociationImage = this.getAssociationType(association);

        const { typeDownloadAudio } = this.state

        return (
            <div className="modal-content">
                {this.state.propsData.loading ? <Loader /> :
                    <form className="creating-module-form" id="update-module-form-modal" ref={el => this.myForm = el} onSubmit={e => {
                        e.preventDefault();
                        // UPDATE
                        this.onCreatePhrase(e.target)
                    }}>
                        <div className="modal__row modal__row--start">
                            <div className="modal__row__left">
                                <div className="modal__tooltip mb-3">
                                    <p>Название курса</p>
                                </div>
                                <h4>Тестовый курс</h4>
                            </div>
                            <div className="modal__row__right">
                                <div className="modal__tooltip mb-3">
                                    <p>Название главы</p>
                                </div>
                                <h4>Тестовый курс</h4>
                            </div>
                        </div>
                        <hr className="fingman__divider"/>
                        <div className="modal__row modal__row--between">
                            <div className="modal__row__left modal__row--relative">
                                <div className="modal__tooltip">
                                    <p>Введите фразу или предложение {this.getMax('phrase')}</p> <ToolTip info={'Введите фразу или предложение для разбиения'} icon={'help'} />
                                </div>
                                {/* defaultValue={_dfv.phrase}  */}
                                <textarea style={{height: 'auto'}} value={this.state.defaultInputVal} placeholder="Фраза..." id="text_area_update_modal" maxLength={this.state.maxPhrases} onBlur={this.parseInputBlur} required onInput={this.inputPhrase} name="phrase_top" className="materialize-textarea"></textarea>
                                <input onBlur={this.parseInputBlur} type={'hidden'} name={'phrase'} value={this.state.inputVal} />
                                <InputToggler element={'textarea'} selector={''} />
                                {/*<a href="" onClick={e => {*/}
                                {/*    e.preventDefault();*/}
                                {/*    this.clearPhrases();*/}
                                {/*}} className="btn-clear-phrase"><i className="right material-icons">clear</i></a>*/}
                            </div>
                            <div className="modal__row__right">
                                <div className="modal__tooltip">
                                    <p className={"update__modal__heading"}>Перевод фразы </p>
                                    <ToolTip info={"Отредактируйте перевод фразы"} icon={'help'}/>
                                </div>
                                <Input autoSetValue={this.state.currentModalOpen} onBlurring={this.parseInputBlur} name={'explanation'} val={explanation} isRequire label={' '} />
                            </div>
                        </div>
                        <hr className="fingman__divider"/>
                        <div className="modal__row modal__row--between">
                            <div className="modal__row--between w--100">
                                <div className="modal__tooltip modal__tooltip--short">
                                    <p><strong>Выделите изучаемое слово {this.getMax('words')}</strong></p> <ToolTip info={'Выделите изучаемое слово'} icon={'help'} />
                                </div>
                                <a href="" tabIndex="-1" className="btn__selectWord" onClick={(evt) => {evt.preventDefault(); this.toggleModalSelectWord(evt)}}>
                                    Свернуть окно выбора слова
                                    <i className="material-icons">expand_less</i>
                                </a>
                            </div>
                            <div id="modalUpdateWordWrapper">
                                <TextSelecting
                                    text={this.state.inputVal}
                                    onRemoveWord={this.deleteSelectedWord}
                                    onSelect={this.parseSelecting}
                                    selectFromIndex={this.selectFromIndex}
                                    id={'phrasesSelector'}
                                />
                                <input name={'word'} type={'hidden'} value={selectedWords} />
                            </div>
                        </div>
                        <div className="modal__row modal__row--triple mt-4">
                            <div className="modal__col">
                                <div className="modal__tooltip">
                                    <p>Выбранное слово</p>
                                    <ToolTip info={'Выбранное слово'} icon={'help'} />
                                </div>
                                {(this.state.selectedWords.length) ? <div className="chips-words">{this.getChips(this.state.selectedWords)}</div> : ''}
                            </div>
                            <div className="modal__col">
                                <div className="modal__tooltip">
                                    <p>Перевод слова</p>
                                    <ToolTip info={'Перевод слова'} icon={'help'} />
                                </div>
                                <Input autoSetValue={this.state.currentModalOpen} onBlurring={this.parseInputBlur} val={explanation_second} name={'explanation_second'} isRequire label={' '} />
                            </div>
                            <div className="modal__col">
                                <div className="modal__tooltip">
                                    <p>Морфология</p>
                                    <ToolTip info={'Морфология'} icon={'help'} />
                                </div>
                                <Input autoSetValue={this.state.currentModalOpen} onBlurring={this.parseInputBlur} val={morph_priz} name={'morph_priz'} label={' '} />
                            </div>
                        </div>
                        <div className="modal__row modal__row--audio mt-3">
                            <div className="modal__row__left">
                                <div className="modal__tooltip">
                                    <p>Выберите тип озвучки</p>
                                </div>
                                <Select
                                    items={[
                                        {value:'download', title: 'Загрузить аудио'},
                                        {value:'record', title: 'Записать голосом'},
                                        //{value:'polly', title: 'Озвучить роботом'}, - ВРЕМЕННО ЗАБЛОКИРОВАН
                                        {value:'', title: 'Шаблонное аудио'}
                                    ]}
                                    val={typeDownloadAudio ? typeDownloadAudio : type_sound}
                                    name={'type_sound'}
                                    isRequire={false}
                                    onChange={(selectValue) => {
                                        this.parseInputBlur()
                                        this.switchTypeDownloadAudio(selectValue.trim())
                                    }}
                                />
                            </div>
                            <div className="modal__row__middle">
                                <p>Слово:</p>
                                <audio controls>
                                    <source src={audio_word} type="audio/mpeg"></source>
                                </audio>
                                
                                <p>Фраза:</p>
                                <audio controls>
                                   <source src={audio_phrase} type="audio/mpeg"></source>
                                </audio>

                                {this.getAudioInput()}
                            </div>
                        </div>
                        <hr className={"fingman__divider"} />
                        <h4 className="mb-5">Отредактируйте пояснения для изучаемого слова</h4>
                        <div className="modal__row modal__row--single">
                            <div className="modal__tooltip">
                                <p>Пояснение слова</p> <ToolTip icon={'help'} info={'Отредактируйте пояснение слова'} />
                            </div>
                            <Input autoSetValue={this.state.currentModalOpen} onBlurring={this.parseInputBlur} val={explanation_word} name={'explanation_word'} isRequire label={' '} />
                        </div>
                        <div className="modal__row">
                            <div className="modal__tooltip">
                                <p>Этимология слова</p> <ToolTip icon={'help'} info={'Отредактируйте этимологию слова'} />
                            </div>
                            <Input autoSetValue={this.state.currentModalOpen} onBlurring={this.parseInputBlur} val={etymology} name={'etymology'} label={' '} />
                        </div>
                        <div className="modal__row">
                            <div className="modal__row__left modal--association">
                                <div className="modal__tooltip">
                                    <p>Текстовая ассоциация</p> <ToolTip icon={'help'} info={'Отредактируйте текстовую ассоциацию'} />
                                </div>
                                <Input onBlurring={this.parseInputBlur} val={this.props.association} name={'association'} isRequire />
                            </div>
                            <div className="modal__row__right">
                                <div className="modal__tooltip">
                                    <p>Ассоциация - изображение</p> <ToolTip icon={'help'} info={'Выберите изображение для ассоциации'} />
                                </div>
                                <File name={'association_image'} val={association_image} type={'image'} />
                            </div>
                        </div>
                        <hr className={"fingman__divider"}/>
                        <div className="modal__row modal__row--end">
                            <Button submit title={'Сохранить'} color={'#1BBC9B'} customClass={'modal--submit'} />
                        </div>




                        {/*<hr className={"fingman-divider"}/>*/}
                        {/*<h2>Старая верстка</h2>*/}
                        {/*<div className="update__modal__top">*/}
                        {/*    <div className="update__modal__double">*/}
                        {/*        <div className="update__modal__left">*/}
                        {/*            <div className="update__modal__info">*/}
                        {/*                <small className="update__modal__heading">Введите фразу или предложение <span>{this.getMax('phrase')}</span></small>*/}
                        {/*                <ToolTip info={'Введите фразу или предложение, содержащие изучаемое слово.'} icon={'help'} />*/}
                        {/*            </div>*/}
                        {/*            <div className="update__modal__input">*/}
                        {/*                <textarea style={{height: 'auto'}} value={this.state.defaultInputVal} placeholder="Фраза..." id="text_area_update_modal" maxLength={this.state.maxPhrases} onBlur={this.parseInputBlur} required onInput={this.inputPhrase} name="phrase_top" className="materialize-textarea"></textarea>*/}
                        {/*                <input onBlur={this.parseInputBlur} type={'hidden'} name={'phrase'} value={this.state.inputVal} />*/}

                        {/*                <a href="" onClick={e => {*/}
                        {/*                    e.preventDefault();*/}
                        {/*                    this.clearPhrases();*/}
                        {/*                }} className="btn-clear-phrase"><i className="right material-icons">clear</i></a>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*        <div className="update__modal__right">*/}
                        {/*            <div className="update__modal__selectWord">*/}
                        {/*                <p className="update__modal__heading" >Выделите изучаемое слово {this.getMax('words')}*/}
                        {/*                    <a*/}
                        {/*                        className={'modal__selectWord__toggler'}*/}
                        {/*                        href={""}*/}
                        {/*                        onClick={*/}
                        {/*                            (evt) => {*/}
                        {/*                                evt.preventDefault();*/}
                        {/*                                evt.target.classList.toggle('rotate--180');*/}
                        {/*                                this.togglePhrasesHeight();*/}
                        {/*                            }*/}
                        {/*                        }>*/}
                        {/*                        <i className={'material-icons'}>expand_more</i>*/}
                        {/*                    </a>*/}
                        {/*                </p>*/}

                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="update__modal__double">*/}
                        {/*        <div className="update__modal__left">*/}
                        {/*            <div className="update__modal__selectAudio">*/}
                        {/*                <div className="update__modal__item__horizontal w--100">*/}
                        {/*                    <p className="update__item__heading">Выберите тип озвучки</p>*/}
                        {/*                    <ToolTip info={'Выберите тип озвучки из выпадающего списка'} icon={'help'} />*/}
                        {/*                </div>*/}
                        {/*                */}
                        {/*            </div>*/}

                        {/*            <div className="update__modal__audioUpload">*/}
                        {/*                <p className="update__modal__heading">Загрузить слово</p>*/}
                        {/*                <div className="update__modal__audio">*/}
                        {/*                    */}
                        {/*                </div>*/}
                        {/*            </div>*/}

                        {/*            <div className="update__modal__audioUpload">*/}
                        {/*                <p className="update__modal__heading">Загрузить фразу</p>*/}
                        {/*                <div className="update__modal__audio">*/}
                        
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*        <div className="update__modal__right">*/}
                        {/*            <div className="update__modal__item update__modal__translation">*/}
                        {/*                <div className="update__modal__translation__top w--100">*/}
                        {/*                    <p className={"update__modal__heading"}>Выделенные слова </p>*/}
                        {/*                </div>*/}

                        {/*            </div>*/}

                        {/*            <div className="update__modal__item update__modal__translation">*/}
                        {/*                <div className="update__modal__translation__top w--100">*/}
                        {/*                    <p className={"update__modal__heading"}>Перевод слова </p>*/}
                        {/*                    <ToolTip info={"Отредактируйте перевод слова"} icon={'help'}/>*/}
                        {/*                </div>*/}

                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<hr className="fingman__divider"/>*/}
                        {/*<div className="update__modal__additional">*/}
                        {/*    <h4 className={"update__modal__bigHeading"}>Заполните пояснения для изучаемого слова</h4>*/}
                        {/*    <div className="update__modal__item">*/}
                        {/*        <div className="update__modal__item__horizontal">*/}
                        {/*            <p className={"update__modal__heading"}>Текстовая ассоциация</p>*/}
                        {/*            <ToolTip info={"Отредактируйте текстовую ассоциацию"} icon={'help'}/>*/}
                        {/*        </div>*/}
                        {/*        <div className="update__modal__association">*/}
                        {/*            <div className="update__modal__association__left">*/}
                        {/*                */}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="update__modal__item">*/}
                        {/*        <div className="update__modal__item__horizontal">*/}
                        {/*            <p className={"update__modal__heading"}>Графическая ассоциация</p>*/}
                        {/*            <ToolTip info={"Отредактируйте графическую ассоциацию"} icon={'help'}/>*/}
                        {/*        </div>*/}

                        {/*        */}
                        {/*    </div>*/}
                        {/*    <div className="update__modal__item">*/}
                        {/*        <div className="update__modal__item__horizontal">*/}
                        {/*            <p className={"update__modal__heading"}>Подробный разбор слова</p>*/}
                        {/*            <ToolTip info={"Отредактируйте подробный разбор слова"} icon={'help'}/>*/}
                        {/*        </div>*/}
                        {/*        */}
                        {/*    </div>*/}
                        {/*    <div className="update__modal__item">*/}
                        {/*        <div className="update__modal__item__horizontal">*/}
                        {/*            <p className={"update__modal__heading"}>Морфологический признак</p>*/}
                        {/*            <ToolTip info={"Отредактируйте морфологический признак"} icon={'help'}/>*/}
                        {/*        </div>*/}

                        {/*    </div>*/}
                        {/*    <div className="update__modal__item">*/}
                        {/*        <div className="update__modal__item__horizontal">*/}
                        {/*            <p className={"update__modal__heading"}>Этимология слова</p>*/}
                        {/*            <ToolTip info={"Отредактируйте этимологию слова"} icon={'help'}/>*/}
                        {/*        </div>*/}
                        {/*        */}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*<div className="col s12 m-0 p-0">*/}
                        {/*   */}
                        {/*</div>*/}
                    </form>
                }
            </div>
        )
    }
}
