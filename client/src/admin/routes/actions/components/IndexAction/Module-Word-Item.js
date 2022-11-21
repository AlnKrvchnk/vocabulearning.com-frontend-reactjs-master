import React from 'react'

import {closeSidebar, showInpEdit} from '../../../../../functions'
import API from '../../../../../config/API'
import Audio from '../../../../../global-components/layout/AudioPlayer/AudioPlayer'

export default function ModuleWord ({
    id, word, phrase, explanation, explanation_second,
    audio_word, audio_phrase, explanation_word, morph_priz,
    onDelete, onLoadWord, etymology, as, aw, index, association, association_image = '',
    onUpdateProperty, type_sound, triggerSorting
    }) {
    // Расшифровка типа аудио
    let type_sound_text = API.type_sounds.getTypeSound(type_sound)
    let badge_class = 'app-badge app-badge--' + (type_sound === '' ? 'default' : type_sound)

    let LinkWordEdit = ({ value, property, title }) => {
        return <a href="" className="course-glavs__icon" onClick={e => {
            e.preventDefault()
            showInpEdit(value, data => onUpdateProperty(property, data, id), title)
        }}><i className="material-icons">launch</i></a>
    }

    // function showPlayer(e, id) {
    //     e.preventDefault();
    //     console.log(`#${id}`);
    //     const player = document.querySelector(`#${id}`);
    //     player.classList.toggle('hidden');
    // }

    // function makeWordHash(word) {
    //     if (word) {
    //         const wordToSplit = word.audio_word.replace(/\.[^/.]+$/, "").split('/')
    //         const wordHash = wordToSplit[4]
    //         return wordHash
    //     } else {
    //         return ''
    //     }

    // }

    return (
        <tr data-word-id={id}>
            <td width={"40"}>{index+1}</td>
            <td className="tbody__item--bordered">
                <div className="fingman__phrases__table__item">{word}</div>
                <div className="fingman__phrases__table__item">{phrase}</div>
            </td>
            <td className="tbody__item--bordered">
                <div className="fingman__phrases__table__item">
                    {explanation_second}
                    <LinkWordEdit value={explanation_second} property={'explanation_second'} title={'Редактирование пояснения слова'} />
                </div>
            </td>
            <td className="tbody__item--bordered">
                <div className="fingman__phrases__table__item">
                    {explanation}
                    <LinkWordEdit value={explanation} property={'explanation'} title={'Редактирование перевода фразы'} />
                </div>

            </td>
            <td className="active-click tbody__item--bordered">
                {morph_priz}
                <LinkWordEdit value={morph_priz} property={'morph_priz'} title={'Редактирование морф.признака'} />
            </td>
            <td className="active-click tbody__item--bordered">
                <div className="fingman__phrases__table__item fingman__phrases__table__item--active">
                    {explanation_word}
                    <LinkWordEdit value={explanation_word} property={'explanation_word'} title={'Редактирование подробного разбора слова'} />
                </div>
                <div className="fingman__phrases__table__item">
                    {etymology}
                    <LinkWordEdit value={etymology} property={'etymology'} title={'Редактирование этимологии'} />
                </div>
                <div className="fingman__phrases__table__item">
                    {association_image ? <img src={association_image} width={80} /> : ''}

                    <React.Fragment>
                        {association}
                        <LinkWordEdit value={association} property={'association'} title={'Редактирование ассоциации'} />
                    </React.Fragment>
                </div>
            </td>
            <td className="active-click tbody__item--bordered">
                <div className="fingman__phrases__table__audio">
                    <div className="fingman__phrases__table__audioBadge">
                        <span onClick={() => triggerSorting('type_sound', type_sound)}>{type_sound_text}</span>
                    </div>
                    <div className="fingman__phrases__table__audioBtns">
                        <Audio src={audio_word || aw} hidden={''}/>
                        <Audio src={audio_phrase || aw} hidden={''}/>
                    </div>
                </div>
            </td>
            <td width="40" className="active-click">
                <div className="fingman__phrases__table__controls">
                    <a href="" onClick={e => {
                        e.preventDefault();
                        closeSidebar();
                        onLoadWord(id)
                    }} className="fingman__phrase__table__btn fingman__phrase__table__btn--edit"><i className="material-icons">edit</i></a>
                    <hr className={'divider'} />
                    <a href="" onClick={e => {
                        e.preventDefault();
                        if(confirm('Вы точно хотите удалить слово?')) {
                            onDelete(id)
                        }
                    }} className="fingman__phrase__table__btn fingman__phrase__table__btn--delete"><i className="material-icons">close</i></a>
                </div>
            </td>
        </tr>
    )
}
