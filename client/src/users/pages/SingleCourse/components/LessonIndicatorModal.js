import React, { useState } from 'react'

import LessonIndicators from './LessonIndicators'
import LessonIndicatorItem from './LessonIndicatorItem'
import LessonIndicator from './LessonIndicator'

import API from '../../../../config/API'
import axios from 'axios'
import { getCurrentUserToken, Toast, closeModal } from '../../../../functions'

const LessonIndicatorModal = props => {
    const [indicators, setindicators] = useState([])
    const [currentIndicator, setcurrentIndicator] = useState(props.indicator ? props.indicator : null)

    const loadIndicators = () => {
        axios.get(`${API.host}/api/indicators`).then(response => {
            const indicatorsData = response.data;

            setindicators(indicatorsData.data)
        })
    }

    if(!indicators.length) 
        loadIndicators()

    const clickIndicator = (type, text, indicatorIndex, indicatorId) => {
        const { course_id, id } = props.lessonObject
        const user_id = (self.userData) ? self.userData.id : 0
        const TOKEN = getCurrentUserToken()

        axios.put(API.host + `/api/repeating/${user_id}/${course_id}/${id}`, {
            indicatorIndex, indicatorId, type
        }, { headers: {'Authorization': TOKEN} }).then(response => {
            const data = response.data

            if(data.success) {
                setcurrentIndicator({ text, class: type })
                Toast(data.error_message, 'green')
                loadIndicators()
            }
        })
    }

    return (
        <>
            <div className="modal-content">
                <a href="" className="modal-close" onClick={evt => {evt.preventDefault(); closeModal('modal-indicators')}}>
                    <i className="material-icons">close</i>
                </a>
                <h3 className="modal-indicators__heading">Уровни изучения</h3>
                <p className="modal-indicators__text">
                    В алгоритме Vocabulearning применяется методика интервальных повторений, в рамках которой слова для упражнений отображаются чаще, поэтому результаты по вышеуказанной шкале могут улучшаться и ухудшаться со временем.
                    Упражняйтесь как можно чаще, и всегда прилагайте максимум усилий, чтобы ответить правильно.
                </p>

                <LessonIndicators>
                    {
                        (indicators.length) ?
                            indicators.map(
                                (indicator, i) => {
                                    return <LessonIndicatorItem key={i}>
                                        <LessonIndicator 
                                            activeIndicatorId={props.indicator ? props.indicator.id : 0}
                                            onChange={clickIndicator} index={i} id={indicator.id}
                                            type={indicator.class} text={indicator.text} />
                                    </LessonIndicatorItem>
                                }
                            )
                        : ''
                    }
                </LessonIndicators>

            </div>

            {props.indicator ? <div id={`indicator-modal-${props.indicator.id}`} className={`modal-indicators__footer modal-indicators__${currentIndicator ? currentIndicator.class : props.indicator.class}`}>
                {currentIndicator ? currentIndicator.text : props.indicator.text}
            </div> : ''}
        </>
    )
}

export default LessonIndicatorModal;