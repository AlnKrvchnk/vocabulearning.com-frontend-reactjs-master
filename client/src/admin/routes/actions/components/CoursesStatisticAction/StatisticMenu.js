import React from 'react'
import { Link } from 'react-router-dom'

export default function StatisticMenu ({ activeClass = '', course_has_loaded = false, course_info }) {
    return (
        <div className={`Tsds__page--courses-statistic__menu ${activeClass}`}>
            <h4 className="Tsds__page--courses-statistic__menu__title">
                <Link to={'/admin/courses/'}>Все мои курсы</Link>
            </h4>
            <h6>Общие данные текущего курса:</h6>

            {course_has_loaded ? (
                <div className="Tsds__page--courses-statistic__menu__data">
                    <div className="Tsds__page--courses-statistic__menu__data__item">
                        <div className="item__left justify-content-start">
                            <p><b>Всего участников сейчас:</b></p>
                        </div>
                        <div className="item__right justify-content-end">
                            <p>{course_info.count_pupils_now}</p>
                        </div>
                    </div>
                    <div className="Tsds__page--courses-statistic__menu__data__item">
                        <div className="item__left justify-content-start">
                            <p><b>Платных сейчас:</b></p>
                        </div>
                        <div className="item__right justify-content-end">
                            <p>{course_info.count_payments_now}</p>
                        </div>
                    </div>
                    <div className="Tsds__page--courses-statistic__menu__data__item">
                        <div className="item__left justify-content-start">
                            <p><b>Всего учеников было:</b></p>
                        </div>
                        <div className="item__right justify-content-end">
                            <p>{course_info.total_count_pupils}</p>
                        </div>
                    </div>
                    <div className="Tsds__page--courses-statistic__menu__data__item">
                        <div className="item__left justify-content-start">
                            <p><b>Платных было:</b></p>
                        </div>
                        <div className="item__right justify-content-end">
                            <p>{course_info.total_count_payments}</p>
                        </div>
                    </div>
                    <div className="Tsds__page--courses-statistic__menu__data__item">
                        <div className="item__left justify-content-start">
                            <p><b>Общая сумма этого курса:</b></p>
                        </div>
                        <div className="item__right justify-content-end">
                           <p>{course_info.total_payment_summ} руб.</p>
                        </div>
                    </div>



                </div>
            ) : <p>Данные с курса не загружены.</p>}
        </div>
    )
}