import React from 'react'
import Indicator from '../SingleCourse/components/LessonIndicator'
import {parseDate} from "../../../functions";
import Button from "../../../global-components/layout/Button";

export default function StatisticItem ({ course, words, full_statistics = false }) {
    // filter words from indicator
    let FWI = [
        0, // стадия 1
        0, // стадия 2
        0, // стадия 3
        0, // стадия 4
        0 // стадия 5
    ];

    words.forEach(word => {
        let index = word.indicator.id-1;
        let fw = FWI[index];

        FWI[index] = fw+1;
    });

    return (
        <React.Fragment>
        {
            (course !== undefined) ?
                <div className="profile-statistic__item">
                    <div className="profile-statistic__item__row justify-content-between align-items-end">
                    <h5>Курс «<a href={`/courses/${course.url}`}>{course.name}</a>»</h5>

                    </div>
                    <div className="profile-statistic__item__row align-items-center justify-content-start">
                        <form className="d-flex align-items-center justify-content-start">
                            <select className="browser-default col s12 m4" required name={'filter_key'}>
                                <option value="1" key="1">Все главы</option>
                                <option value="2" key="2">Глава 1</option>
                                <option value="3" key="3">Глава 2</option>
                            </select>
                        </form>
                    </div>
                    <div className="profile-statistic__item__row">
                    <div className="profile-statistic__words d-flex align-items-center justify-content-start">
                        {full_statistics ? <React.Fragment>
                            <h5>Последняя сессия</h5>
                            <div className="profile-statistic__words__item">Слов изменили позицию (верно / не верно) - <b>{ full_statistics.json_data.counter_words_move.valid}/{ full_statistics.json_data.counter_words_move.notvalid}</b></div>
                            <div className="profile-statistic__words__item">Дата выхода из сессии - <b>{new Date(full_statistics.json_data.date.end).toLocaleDateString()} {new Date(full_statistics.json_data.date.end).toLocaleTimeString()}</b></div>
                            <div className="profile-statistic__words__item">Вы проработали последнюю сессию - <b>{full_statistics.json_data.date.result.minutes} мин.</b></div>
                            <div className="profile-statistic__words__item">Общее время на курсе - <b>{(full_statistics.json_data.date.start_and_end.seconds/60/60).toFixed(2)} час.</b></div>
                            <hr/>
                        </React.Fragment> : ''}

                        <div className="profile-statistic__words__item">Количество слов - <b>{words.length} шт.</b></div>
                        {
                            FWI.map((item, i) => {
                                return <div className="profile-statistic__words__item" data-key={i} key={i}>Стадия {i+1} - <b>{item} шт.</b></div>
                            })
                        }
                    </div>
                    </div>
                    <div className="profile-statistic__item__row">
                    <table className="responsive-table table-bordered bg-white">
                        <thead>
                            <tr>
                                <th className="d-flex align-items-center justify-content-between">Слово <a href="" className="sort__item"><span className="material-icons align-text-bottom ml-1 md-18">sort</span></a></th>
                                <th className="d-flex align-items-center justify-content-between">Индикатор <a href="" className="sort__item"><span className="material-icons align-text-bottom ml-1 md-18">sort</span></a></th>
                                <th className="d-flex align-items-center justify-content-between">Пояснение <a href="" className="sort__item"><span className="material-icons align-text-bottom ml-1 md-18">sort</span></a></th>
                                <th className="d-flex align-items-center justify-content-between">Правильные вводы <a href="" className="sort__item"><span className="material-icons align-text-bottom ml-1 md-18">sort</span></a></th>
                                <th className="d-flex align-items-center justify-content-between">Неправильные вводы <a href="" className="sort__item"><span className="material-icons align-text-bottom ml-1 md-18">sort</span></a></th>
                                <th className="d-flex align-items-center justify-content-between">Главы <a href="" className="sort__item"><span className="material-icons align-text-bottom ml-1 md-18">sort</span></a></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                words.map((word, i) => {
                                    return <tr key={i}>
                                        <td>{word.word.word}</td>
                                        <td>
                                            <Indicator type={word.indicator.class} text={''} />
                                        </td>
                                        <td>{word.word.explanation_word}</td>
                                        <td>{word.word.repeat_valid}</td>
                                        <td>{word.word.repeat_invalid}</td>
                                        <td>1</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                        <nav className="profile-statistic__navigation" aria-label="Page navigation example">
                            <form className="form-inline float-left">
                                <label className="my-1 mr-2 d-none d-md-block" htmlFor="show-data">Showing 10 out of 478</label>
                                {/*<select className="form-control" id="show-data">*/}
                                {/*    <option selected="">25</option>*/}
                                {/*    <option value="1">50</option>*/}
                                {/*    <option value="2">100</option>*/}
                                {/*    <option value="3">all</option>*/}
                                {/*</select>*/}
                            </form>
                            <ul className="pagination justify-content-end">
                                <li className="page-item">
                                    <a className="page-link" href="#" tabIndex="-1">Previous</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item active"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item">
                                    <a className="page-link" href="#">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            : ''
        }
        </React.Fragment>
    )
}