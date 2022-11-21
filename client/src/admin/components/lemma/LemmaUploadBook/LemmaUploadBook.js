import React from 'react'
import { File } from '../../../../global-components/layout/Inputs'
import Button from '../../../../global-components/layout/Button'
import ToolTip from '../../../../global-components/layout/ToolTip/ToolTip'

export default class LemmaUploadText extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="lemma__uploadModal__wrapper">
                <p className="lemma__heading__small">Загрузка книги</p>
                <div className="lemma__uploadModal__flex">
                    <div className="lemma__uploadModal__item mb-3">
                        <File validExts={/(\.fb2|\.pdf|\.txt|\.fb3|\.epub)/g} title={'Загрузить'} customClass='btn-new btn-new--green mr-3' name={'book'} />
                        <p>Поддерживаемые форматы файлов: .fb2, .pdf, .txt, .fb3, .epub</p>
                    </div>
                    
                </div>
                <div className="lemma__uploadModal__flex">
                    <div className="lemma__uploadModal__item">
                        <a href="" className="btn-new btn-new--purplegrey" onClick={(evt) => {
                            evt.preventDefault();
                            this.props.createLemma( $('#lemma-form')[0] )
                        }}>Отправить</a>
                        <ToolTip info={'Нажмите, чтобы отправить книгу на разбиение'} icon={'help'} />
                    </div>
                    <div className="lemma__uploadModal__item">
                    <div className="lemma__uploadModal__item ml-3">
                        <a
                            href=""
                            target="_blank"
                            className="btn-new btn-new--purplegrey modal-trigger"
                            data-target="modal-lemma-word-change"
                            >Последняя сессия
                        </a>
                    </div>
                        <ToolTip info='Последняя сессия' icon={'help'}/>
                    </div>
                    {/* <div className="lemma__uploadModal__item fingman_left_panel_checkbox_item pt-2">
                        <input type="checkbox" name="miss_step" id="miss_step" className="checkbox_public" checked={this.state.skip_lemma_text} onChange={is_checked => this.setState(() => ({ skip_lemma_text: is_checked }))} />
                        <label htmlFor="miss_step"><span></span></label>
                        <p className="ml-2 mb-2">Пропустить этап выделения слов</p>
                    </div> */}
                    
                </div>
                 
                {/* <a
                    href=""
                    target="_blank"
                    className="btn btn-info--new shadow--none mr1 modal-trigger"
                    data-target="modal-lemma-word-change"
                    >
                        <span className="material-icons align-text-top mr-1 md-18">open_in_new</span>
                        Открыть выделение слов
                </a> */}
            </div>
        )
    }
}