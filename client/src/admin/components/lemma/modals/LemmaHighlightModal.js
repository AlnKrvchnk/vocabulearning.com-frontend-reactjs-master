import React from 'react'

import styles from './LemmaHighLightModal.less'
import { getFullPhraseLesson } from '../../../../functions'

import LessonIndicator from '../../../../users/pages/SingleCourse/components/LessonIndicator'

class LemmaHighLightModal extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            activeTabIndex: 0,
            tabs: [
                {name: 'Пояснение', $key: 'explanation_second', activeClass: 'active'},
                {name: 'Этимология', $key: 'etymology', activeClass: ''},
                {name: 'Ассоциация', $key: 'association', activeClass: ''},
                {name: 'Личная ассоциация', $key: 'custom_user_anotation', activeClass: ''}
            ]
        }
    }
    
    audioHandler(e) {
        e.preventDefault();
        let button = e.target;
        let href_sound = button.href

        button.classList.toggle('audio--active');

        if(self.sound && href_sound) {
            sound(href_sound, () => {
                button.classList.toggle('audio--active');
            })
        }
    }

    render() {
        const { current_word_data = {} } = this.props

        if(Object.keys(current_word_data).length == 0) return ''

        const {
            word, etymology, phrase, morph_priz, custom_user_anotation,
            explanation_second, association, explanation, audio_word, audio_phrase, indicator
        } = current_word_data

        let tabs = this.state.tabs

        const full_phrase = getFullPhraseLesson(word, phrase)
        
        return (
            <div className="HighLightModal" id="HighLightModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="container"> 
                    <div className="row">
                        <div className="col-md-12">
                            <div className="HighLightModal__content">
                            <div className="HighLightModal__content__item">
                                {/* Перевод слова */}
                                <div className="HighLightModal__content__block modal__font--2 color--disabled">{explanation}</div>
                                {/* Морфологические признаки */}
                                <div className="HighLightModal__content__block modal__font--1">{morph_priz}</div>
                                <div className="HighLightModal__content__block">
                                    {indicator !== undefined ? <LessonIndicator 
                                        customClass={'HighLightModal__grade'}
                                        triggerModal={''}
                                        type={indicator.class}
                                        text={indicator.text}
                                    /> : ''}
                                </div>
                            </div>
                            <div className="HighLightModal__content__item">
                                {audio_word ? <div className="HighLightModal__content__block">
                                    <a className="btn" href={audio_word} onClick={this.audioHandler}>
                                        <i className="material-icons">volume_up</i> слово
                                    </a>
                                </div> : ''}
                                
                                {audio_phrase ? <div className="HighLightModal__content__block">
                                    <a className="btn" href={audio_phrase} onClick={this.audioHandler}>
                                        <i className="material-icons">volume_up</i> фраза
                                    </a>
                                </div> : ''}
                            </div>
                            <div className="HighLightModal__content__item">
                                <div className="HighLightModal__content__block">
                                    <div className="card">
                                        <div className="card-header">
                                            <ul className="nav nav-tabs active-thik nav-primary border-0" role="tablist">
                                                {this.state.tabs.map((item, i) => {
                                                    return <li className="nav-item" key={i}>
                                                        <a className={`nav-link px-4 py-3 rounded-0 ${item.activeClass}`} href="" onClick={e => {
                                                            e.preventDefault()
                                                            tabs[this.state.activeTabIndex].activeClass = '';
                                                            tabs[i].activeClass = 'active';
                                                            
                                                            this.setState(() => ({
                                                                activeTabIndex: i,
                                                                tabs
                                                            }))
                                                        }}>{item.name}</a>
                                                    </li>
                                                })}
                                            </ul>
                                        </div>
                                        <div className="card-body">
                                            <div className="tab-content">
                                                <p>{current_word_data[tabs[this.state.activeTabIndex].$key]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="HighLightModal__content__item">
                                <div className="HighLightModal__content__block">
                                    <p>{full_phrase}</p>
                                </div>
                            </div>
                            <div className="HighLightModal__content__item">
                                <div className="HighLightModal__content__block">
                                    <p>переводы слова <b>(в разработке)</b></p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LemmaHighLightModal;