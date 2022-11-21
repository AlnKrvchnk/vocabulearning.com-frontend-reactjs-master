import React from 'react'

import Button from '../../../../../global-components/layout/Button'
import Input from '../../../../../global-components/layout/Input'

import TextRanger from './create-module/TextRanger'
import TextSelecting from './create-module/Text-Selecting-Item'
import AudioRecorders from 'audio-recorders'

import { Select, File } from '../../../../../global-components/layout/Inputs'

import { formObject, getCurrentUserToken, updateChips, updateSelects, clearForm, randomNumbers, Toast, $API, parseSelectingFunc, loadAllAudios } from '../../../../../functions'

import axios from 'axios'
import API from '../../../../../config/API'

import WordRecorder from './create-module/WordRecorder'
import Loader from '../../../../../global-components/layout/Loader';
import LoaderPolly from './create-module/polly/Loader';
import ToolTip from '../../../../../global-components/layout/ToolTip/ToolTip';
import Audio from '../../../../../global-components/layout/AudioPlayer/AudioPlayer';

export default class ModuleCreateModal extends React.Component {
    constructor (props) {
        super(props)

        this.defaultState = {
            inputVal: '',
            selectedWords: [],
            typeDownloadAudio: '',
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

            maxPhrases: 300,
            currentCountPhrases: 0,

            currentCountWords: 0,
            maxWords: 15,

            defaultSaveColor: 'default',
            defaultValInput: '-',
            triggerRendered: true
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
        this.triggerRendered = this.triggerRendered.bind(this)
        this.toggleModalSelectWord = this.toggleModalSelectWord.bind(this)
        this.switchTypeDownloadAudio = this.switchTypeDownloadAudio.bind(this)

        this.myForm = React.createRef()
    }

    switchTypeDownloadAudio (typeDownloadAudio) {
        this.setState(() => ({ typeDownloadAudio }))
        this.props.checkAudioDefaultType(typeDownloadAudio)
    }

    triggerRendered () {
        this.setState(() => ({ triggerRendered: false }))
        setTimeout(() => { this.setState(() => ({ triggerRendered: true })) }, 1500)
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
        let typeDownloadAudio = this.state.typeDownloadAudio
        // Добавляем фразу в курс
        $API.createWordInCourse(form, {
            currentAudioBlobWord: this.state.word.currentAudioBlob,
            currentAudioBlobPhrase: this.state.phrase.currentAudioBlob,
            typeDownloadAudio,
            pollyIsTMP: this.state.pollyData.isTMP,
            currentEditModule: window.currentEditModule,
            tmpWord: this.state.pollyData.tmpWord,
            tmpPhrase: this.state.pollyData.tmpPhrase,
            currentGlav: window.currentGlav,
            id: this.props.id,

            callback: data => {
                M.toast({ html: `Фраза успешно добавлена!`, classes: 'green' })
                this.props.triggerEvent({ id: this.props.id });
                window.modals['modal-modules-create'].$el.find('form input:not([name="word"]):not(.select-dropdown), form textarea').val('').attr('value', '');
                window.modals['modal-modules-create'].$el.find('input.invalid').removeClass('invalid');
                window.modals['modal-modules-create'].close();
                this.myForm.reset();

                this.setState( this.defaultState, () => {
                    this.switchTypeDownloadAudio(typeDownloadAudio)
                });

                this.triggerRendered()

                loadAllAudios()
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
        let data = (e.target) ? e.target.value : (typeof e == 'string') ? e : ''

        data = data.replace(/,|\.|\?|\!/g, x => {
            return ' ' + x + ' '
        })

        this.setState(() => ({
            inputVal: data,
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
    }

    getAudioInput () {
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
                const resultLangueges = voices[this.props.langueges];

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
            const lang = this.props.langueges
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
                let currentModal = self.modals['modal-modules-create']
                currentModal.options.onCloseEnd = () => {
                    let form = document.getElementById('creating-module-form-modal')

                    if(form)
                        form.reset()

                    this.setState(this.defaultState)
                }
                currentModal.options.onOpenEnd = () => {
                    this.setState(() => ({ defaultSaveColor: 'default' }))
                }
                clearInterval(findModals)
                return
            }
        }, 500)

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
        parseSelectingFunc({
            word,
            index,
            newSelWords: this.state.selectedWords,
            inputVal: this.state.inputVal,
            maxWords: this.state.maxWords
        }, data => {
            this.setState(prevState => ({
                selectedWords: [...prevState.selectedWords, ...data.selectedWords],
                inputVal: data.inputVal,
                currentCountWords: data.currentCountWords
            }))
        })
    }

    parseInputBlur () {
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

    toggleModalSelectWord (evt) {
        const selectWordBlock = document.querySelector('#modalSelectWordWrapper');
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

    componentWillReceiveProps (props) {
        // Данные из попапа "Лемматизация"
        if(props.data_to_load) {
            let pdtl = props.data_to_load

            if(pdtl.phrase) {
                this.inputPhrase( pdtl.phrase )
            }

            if(pdtl.indexWord >= 0 && pdtl.word) {
                this.setState(() => ({ selectedWords: [] }), () => {
                    const findIndex = pdtl.phrase.split(' ').indexOf(pdtl.word)

                    this.parseSelecting({ word: pdtl.word, index: findIndex })
                })
            }
        }

        if(props.AudioDefaultType) {
            this.switchTypeDownloadAudio(props.AudioDefaultType)
        }
    }

    render () {
        const selectedWords = this.getSelectedWords();
        const DFI = this.state.defaultValInput;
        const props = this.props

        // default values
        const _dfv = {
            phrase: (props.data_to_load) ? props.data_to_load.phrase : ''
        }

        const { typeDownloadAudio } = this.state

        if(!this.state.triggerRendered) return <Loader />

        return (
            <div className="modal-content">
                <form className="creating-module-form" id="creating-module-form-modal" ref={el => this.myForm = el} onSubmit={e => {
                    e.preventDefault();
                    this.onCreatePhrase(e.target)
                }}>
                    <div className="modal__row modal__row--start">
                        <div className="modal__row__left">
                            <div className="modal__tooltip mb-3">
                                <p>Название курса</p>
                            </div>
                            <h4>{props.name}</h4>
                        </div>
                        <div className="modal__row__right">
                            <div className="modal__tooltip mb-3">
                                <p>Название главы</p>
                            </div>
                            <h4>{props.currentGlav}</h4>
                        </div>
                    </div>
                    <hr className="fingman__divider"/>
                    <div className="modal__row modal__row--between">
                        <div className="modal__row__left modal__row--relative">
                            <div className="modal__tooltip">
                                <p>Введите фразу или предложение {this.getMax('phrase')}</p> <ToolTip info={'Введите фразу или предложение для разбиения'} icon={'help'} />
                            </div>
                            <textarea tabIndex='2' id="text_area_2" defaultValue={_dfv.phrase} maxLength={this.state.maxPhrases} onBlur={this.parseInputBlur} required onInput={this.inputPhrase} name="phrase_top" className="materialize-textarea"></textarea>
                            <div className="modal__clear">
                                <a href="" tabIndex="-1" onClick={e => {
                                    e.preventDefault();
                                    this.clearPhrases();
                                }} className=""><i className="material-icons">clear</i></a>
                                <input onBlur={this.parseInputBlur} type={'hidden'} name={'phrase'} value={this.state.inputVal} />
                            </div>
                        </div>
                        <div className="modal__row__right">
                            <div className="modal__tooltip">
                                <p>Перевод фразы</p> <ToolTip icon={'help'} info={'Заполните перевод фразы'} />
                            </div>
                            <Input val={DFI} onBlurring={this.parseInputBlur} name={'explanation'} isRequire label={''} />
                        </div>
                    </div>
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

                        <div id="modalSelectWordWrapper">
                            <TextSelecting
                                text={this.state.inputVal}
                                onRemoveWord={this.deleteSelectedWord}
                                onSelect={this.parseSelecting}
                                selectFromIndex={this.selectFromIndex}
                            />
                        </div>
                    </div>
                    <div className="modal__row modal__row--triple mt-4">
                        <div className="modal__col">
                            <div className="modal__tooltip">
                                <p>Выбранное слово</p>
                                <ToolTip info={'Выбранное слово'} icon={'help'} />
                            </div>
                            {(this.state.selectedWords.length) ? <div className="chips-words">{this.getChips(this.state.selectedWords)}</div> : ''}
                            <input type={'hidden'} name={'word'} value={selectedWords} />
                        </div>
                        <div className="modal__col">
                            <div className="modal__tooltip">
                                <p>Перевод слова</p>
                                <ToolTip info={'Перевод слова'} icon={'help'} />
                            </div>
                            <Input val={DFI} onBlurring={this.parseInputBlur} name={'explanation_second'} isRequire label={''} />
                        </div>
                        <div className="modal__col">
                            <div className="modal__tooltip">
                                <p>Морфология</p>
                                <ToolTip info={'Морфология'} icon={'help'} />
                            </div>
                            <Input val={DFI} onBlurring={this.parseInputBlur} name={'morph_priz'} label={''} />
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
                                name={'type_sound'}
                                val={typeDownloadAudio ? typeDownloadAudio : ''}
                                isRequire={false}
                                title={``}
                                onChange={(selectValue) => {
                                    this.parseInputBlur()

                                    this.switchTypeDownloadAudio(selectValue.trim())
                                }}
                            />
                        </div>
                        <div className="modal__row__middle">
                            {
                                (this.getValidTypeAudio()) ? this.getAudioInput() : ''
                            }
                        </div>
                    </div>
                    <hr className="fingman__divider"/>
                    <h4 className="mb-5">Заполните пояснения для изучаемого слова</h4>
                    <div className="modal__row modal__row--single">
                        <div className="modal__tooltip">
                            <p>Пояснение слова</p> <ToolTip icon={'help'} info={'Заполните пояснение слова'} />
                        </div>
                        <Input val={DFI} onBlurring={this.parseInputBlur} name={'explanation_word'} isRequire label={''} />
                    </div>
                    <div className="modal__row">
                        <div className="modal__tooltip">
                            <p>Этимология слова</p> <ToolTip icon={'help'} info={'Заполните этимологию слова'} />
                        </div>
                        <Input val={DFI} onBlurring={this.parseInputBlur} name={'etymology'} label={''} />
                    </div>
                    <div className="modal__row">
                        <div className="modal__row__left modal--association">
                            <div className="modal__tooltip">
                                <p>Текстовая ассоциация</p> <ToolTip icon={'help'} info={'Заполните текстовую ассоциацию'} />
                            </div>
                            <Input onBlurring={this.parseInputBlur} name={'association'} val={'-'}  isRequire label={''} />
                        </div>
                        <div className="modal__row__right">
                            <div className="modal__tooltip">
                                <p>Ассоциация - изображение</p> <ToolTip icon={'help'} info={'Выберите изображение для ассоциации'} />
                            </div>
                            <File name={'association_image'} type={'image'} title={'Загрузить ассоциацию'} />
                        </div>
                    </div>
                    <div className="modal__row">

                    </div>
                    <hr className="fingman__divider"/>
                    <div className="modal__row modal__row--end">
                        <Button submit title={'Сохранить'} color={this.state.defaultSaveColor} customClass={'modal--submit'} />
                    </div>
                </form>
            </div>
        )
    }
}



