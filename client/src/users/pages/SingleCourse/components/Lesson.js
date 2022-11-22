import React from 'react'

import SoundButton from '../../../../global-components/layout/Sound'
import NavigationItem from './Navigation'
import Anotation from './Anotation'
import LessonRandomTests from './LessonRandomTests/index'
import LessonIndicator from './Indicators'
import LessonWords from './LessonWords'
import LessonBlock from './LessonBlock'
import LessonTooltipInput from './LessonTooltipInput'
import AnotationTab from './anotations/AnotationTab'
import AnotationPhrase from './anotations/AnotationPhrase'

import { getFullPhraseLesson, randomNumbers, setRootContainerBackground, getUserId, getCurrentUserToken, getOne, getFullPhrase } from '../../../../functions'
import M from 'materialize-css'
import Axios from 'axios';
import API from '../../../../config/API';

import LessonFastWatch from '../components/LessonFastWatch';
import LessonTypeStudy from './LessonTypeStudy'
import LessonIndicatorModal from './LessonIndicatorModal'

import Modal from '../../../../global-components/layout/Modal'
import { LinkA } from '../../../../global-components/Elements'
import Promt from './promt/Promt'


const TOKEN = getCurrentUserToken();
export default class Lesson extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            indicator: (props.indicator) ? props.indicator : undefined,
            activeInputClass: '',
            sound_value: true,
            current_word_id: 0,

            play_start_audio: false,
            is_audio_playing: false,

            current_phrase_valid: false,
            tooltipActiveDefault: false,
            activateRandomTests: false,
        }

        this.currentWord = {
            word: '',
            index: 0
        }

        this.playSound = this.playSound.bind(this)
        this.inputWord = this.inputWord.bind(this)
        this.parseContent = this.parseContent.bind(this)
        this.checkInputValue = this.checkInputValue.bind(this)

        this.onInValidWord = this.onInValidWord.bind(this)
        this.onCheckValidationWord = this.onCheckValidationWord.bind(this)
        this.toggleInputWordClass = this.toggleInputWordClass.bind(this)
        this.updateValidWords = this.updateValidWords.bind(this)
        this.checkFirstInputOnValid = this.checkFirstInputOnValid.bind(this)
        this.changeSoundValue = this.changeSoundValue.bind(this)
        this.getFullPhraseCheck = this.getFullPhraseCheck.bind(this)
        this.toggleAudioPlaying = this.toggleAudioPlaying.bind(this)
    }

    changeSoundValue () {
        this.setState(prevState => ({
            sound_value: !prevState.sound_value
        }))
    }

    toggleAudioPlaying (onEnd) {
        this.setState(prevState => ({
            is_audio_playing: !prevState.is_audio_playing
        }), () => {
            if(onEnd && typeof onEnd == "function") onEnd()
        })
    }

    playSound (target, is_phrase = false, onEnd) {
        const audio = ((is_phrase || this.props.type_study === 3) &&
            (this.props.type_study !== 2 && this.props.type_study !== 1)
        ) ? this.props.audio_phrase : this.props.audio_word;

        if(this.state.sound_value) {
            if(!this.state.is_audio_playing) {
                this.toggleAudioPlaying(() => {
                    sound(audio, () => {
                        if(target) target.classList.remove('sound-button--active');
                        if(onEnd) onEnd()

                        this.toggleAudioPlaying()
                    })
                })
            }
        } else {
            setTimeout(() => {
                if(onEnd && typeof onEnd == "function") onEnd()
            }, 1300)
        }
    }

    onCheckValidationWord (inputData) {
        const _data = {
            word_id: this.props.id,
            course_id: this.props.course_id,
            user_id: getUserId()
        }

        if(TOKEN !== '' && _data.user_id !== 0 && _data.user_id !== undefined) {
            Axios.post(API.host + `/api/repeating/${_data.user_id}/${_data.course_id}/${_data.word_id}`, inputData, {
                headers: {
                    'Authorization': TOKEN
                }
            }).then(response => {
                const response_data = response.data;
                if(response_data.success) {
                    const currentResponseData = response_data.data;

                    this.setState(() => ({
                        indicator: currentResponseData.indicator
                    }))
                }
            })
        }
    }

    toggleInputWordClass (newClass) {
        this.setState(() => ({ activeInputClass: newClass }))

        setTimeout(() => {
            this.setState(() => ({ activeInputClass: '' }))
        }, 1000)
    }

    openTopMenu() {
        const topMenu = document.querySelector('.top_menu_open');
        const topMenuOverlay = document.querySelector('.top_menu_overlay');
        if(topMenu) {
            topMenu.classList.contains('top_menu_open_active') ? topMenu.classList.remove('top_menu_open_active') : topMenu.classList.add('top_menu_open_active');
            topMenuOverlay.classList.add('top_menu_overlay_open');
            topMenuOverlay.addEventListener('click', function(){
                topMenu.classList.remove('top_menu_open_active');
                topMenuOverlay.classList.remove('top_menu_overlay_open');
            })
        } else {
            return true;
        }
    }

    closeTopMenu() {
        const topMenu = document.querySelector('.top_menu_open');
        const topMenuOverlay = document.querySelector('.top_menu_overlay');

        if (topMenu.classList.contains('top_menu_open_active') || topMenuOverlay.classList.contains('top_menu_overlay_open')) {
            topMenu.classList.remove('top_menu_open_active');
            topMenuOverlay.classList.remove('top_menu_overlay_open');
        }
    }

    learnListHandler(e) {
        e.target.classList.toggle('transform180');
        const learnList = document.querySelector('.top_menu_open_learn_list');
        learnList.classList.toggle('d--none');
    }

    onValidWord () {
        this.props.onSuccessWord( this.props )
        this.onCheckValidationWord({ input_valid: 1 })
    }

    onInValidWord () {
        this.toggleInputWordClass('active')
        this.props.onFailWord( this.props )
        this.onCheckValidationWord({ input_invalid: 1 })
    }

    changeIndicator () {
        const { course_id, id } = this.props;
        const user_id = getUserId();

        if(user_id !== 0 && TOKEN !== '') {
            Axios.get(API.host + `/api/repeating/${user_id}/${course_id}/${id}`, {
                headers: {
                    'Authorization': TOKEN
                }
            }).then(response => {
                const data = response.data;
                if(data.success) {
                    const currentData = data.data;
                    this.setState(() => ({
                        indicator: currentData.indicator
                    }))
                }
            })
        }

        Object.values(document.querySelectorAll('.Tsds-english__lesson__hidden-word')).forEach((inp, i) => {
            inp.disabled = false
            inp.parentElement.querySelector('.Tsds-english__lesson__input-container__word').removeAttribute('style');

            if(i == 0) {
                this.firstInput = inp
                this.firstInput.focus()
            }
        })
    }

    componentDidMount () {
        this.changeIndicator();
    }

    inputWord ({ index, val, splittingIndex = 0, target = false }, isNextBtn = false) {
        const data = val;
        const wordIndex = index;
        const hidden_word_class = 'Tsds-english__lesson__hidden-word'

        let cc = this.currentContent;

        if(!self.firstEnterUpdate) {
            self.firstEnterUpdate = true
        }

        this.currentWord = {
            word: data,
            index: wordIndex
        }

        if(cc[wordIndex] !== null) {
            cc[wordIndex] = data;
        }

        /** Проверяем правильность ввода слова (№15072020) */
        let splittingWord = this.props.word.split(',');

        if(this.currentInputTarget) {
            splittingIndex = parseInt(this.currentInputTarget.dataset.splittingIndex)
        }

        let _$word = splittingWord[splittingIndex];
        let isWordHasValid = false

        if(_$word) {
            isWordHasValid = _$word.toUpperCase().trim() == data.toUpperCase().trim()

            if(isWordHasValid) {
                this.validWords[_$word.toUpperCase()] = true;
            } else {
                this.validWords[_$word.toUpperCase()] = false;
            }
        }

        // Чекер правильного вовда
        let checker = enterTarget => {
            
            if(!isNextBtn && enterTarget) {
                if(enterTarget.id) {
                    // проверяем является ли текущий элемент инпутом для ввода слова
                    if(enterTarget.id.match(/word_input/g) == null) return;
                } else return;
            }

            let playAudio = false;

            // Здесь был элемент №15072020

            // проверяем первый инпут на правильность
            let checkFirstInput = isValid => {
                this.firstInputValid = (splittingIndex == 0 && !isValid) ? false : true
            }
            
            // удаляем подсказку у инпута
            let removeWordHint = (inp) => {
                if(inp) {
                    inp.disabled = true
                    inp.parentElement.querySelector('.Tsds-english__lesson__input-container__word').style.display = "none";
                
                }
            }

            // получаем все инпуты слов
            let getAllInputsWord = () => {
                return Object.values( document.querySelectorAll(`.${hidden_word_class}`) )
            }

            // назначачем первый активный инпут
            let setFirstActiveInput = () => {
                let invalidIndexes = allInputs.map((item,i) => {
                    return {
                        hasValid: item,
                        index: i
                    }
                }).filter(item => item.hasValid == false)
                if(invalidIndexes.length) {
                    let newInput = document.querySelector(`.${hidden_word_class}[data-splitting-index="${invalidIndexes[0].index}"]`)
                    if(newInput) {
                        checkFirstInput(true)
                        this.firstInput = newInput
                        this.checkFirstInputOnValid()
                        newInput.focus()
                    }
                }
            }

            let doWithInput = cb => {
                getAllInputsWord().forEach(cb)
            }

            let allInputsDisabled = () => {
                doWithInput(item => {
                    item.disabled = true;
                })
            }
            // устанавливаем всем инпутам DISABLED на 1 сек.
            let allInputsDisabledOnTime = () => {
                allInputsDisabled()

                setTimeout(() => {
                    doWithInput(item => {
                        if(item)
                            item.disabled = false;
                    })
                    setFirstActiveInput()
                }, 1000)
            }

            let setColorInput = (input, color) => {
                input.style.color = color
            }
     

            let allInputsObject = {}
            let allInputs = Object.values(document.querySelectorAll(`.${hidden_word_class}`)).map((item, i) => {
                const validData = (this.validWords[item.value.toUpperCase()] !== undefined) ? true : false;
                if(validData) {
                    removeWordHint(item)
                    setColorInput(item, "#26a69a")
                }else{
                    item.nextSibling.nextSibling && (item.nextSibling.nextSibling.style.display='block')
                }
                    
                
                

                const dataKey = Object.keys(this.validWords)[i]
                
                allInputsObject[dataKey] = validData
                return allInputsObject[dataKey]
            })

            let allWordsHasValid = Object.values(allInputsObject).filter(item => {
                
                return item === true
            }).length === allInputs.length;

            // если одно слово не верное или все слова не верные
            if((!isWordHasValid && !allWordsHasValid) && !this.state.current_phrase_valid) {
                playAudio = true;
                setRootContainerBackground('#ff0a0a2e');
                allInputsDisabledOnTime()
                
                checkFirstInput (false)
                window.invalid_word_counter += 1
                
            } else {
                setFirstActiveInput()
                let currentInput = document.querySelector(`.${hidden_word_class}[data-splitting-index="${splittingIndex}"]`)
                removeWordHint(currentInput)
                setColorInput(currentInput, "#26a69a")
                // если все слова верные
                if(allWordsHasValid || (this.props.type_study === 3 && this.state.current_phrase_valid)) {
                    let isEnd = false;

                    if(this.props.countLessons == this.props.currentLesson+1) {
                        playAudio = false;
                        isEnd = true;
                    }

                    if(!isEnd) {
                        playAudio = false;
                    }

                    doWithInput (item => {
                        setColorInput(item, "#26a69a")
                    })

                    this.onValidWord()
                    this.changeIndicator()

                    this.playSound(null, true, () => {
                        this.props.onChangeLesson(1, 'next', isEnd);

                        doWithInput (item => {
                            item.style.color = "";
                            item.disabled = false
                            item.value = '';
                        })
                        this.updateValidWords()
                        self.triggersEnter = null
                        self.firstEnterUpdate = false
                    });
                    setRootContainerBackground('#6cc15654');
                } else {
                    setRootContainerBackground('#ff0a0a2e');
                    playAudio = true;
                }

                this.setState(() => ({ current_phrase_valid: false }))
            }

            if(playAudio) {
                if(data.length !== 0) {
                    this.onInValidWord()
                }

                this.toggleInputWordClass('active')

                this.playSound()
            }
        }

        // если мы нажали на стрелочку справа
        if(isNextBtn || isWordHasValid) checker()
        // при клике на enter провярем правильнсть ввода
        self.triggersEnter = enterTarget => {
            checker(enterTarget);
        }
    }

    checkInputValue ({ target }) {
        const value = target.value;
        const splittingIndex = parseInt(target.dataset.splittingIndex);
        const splittingWord = this.props.word.split(',');
        const $word = splittingWord[splittingIndex];
        const cIndex = (value.length-1 < 0) ? 0 : value.length-1
        
        // Если первая буква заглавная, то назначени инпуту заглавную букву
        if($word[cIndex] !== undefined) {
           const iw = $word[cIndex];
           if(iw.match(/[A-ZА-Я]/g) !== null) {
               target.value = value.toUpperCase()
           }
        }

        if(value.length > $word.length) {
            target.value = value.substr(0, value.length - 1)
        }
    }

    componentWillReceiveProps (props) {
        if(props.id !== this.state.current_word_id) {
            this.setState(() => ({ current_word_id: props.id, play_start_audio: true }))
        }
    }

    getFullPhraseCheck () {
        let { word, phrase } = this.props

        if(getFullPhrase) {
            const fullPhrase = getFullPhrase(word, phrase)
            return fullPhrase
        }

        return ''
    }

    // парсим контент
    parseContent () {
        const { phrase, type_study } = this.props
        let { activeInputClass } = this.state
        
        let newContent = phrase
        let findInputs = newContent.split(' ')
        let _data = []

        let inputContainerId = 'input_container_id_' + randomNumbers(15)
        let wordInputId = 'word_input' + randomNumbers(10)

        this.currentContent = findInputs
        // общий индекс слова которое скрыто
        let indexWord = 0

        // Если тип обучения = 3 (слышим и видим только фразу)
        if(type_study === 3) {
            const full_phrase = this.getFullPhraseCheck()

            inputContainerId = 'input_container_id_' + randomNumbers(15);
            wordInputId = 'word_input' + randomNumbers(10);

            _data.push(<span key={0} id={inputContainerId} className="Tsds-english__lesson__input-container Tsds-english__lesson__input-container--fullwidth">
                <span className={`Tsds-english__lesson__input-container__word ${activeInputClass}`}>{full_phrase}</span>
                <textarea
                    className="Tsds-english__lesson__hidden-word Tsds-english__lesson__phrase-input"
                    onInput={e => {
                        let val = e.target.value.trim()
                        let is_phrase_valid = val.toUpperCase() == full_phrase.toUpperCase()

                        // делаем маленькие буквы
                        this.currentInputTarget = e.target;
                        // отображаем слово в общем массиве фразы

                        if(is_phrase_valid) {
                            this.setState(() => ({
                                current_phrase_valid: true
                            }), () => {
                                this.inputWord({
                                    val,
                                    index: 0,
                                    target: e.target
                                }, true)
                            })
                        }
                    }}
                    data-splitting-index={indexWord}
                    data-index-word={0}
                    id={wordInputId}
                    placeholder={'Введите фразу...'}
                    ref={el => {
                        if(!this.firstInput) this.firstInput = el
                    }}
                    minLength={1}
                    autoComplete={'off'}
                    autoCorrect={'off'}
                    autoCapitalize={'off'}
                    spellCheck={false}
                />

                
                {/* <p>Подсказка: {this.getFullPhrase()}</p> */}

                {/* <div>
                    <p className="prompt open">Подсказка: {this.getFullPhrase()}</p>
                    <div className="Tsds-english__lesson__anotation__controls">
                        <a 
                            className="Tsds-english__anotation__toggle"
                            onClick={(evt) => {
                                evt.preventDefault();
                                toggleAnotation(evt);
                            }}
                        >
                            <img data-img='hamburger' src="/img/icons/icon_anotation_hamburger.svg" alt=""/>
                        </a>
                    </div>
                </div> */}
                <Promt word={this.props.word} phrase={this.props.phrase} isOpen={false} getFullPhraseCheck={this.getFullPhraseCheck}/>
            </span>)

            return _data
        }

        // Если тип обучения не равен 3 (по умолчанию)
        findInputs.forEach(
            (data,i) => {
                let word = <span className="Tsds-english__lesson__word-container" id={`word_${randomNumbers(10)}`} key={i}>{data}</span>

                if(type_study === 1 || type_study === 2) {
                    word = ''
                }

                let wordSplitting = this.props.word.split(',');

                // если слово скрыто
                let is_data_checking = data.indexOf('{*}') > -1

                if(is_data_checking) {
                    let currentWordSplitting = wordSplitting[indexWord]; // получаем слово из общего объекта слов

                    let w = document.createElement('span');
                    w.id = "test_word" + randomNumbers(15);
                    w.className = "Tsds-english__lesson__input-container__word";
                    w.style = "display:inline-block;font-size:30px;position: static;width:auto;";
                    w.innerHTML = currentWordSplitting;

                    document.body.append(w)

                    let wordWidth = (w.getBoundingClientRect().width);
                    w.remove()

                    inputContainerId = 'input_container_id_' + randomNumbers(15);
                    wordInputId = 'word_input' + randomNumbers(10);
                    word = <span key={i} id={inputContainerId} className="Tsds-english__lesson__input-container">
                        <LessonTooltipInput
                            word={currentWordSplitting}
                            parentId={inputContainerId}
                            wInputId={wordInputId}
                            tooltipActive={this.state.tooltipActiveDefault}
                            onClickTooltip={tooltipStatus => 
                            this.setState(() => ({
                                
                                tooltipActiveDefault: tooltipStatus
                            }))}
                            wordData={{
                                index: i,
                                requiredDatas: ['target', 'val'],
                                triggerWord: this.inputWord
                            }}
                        />
                        
                        <span className={`Tsds-english__lesson__input-container__word ${activeInputClass}`}>{currentWordSplitting}</span>
                        <input
                            ref={el => {
                                if(!this.firstInput) this.firstInput = el
                            }}
                            autoComplete={'off'}
                            autoCorrect={'off'}
                            autoCapitalize={'off'}
                            spellCheck={false}
                            autoFocus={true}
                            id={wordInputId}
                            data-splitting-index={indexWord}
                            data-index-word={i}
                            minLength={1}
                            tabIndex={-1}
                            style={{ width: ""+wordWidth+"px", position:'absolute', zIndex:2}}
                            onInput={
                                this.checkInputValue
                            }
                            onKeyUp={e => {
                                // делаем маленькие буквы
                                this.currentInputTarget = e.target;
                                // отображаем слово в общем массиве фразы
                                this.inputWord({
                                    val: e.target.value,
                                    index: i,
                                    target: e.target
                                })
                            }}
                            className="Tsds-english__lesson__hidden-word Tsds-english__lesson__hidden-word__background-transparent"
                            type="text"
                        />
                        <input
                            readOnly
                            // placeholder={currentWordSplitting}
                            style={{ width: ""+wordWidth+"px"}}
                            className="Tsds-english__lesson__hidden-word__background "
                            type="text"
                        />
                        <input
                            readOnly
                            placeholder={currentWordSplitting}
                            style={{ width: ""+wordWidth+"px", position:'absolute',zIndex:1, top:0, left:0, display:'none'}}
                            className="Tsds-english__lesson__hidden-word__background Tsds-english__lesson__hidden-word__background-transparent"
                            type="text"
                        />
                        
                     </span>

                    indexWord++
                }

                _data.push(word);
            }
        );

        return _data;
    }

    checkFirstInputOnValid () {
        if(this.firstInput && !this.firstInputValid) {
            this.firstInput.focus()
        }
    }

    // Отображаем анотации сверху
    switchTopAnotations(study) {
        switch(study) {
            case 1:
                return '';
            case 2:
                return '';
            case 3:
                return '';
            default:
                return <Anotation type={'top'} description={this.props.explanation} explanationSecond={this.props.explanation_second} typeExplanation={'tooltip'} typeWord={'word'} morphPriz={this.props.morph_priz} textWord={this.props.explanation_word}/>
        }
    }

    // обновляем объект слов
    updateValidWords () {
        this.props.word.split(',').forEach(item => {
            this.validWords[item.toUpperCase()] = false;
        })
    }

    componentDidMount () {
        self.triggersEnter = null
        self.firstEnterUpdate = false
        // делаем полную очистку
        this.forceUpdate()
        // инициализируем модалки
        M.Modal.init( document.querySelectorAll('.modal') )
        // обнуляем объект слов
        this.validWords = {};
        // обновляем объект слов
        this.updateValidWords();
        // ставим что первый инпут не валидный (не верный)
        this.firstInputValid = false;
        // проверяем первый инпут на правильность ввода
        this.checkFirstInputOnValid()
    }

    componentDidUpdate () {
        this.updateValidWords();
        this.checkFirstInputOnValid()
        M.Modal.init( document.querySelectorAll('.modal') )

        // Если тип обучения == 2 и слово является новым, то воспроизводим его
        if((this.props.type_study === 2 || this.props.type_study === 3) && this.state.play_start_audio) {
            const cls_sound = (this.props.type_study === 3) ? '.Tsds-english__lesson__phrase-sound' : '.Tsds-english__lesson__sound'

            this.setState(() => ({ play_start_audio: false }), () => {
                this.playSound( $(cls_sound)[0] )
            })
        }

        /*Правки верстки в зависимости от стадии обучения*/
        // const study = this.props.type_study;

        // if (study === 1) {
        //     const lessonWordsContainer = document.querySelector(`.Tsds-english__lesson__words`);
        //     const lessonWordsInput = lessonWordsContainer.querySelector(`.Tsds-english__lesson__input-container`);
        //     const studyHeading = document.createElement(`div`);

        //     studyHeading.classList.add(`Tsds-english_study_heading`);
        //     lessonWordsContainer.classList.add(`justify-content-center`);
        //     lessonWordsContainer.classList.add(`flex-wrap`);
        //     studyHeading.insertAdjacentHTML(`afterbegin`, `<h3>Перевод слова</h3>`);
        //     lessonWordsInput.classList.add(`input--flex-center`);
        //     lessonWordsInput.insertAdjacentElement(`beforeBegin`, studyHeading);
        // } else {
        //     const lessonWordsContainer = document.querySelector(`.Tsds-english__lesson__words`);
        //     const lessonWordsInput = lessonWordsContainer.querySelector(`.Tsds-english__lesson__input-container`);
        //     lessonWordsContainer.classList.remove(`justify-content-center`);
        //     lessonWordsContainer.classList.remove(`flex-wrap`);
        //     lessonWordsInput.classList.remove(`input--flex-center`);
        //     const studyHeading = document.querySelector(`.Tsds-english_study_heading`);
        //     if (studyHeading) {
        //         studyHeading.remove();
        //     }

        // }
    }

    render () {
        const {
            explanation, explanation_second,
            morph_priz, onChangeLesson, audio_word, explanation_word, words,

            // Типы обучения (для компонентна)
            onUpdateTypeStudy, type_studies, active_type_study, currentHead
        } = this.props

        const { indicator, activateRandomTests } = this.state

        const parsingContent = this.parseContent()
    
        return (
            <React.Fragment>
                {
                    !activateRandomTests ?
                        this.switchTopAnotations(this.props.type_study)
                    :
                        ``
                }

                {activateRandomTests 
                ? 
                    <LessonRandomTests checkRandomTest={this.props.checkRandomTest} words={words} />
                : <>
                    <LessonBlock>
                        <NavigationItem onChange={type => {
                            this.changeIndicator()
                            
                            onChangeLesson(-1, type);
                        }} type={'prev'} />
                        <NavigationItem onChange={type => {
                            if(this.currentWord) {
                                const currWord = this.currentWord;
                                this.inputWord({ index: currWord.index, val: currWord.word }, true)
                            } else {
                                
                                if(!this.state.is_audio_playing) {
                                    this.toggleAudioPlaying(() => {
                                        sound(audio_word, () => {
                                            this.toggleAudioPlaying()
                                        })
                                    })
                                }
                            }
                        }} type={'next'} />

                        <LessonWords textTranslateWord={explanation_second} playSound={this.playSound} studyType={this.props.type_study}>
                            {
                                parsingContent.map(
                                    (data, i) => {
                                        return data;
                                    }
                                )
                            }
                        </LessonWords>
                    </LessonBlock>
                    <Anotation isOpen={true} type={'bottom'} DataHTML={{
                        component: AnotationTab,
                        data: this.props
                    }} description={explanation_second} />
                </>}

                <div className="right_desctop_menu">
                    <div className="right_trigger_arrea">
                        <div className="top_panel_icon setting_button" onClick={this.openTopMenu}>
                            <i className="fas fa-bars"></i>
                        </div>
                    </div>

                    <div className="fastwatch__container">
                        <div className="fastwatch__buttons">
                        {(indicator !== undefined) ?
                            <LessonIndicator
                                customClass={'modal-trigger'}
                                triggerModal={'modal-indicators'}
                                type={indicator.class}
                                text={indicator.text}
                            />
                            :
                            <LessonIndicator
                                customClass={'modal-trigger'}
                                triggerModal={'modal-indicators'}
                                type={`new`}
                                text={`Начните изучать слово`}
                            />
                        }

                        {this.state.sound_value ?
                            <div className="sound_buttons_wrapper">
                                <SoundButton customClass={'Tsds-english__lesson__sound'} onChange={this.playSound} />

                                <SoundButton customClass={'Tsds-english__lesson__phrase-sound'} onChange={target => {
                                    this.playSound(target, true)
                                }} />
                            </div>
                        : ''}
                        </div>
                    </div>
                </div>
                <div className="top_menu_open">
                    <div className="fingman_wrapper">
                        <ul className="top_menu_open_list">
                            <li>
                                <div className="fastwatch__container">
                                    <div className="fastwatch__block">
                                        <div className="lesson-fastwatch hidden">
                                            <div className="container">
                                                <h3>Режим быстрого просмотра</h3>
                                                <div className="row">
                                                    <form action="" className="col m6 s12">
                                                        <p className="">
                                                            <label><input type="checkbox" checked="" />
                                                                <span>Показывать перевод</span></label>
                                                        </p>
                                                        <p className="range-field "><span>Скорость переключения (1.2 cек.)</span>
                                                            <input type="range" min="200" max="2000" value="1200" />
                                                        </p>
                                                        <div className="lesson-fastwatch__range">
                                                            Диапазон доступных слов (0 - 16)
                                                            <div id="fast-watch-diapazon"
                                                                 className="noUi-target noUi-ltr noUi-horizontal noUi-txt-dir-ltr">
                                                                <div className="noUi-base">
                                                                    <div className="noUi-connects">
                                                                        <div className="noUi-connect"
                                                                             style={{transform: 'translate(0%, 0px) scale(1, 1)'}}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="noUi-origin"
                                                                         style={{transform: 'translate(-1000%, 0px)', zIndex: 5}}>
                                                                        <div className="noUi-handle noUi-handle-lower"
                                                                             data-handle="0" tabIndex="0" role="slider"
                                                                             aria-orientation="horizontal"
                                                                             aria-valuemin="0.0" aria-valuemax="16.0"
                                                                             aria-valuenow="0.0" aria-valuetext="0.00">
                                                                            <div className="noUi-touch-area"></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="noUi-origin"
                                                                         style={{transform: 'translate(0%, 0px)', zIndex: 4}}>
                                                                        <div className="noUi-handle noUi-handle-upper"
                                                                             data-handle="1" tabIndex="0" role="slider"
                                                                             aria-orientation="horizontal"
                                                                             aria-valuemin="0.0" aria-valuemax="16.0"
                                                                             aria-valuenow="16.0"
                                                                             aria-valuetext="16.00">
                                                                            <div className="noUi-touch-area"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p>
                                                            <button type="button" data-target=""
                                                                    className=" waves-effect shadow--none waves-light  btn #7986cb indigo lighten-2">Скрыть
                                                                настройки
                                                            </button>
                                                        </p>
                                                    </form>
                                                </div>
                                                <div className="row lesson-fastwatch__slider">
                                                    <p className="lesson-fastwatch__word">Ttl</p>
                                                    <i className="">ц</i>
                                                </div>
                                                <div className="lesson-fastwatch__close"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fastwatch__buttons fastwatch__buttons__mob">
                                        <div className="sound_buttons_wrapper">
                                            {(indicator !== undefined) ?
                                                <LessonIndicator
                                                    customClass={'modal-trigger'}
                                                    triggerModal={'modal-indicators'}
                                                    type={indicator.class}
                                                    text={indicator.text}
                                                />
                                                : ''
                                            }

                                            <SoundButton customClass={'Tsds-english__lesson__sound'} onChange={this.playSound} />

                                            <SoundButton customClass={'Tsds-english__lesson__phrase-sound'} onChange={target => {
                                                this.playSound(target, true)
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <div className="list_group_label"></div>
                            <li className="top_menu_open_sound">Звук {this.state.sound_value ? 'Включен' : 'Выключен'}
                                <div className="top_menu_open_sound_checkbox">
                                    <input type="checkbox" id="sound_check" defaultChecked={true} onChange={this.changeSoundValue} />
                                    <label htmlFor="sound_check"></label>
                                </div>
                            </li>
                            <li onClick={this.closeTopMenu}>
                                <a href="" onClick={e => { e.preventDefault(); this.setState(prevState => ({
                                    tooltipActiveDefault: !prevState.tooltipActiveDefault
                                })) }}>Подсказка рандомные буквы {this.state.tooltipActiveDefault ? '+' : '-'}</a>
                            </li>
                            <li onClick={this.closeTopMenu}>
                                <a href={"#modal-heads"} className="modal-trigger">Выбрать главу {currentHead && <i>{currentHead.name}</i>}</a>
                            </li>
                            <li className="top_menu_open_learn">
                                <a href="#modal-type-study" className="modal-trigger">Выбрать тип обучения</a>
                                <span onClick={this.learnListHandler}>
                                    <i className="fa fa-chevron-down"></i>
                                </span>
                                <ul className="top_menu_open_learn_list d--none">
                                    <LessonTypeStudy
                                        onUpdateTypeStudy={propsTypeStudy => {
                                            this.setState(() => ({ activateRandomTests: false }))
                                            onUpdateTypeStudy(propsTypeStudy)
                                        }}
                                        type_studies={type_studies}
                                        active_type_study={active_type_study}
                                    />
                                </ul>
                            </li>
                            <div className="list_group_label"></div>
                            <li onClick={this.closeTopMenu}>
                                <a href="#modal-book-reader" className="modal-trigger">Читать книгу</a>
                            </li>
                            <li>
                                <LessonFastWatch id={this.props.course_id} />
                            </li>
                            <li onClick={() => self._openChat()}>
                                <a href="#">Чат</a>
                            </li>
                            <div className="list_group_label"></div>
                            <li onClick={this.closeTopMenu}>
                                <a href="#modal-tests" className="modal-trigger">Тест</a>
                            </li>
                            <li>
                                <LinkA onClick={() => {
                                    this.closeTopMenu()
                                    this.setState(prevState => ({ activateRandomTests: !prevState.activateRandomTests }))
                                }}>Рандомные тесты</LinkA>
                            </li>
                            <li className="disabled">
                                <a href="#" className="modal-trigger" title={"В разработке"} onClick={(e) => {e.preventDefault()}}>Вопросы</a>
                            </li>
                        </ul>
                        <div className="top_menu_close" onClick={this.closeTopMenu}>
                            <img src="/img/icons/down_icon.svg" />
                        </div>
                    </div>
                </div>
                <div className="top_menu_overlay"></div>

                <Modal modalClass={'indicators'} content={LessonIndicatorModal} data={{ lessonObject: {...this.props}, indicator }} />
            </React.Fragment>
        )
    }
}
