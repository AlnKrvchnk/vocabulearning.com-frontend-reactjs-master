import React from 'react'
import StatisticItem from './Statistic-Item'

import './statistic.less';

export default function StatisticCourses ({ data, courseId, isAdminPage}) {
    let statisticData = [];

    let adminPage = isAdminPage;

    if(data != null) {
        statisticData = Object.values(data)
    }

    return (
        <div className="profile-statistic">
            <div className="profile-statistic__nav d-flex align-items-center justify-content-between">
                <h3>Статистика по курсам:</h3>

                {adminPage ?
                    <ul className="nav nav-expander">
                        <li>
                            <a href="" className="nav-expander__link" onClick={(e) => {
                                e.preventDefault();
                                $('#modal-user-statistic-data').toggleClass('width--100')
                            }}>
                                <span className="material-icons align-text-top mr-1 md-18">🗔</span>
                            </a>
                        </li>
                        <li>
                            <a href="" className="nav-expander__link" onClick={(e) => {
                                e.preventDefault();
                                $('#modal-user-statistic-data').fadeOut()
                            }}>
                                <span className="material-icons align-text-center mr-1 md-18">close</span>
                            </a></li>
                    </ul> : ''
                }
            </div>

            {
                (statisticData.length) ? statisticData.map(
                    (item, i) => {
                        if(courseId == null) {
                            return <StatisticItem
                                key={i}
                                course={item.course}
                                words={item.words}
                                full_statistics={item.full_statistics}
                            />
                        } else {
                            if(item.course) {   
                                if(item.course.id == courseId) {
                                    return <StatisticItem
                                        key={i}
                                        course={item.course}
                                        words={item.words}
                                        full_statistics={item.full_statistics}
                                    />
                                }
                            } else return '';
                        }
                    }
                ) : <p>Курсы не найдены.</p>
            }
        </div>
    )
}