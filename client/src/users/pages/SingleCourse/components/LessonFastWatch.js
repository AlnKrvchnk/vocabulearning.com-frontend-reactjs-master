import React from 'react'

import Button from '../../../../global-components/layout/Button'
import Axios from 'axios';
import API from '../../../../config/API';
import { getCurrentUserToken } from '../../../../functions'
import noUiSlider from 'nouislider'
// import {} from '../../../../../node_modules/nouislider/distribute/nouislider.min.css'

export default class LessonFastWatch extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            isModalOpen: false,
            showTranslate: true,
            defaultSpeed: 1200,
            defaultTimeout: 500,

            activeWordIndex: 0,
            translateBlockClass: '',
            sliderInterval: null,
            sliderTimeoutFunction: null,
            words: [],
            defaultDiapazone: null,

            settings: {
                btnTitle: 'Скрыть настройки',
                hiddenClass: 'hidden'
            }
        }

        this.checkModalSettings = this.checkModalSettings.bind(this)
        this.destroyModal = this.destroyModal.bind(this)
        this.getActiveWord = this.getActiveWord.bind(this)
        this.destroySlider = this.destroySlider.bind(this)
        this.getSettings = this.getSettings.bind(this)
    }

    componentDidMount () {
        const TOKEN = getCurrentUserToken();

        if(TOKEN && window.userData) {
            Axios.get(API.host + '/api/user/statistic', {
                headers: {
                    'Authorization': TOKEN
                }
            }).then(response => {
                let currentCourse = response.data.data[this.props.id]
                let words = currentCourse.words;

                let validWords = words.filter(word => {
                    return (word.word.repeat_invalid > 0 || word.word.repeat_valid > 0)
                });
                validWords = validWords.map(item => {
                    return {
                        word: item.word.word,
                        translate: item.word.explanation_word
                    }
                })
                
                if(validWords.length > 0) {
                    let slider = document.getElementById('fast-watch-diapazon');
                    let diap = {
                        'min': 0,
                        'max': validWords.length-1
                    }
                    noUiSlider.create(slider, {
                        start: [0, 100],
                        connect: true,
                        step: 1,
                        orientation: 'horizontal', // 'horizontal' or 'vertical'
                        range: diap
                    });

                    slider.noUiSlider.on('change', data => {
                        let min = parseInt(data[0]),
                            max = parseInt(data[1]);

                        this.setState(() => ({ words: validWords }))

                        let wordsOnFilter = this.state.words;
                        let wordsFiltering = [];

                        for(let i = min; i <= max; i++) {
                            wordsFiltering.push(wordsOnFilter[i])
                        }

                        let activeIndex = this.state.activeWordIndex;
                        if(wordsFiltering.length <= 0) {
                            wordsFiltering = wordsOnFilter
                        } else {
                            activeIndex = 0;
                            this.state.activeWordIndex = activeIndex;
                        }

                        this.setState(() => ({
                            defaultDiapazone: {
                                'min': min,
                                'max': max
                            },
                            words: wordsFiltering,
                            activeWordIndex: activeIndex
                        }))
                    })

                    this.setState(() => ({
                        words: validWords,
                        defaultDiapazone: diap
                    }))  
                }
            })
        }

        document.addEventListener('keyup', e => {
            if(e.keyCode == 27) 
                this.destroyModal('CLOSE')
                this.destroySlider('STOP')
        })
    }

    destroySlider (value) {
        if(this.state.sliderInterval !== null) {
            clearInterval(this.state.sliderInterval)
        }

        switch(value) {
            case 'STOP':
                this.setState(() => ({
                    sliderInterval: null,
                    sliderTimeoutFunction: null
                }))
            break;
            case 'START':
                let currentInterval = setInterval(() => {
                    this.setState(() => ({ translateBlockClass: 'hidden', sliderTimeoutFunction: null }))

                    if(this.state.activeWordIndex == this.state.words.length-1) {
                        this.state.activeWordIndex = 0
                    } else {
                        this.state.activeWordIndex++
                    }

                    this.setState({
                        activeWordIndex: this.state.activeWordIndex
                    })

                    let dTimeout = setTimeout(() => {  
                        this.setState(() => ({
                            translateBlockClass: ''
                        }))
                    }, this.state.defaultTimeout)

                    this.setState(() => ({
                        sliderTimeoutFunction: dTimeout
                    }))
                }, this.state.defaultSpeed)
                
                this.setState(() => ({
                    sliderInterval: currentInterval
                }))
            break;
        }
    }

    destroyModal (value) {
        switch(value) {
            case 'CLOSE':
                this.setState(() => ({
                    isModalOpen: false
                }))
            break;
            case 'OPEN':
                this.setState(() => ({
                    isModalOpen: true
                }))
            break;
        }
    }

    checkModalSettings () {
        if(this.state.isModalOpen) {
            return '';
        } 

        return 'hidden';
    }
    
    getActiveWord () {
        const currentWord = this.state.words[this.state.activeWordIndex]

        return (
            <React.Fragment>
                <p className="lesson-fastwatch__word">{currentWord.word}</p>
                {
                    (this.state.showTranslate) &&
                    <i className={this.state.translateBlockClass}>{currentWord.translate}</i> 
                }
            </React.Fragment>
        )
    }
    handleTypeStudiesClick() {
        const topMenu = document.querySelector('.top_menu_open')
        const topMenuOverlay = document.querySelector('.top_menu_overlay_open')
        topMenu.classList.contains('top_menu_open_active') ? topMenu.classList.remove('top_menu_open_active') : null
        topMenuOverlay.classList.contains('top_menu_overlay_open') ? topMenuOverlay.classList.remove('top_menu_overlay_open') : null
    }
    getSettings () {
        return (
            <React.Fragment>
                <p className={this.state.settings.hiddenClass}>
                    <label>
                        <input defaultChecked={this.state.showTranslate} type="checkbox" onChange={e => {
                            this.setState(prevState => ({
                                showTranslate: !prevState.showTranslate
                            }))
                            this.destroySlider('START');
                        }} />
                        <span>Показывать перевод</span>
                    </label>
                </p>
                <p className={`range-field ${this.state.settings.hiddenClass}`}>
                    <span>Скорость переключения ({this.state.defaultSpeed / 1000} сек.)</span>
                    <input type="range" onChange={e => {
                        let df = e.currentTarget.value
                        this.setState(() => ({
                            defaultSpeed: +df
                        }))
                        this.destroySlider('START');
                    }} defaultValue={this.state.defaultSpeed} min="200" max="2000" />
                </p>
                <div className={`lesson-fastwatch__range ${this.state.settings.hiddenClass}`}>
                    Диапазон доступных слов ({this.state.defaultDiapazone ? this.state.defaultDiapazone['min'] + ' - ' + this.state.defaultDiapazone['max'] : ''})
                    <div id="fast-watch-diapazon"></div>
                </div>
            </React.Fragment>
        )
    }
    

    render () {
        return (
            <React.Fragment>
                <div className={'lesson-fastwatch ' + this.checkModalSettings()}>
                    <div className="container">
                        <h3>Режим ускорителя</h3>
                        <div className="row">
                            <form action="" className="col m6 s12">
                                {this.getSettings()}
                                <p>
                                    <Button title={this.state.settings.btnTitle} onChange={() => {
                                        if(this.state.settings.hiddenClass != '') {
                                            this.setState(() => ({
                                                settings: {
                                                    hiddenClass: '',
                                                    btnTitle: 'Скрыть настройки'
                                                }
                                            }))
                                        } else {
                                            this.setState(() => ({
                                                settings: {
                                                    hiddenClass: 'hide',
                                                    btnTitle: 'Показать настройки'
                                                }
                                            }))
                                        }
                                    }} />
                                </p>
                            </form>
                        </div>
                        <div className="row lesson-fastwatch__slider">
                            {
                                (this.state.words.length > 0) ? this.getActiveWord() :
                                <p>Вы первый раз на курсе. Слов для запоминания нет</p>
                            }
                        </div>
                        <div className="lesson-fastwatch__close" onClick={() => { 
                            this.destroyModal('CLOSE');
                            this.destroySlider('STOP');
                        }}></div>
                    </div>
                </div>
                
                <li className="lesson-fastwatch__btn"><a href="#" onClick={e => {
                    e.preventDefault()
                    
                    this.destroySlider('START')
                    this.destroyModal('OPEN')
                }}>Ускоритель</a></li>
            </React.Fragment>
        )
    }
}