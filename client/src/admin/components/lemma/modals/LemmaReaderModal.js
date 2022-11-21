import React from 'react';
import { closeModal } from '../../../../functions';

import './LemmaReaderModal.less';

export default class LemmaReaderModal extends React.Component {
    constructor (props) {
        super(props)

        // this.readerButtonHandler = this.readerButtonHandler.bind(this)
    }

    // readerButtonHandler (e) {
    //     e.preventDefault();
    //     let icon = e.target.querySelector('i');

    //     if(icon.innerText)
    //         icon.innerText === 'visibility_off' ? icon.innerText = 'visibility' : icon.innerText = 'visibility_off';

    //     if(this.props.onActionModalReaderSetting) 
    //         this.props.onActionModalReaderSetting(e.target.id, icon.innerText == 'visibility')
    // }

    render() {
        const { onActionModalReaderSetting } = this.props

        return (
            <div id="readerModal" className="ReaderModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <a href="" className="ReaderModal__close" onClick={(evt) => {evt.preventDefault(); closeModal(`modal-LemmaReaderModal`);}}>
                    <i className="material-icons">close</i>
                </a>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="ReaderModal__block">
                                {/*TODO - поставить сюда поиск по главам*/}
                            </div>
                            <div className="ReaderModal__block">
                                <p className="small__subheading">Размер шрифта</p>
                                <div className="ReaderModal__btns modalFonts__btns">
                                    <div className="ReaderModal__btns__item"><a onClick={() => onActionModalReaderSetting('fontSize', '12px')} className="modal__font--1">A</a></div>
                                    <div className="ReaderModal__btns__item"><a onClick={() => onActionModalReaderSetting('fontSize', '14px')} className="modal__font--2">A</a></div>
                                    <div className="ReaderModal__btns__item"><a onClick={() => onActionModalReaderSetting('fontSize', '16px')} className="modal__font--3">A</a></div>
                                    <div className="ReaderModal__btns__item"><a onClick={() => onActionModalReaderSetting('fontSize', '18px')} className="modal__font--4">A</a></div>
                                </div>
                            </div>
                            <div className="ReaderModal__block">
                                <div className="fingman_left_panel_checkbox_item ReaderModal__checkbox">
                                    <p>Показать слово</p>
                                    <input type="checkbox" name="showWords" id="showWords" className="checkbox_public" />
                                    <label htmlFor="showWords">
                                        <span></span>
                                    </label>
                                </div>
                                
                                <div className="fingman_left_panel_checkbox_item ReaderModal__checkbox">
                                    <p>Показать фразу</p>
                                    <input type="checkbox" name="showPhrases" id="showPhrases" className="checkbox_public" />
                                    <label htmlFor="showPhrases">
                                        <span></span>
                                    </label>
                                </div>

                                <div className="ReaderModal__brightness">
                                    <p className="small__subheading">Настройте контрастность</p>
                                    <a className="ReaderModal__brightness__link">
                                        <img src="../img/icons/icon-contrast-low.svg" alt=""/>
                                    </a>
                                    <input className="ReaderModal__brightness__input custom-range" type="range" min="0" max="5" id="customRange2" />
                                    <a className="ReaderModal__brightness__link">
                                        <img src="../img/icons/icon-contrast-high.svg" alt=""/>
                                    </a>
                                </div>
                            </div>
                            <div className="ReaderModal__block">
                                <div className="ReaderModal__block__container ReaderModal__block__btns">
                                    {/* <div className="ReaderModal__block__btn">
                                        <a className="btn ReaderModal__block__btn" id="showWords" onClick={this.readerButtonHandler}>
                                            <i className="material-icons">visibility_off</i> слова
                                        </a>
                                    </div>
                                    <div className="ReaderModal__block__btn">
                                        <a className="btn ReaderModal__block__btn" id="showPhrases" onClick={this.readerButtonHandler}>
                                            <i className="material-icons">visibility_off</i> фразы
                                        </a>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}