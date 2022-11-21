import React from 'react'
import Button from '../../../global-components/layout/Button'
import ToolTip from '../../../global-components/layout/ToolTip/ToolTip'
import { closeModal } from '../../../functions'

export default class LemmaWordChange extends React.Component {
    constructor (props) {
        super(props)
    }

    loadWordPopup (word_changed, words) {
        const CUSTOM_USER_ANOTATION = words.custom_user_anotation[word_changed.id]

        word_changed.custom_user_anotation = (CUSTOM_USER_ANOTATION) ? CUSTOM_USER_ANOTATION : ''

        if(this.props.onClickChip) this.props.onClickChip(word_changed)
    }

    render() {
        const { is_other_page = false,
            is_admin = false, 
            saveTextLemmaToInCourse, 
            onTextChange, lemmaTextChanged, 
            lemmaTextChangeCallback, lemmaTextLast, 
            mark_text = '',
            type_text_view = 1,
            words = {},
            showWords = false } = this.props

        let changeData = {
            cls: '',
            cls_item_word: ''
        }

        // Если показываем фразы с разбиения
        if(type_text_view == 1) {
            changeData.cls = 'lemma__word-change chips-words'
            changeData.cls_item_word = 'lemma__chip text-selecting-item__chip chips-words__chip'
        } else {
            changeData.cls_item_word = 'reader__container__text__word'
        }

        // <p className="reader__container__text">Lorem Ipsum is <span className="phrase--highlight">simply dummy text </span>of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

        return (
            <div className="lemma">     
                {!is_other_page ? <h3 className="lemma__heading__small">Выберите слова для разбиения</h3> : ''}
                
                <div className={`reader__container__text ${changeData.cls}`}>
                    {lemmaTextChanged.length ? lemmaTextChanged.map((item, i) => {
                        const cls_active = (item.selected) ? 'active' : ''

                        const isset_disabled_symbols = (item.data.length == 1 && item.data.match(/\`|\'|\"|\,|\.|\:|\;|\!|\?|\_|\-|\\|\//g) !== null) ? true : false,
                            cls_disable = (isset_disabled_symbols) ? 'disabled' : ''

                        // Если нужно выделить фразу, указываем данный строковый параметр
                        const mark_class = (mark_text.toUpperCase() == item.data.toUpperCase()) ? 'marked' : ''

                        // Проверка на выделение фразы в курсе
                        let cls_changed_course_word = ''
                        if(type_text_view == 2 && words && showWords) {
                            let word_changed = words[item.data.toUpperCase()]

                            if(word_changed)  {
                                cls_changed_course_word = 'modal-trigger reader--highlight'

                                return <a href="#modal-LemmaHighlightModal" data-index={i} key={i} onClick={e => {
                                    e.preventDefault(); this.loadWordPopup(word_changed, words)
                                }} className={`lemma-word-change-item ${changeData.cls_item_word} ${cls_changed_course_word} ${cls_active} ${mark_class} ${cls_disable}`}>{item.data}</a>
                            }
                        }

                        return <div key={i} data-index={i} onClick={() => {
                            let is_valid_clicking = type_text_view === 1 && onTextChange && !isset_disabled_symbols
                            if(is_other_page && is_admin && is_valid_clicking) {
                                if(!item.selected) 
                                    onTextChange(i, item)
                                return
                            }

                            if(is_valid_clicking) onTextChange(i, item)
                        }} className={`lemma-word-change-item ${changeData.cls_item_word} ${cls_changed_course_word} ${cls_active} ${mark_class} ${cls_disable}`}>{item.data}</div>
                    }) : 'Слова не найдены'}
                </div>

                {is_admin && type_text_view === 1 ? <div className="lemma__uploadModal__item"><a className='btn-new btn-new--green mt-4' onClick={(evt) => {
                    evt.preventDefault();
                    if (typeof lemmaTextChangeCallback == "function") {
                        let words_on_check = {} 
                        
                        lemmaTextChanged.filter(item => item.selected).forEach((item,i) => {
                            const key_obj = item.data.toUpperCase()
                            if(!words_on_check[key_obj]) {
                                words_on_check[key_obj] = -1
                            }   
                        })

                        let result_text = lemmaTextChanged.map(item => {
                            return item.data
                        }).join(' ')

                        closeModal ('modal-lemma-word-change', () => {
                            $('body').removeAttr('style')
                        }, 0)

                        // Сохраняем исходный текст 
                        if(saveTextLemmaToInCourse)
                            saveTextLemmaToInCourse(lemmaTextLast, lemmaTextChanged)
                        
                        // Отправляем текст и объект слов на проверку в свойство txtToJSON - LemmaComponent.js
                        if(lemmaTextChangeCallback)
                            lemmaTextChangeCallback (result_text, words_on_check, lemmaTextChanged)
                    }
                }}>Отправить на разбиение</a> <ToolTip info={'Нажмите на кнопку, чтобы отправить текст на разбиение'} icon={'help'} /> </div> : ''}
            </div>
        )
    }
}