import React from 'react'
import { Link } from 'react-router-dom'


export default class LessonHeadsModal extends React.Component {
    constructor () {
        super()

        this.state = {
            
        }
    }

    render() {
        const { course_heads, active_head_id, courseUrl } = this.props

        return (
            <React.Fragment>
                <div className="modal-content course_modal_chapters">
                    <a href="" className="ReaderModal__close"><i className="material-icons">close</i></a>
                    <h3>Главы курса</h3>

                    <div className="course-glavs__total">
                        <p>Всего: </p>
                        <p className="course-glavs__total__number">100</p>
                    </div>

                    <a className='course_modal_chapters_backlink' href={`/courses/${courseUrl}/`}>Перейти в обычную версию курса без глав</a>
                    
                    <div className="collection">
                        {course_heads.length ? course_heads.map((item, i) => {
                            const name_glav = `(${item.count_words} шт.)`

                            if (item.id == active_head_id || item.count_words <= 0) {
                                const isActive = (item.id == active_head_id && item.count_words > 0) ? 'active' : ''

                                return <p className={`collection-item ${isActive}`} key={i}><b>{item.name}</b> {name_glav}</p>
                            } else {
                                return <a key={i} className="collection-item" href={`/courses/${courseUrl}/${item.id}`}><b>{item.name}</b> {name_glav}</a>
                            }
                        }) : ''}
                    </div>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">Закрыть</a>
                </div>
            </React.Fragment>
        )
    }
}