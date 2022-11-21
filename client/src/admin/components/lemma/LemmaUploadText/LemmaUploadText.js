import React from 'react'
import Button from '../../../../global-components/layout/Button'
import ToolTip from '../../../../global-components/layout/ToolTip/ToolTip'
import './index.less'

export default class LemmauploadModal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="lemma__uploadModal__wrapper">
                <p className="lemma__heading__small">Загрузка текста</p>
                <textarea className="materialize-textarea lemma__textarea" placeholder="Введите текст статьи..." name={'book_text'}></textarea>
                <div className="lemma__uploadModal__flex">
                    <div className="lemma__uploadModal__item">
                        <a className="btn-new btn-new--purplegrey" onClick={evt => {
                            evt.preventDefault()
                            this.props.createLemma( $('#lemma-form')[0] )
                        }}>Отправить</a>

                        <ToolTip info='Нажмите, чтобы отправить текст на разбиение' icon={'help'}/>
                    </div>
                    <div className="lemma__uploadModal__item">
                        <a
                            href=""
                            target="_blank"
                            className="btn-new btn-new--purplegrey modal-trigger"
                            data-target="modal-lemma-word-change"
                            >Последняя сессия
                        </a>
                        <ToolTip info='Последняя сессия' icon={'help'}/>
                    </div>
                    {/* <div className="lemma__uploadModal__item fingman_left_panel_checkbox_item pt-2">
                        <input type="checkbox" name="miss_step" id="miss_step" className="checkbox_public" checked={this.state.skip_lemma_text} onChange={is_checked => this.setState(() => ({ skip_lemma_text: is_checked }))} />
                        <label htmlFor="miss_step"><span></span></label>
                        <p className="ml-2">Пропустить этап выделения слов</p>
                    </div> */}
                </div>
                
            </div>
        )
    }
}