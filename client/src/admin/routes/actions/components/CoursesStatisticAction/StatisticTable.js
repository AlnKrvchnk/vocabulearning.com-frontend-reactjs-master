import React from 'react'
import Button from '../../../../../global-components/layout/Button'
import Loader from '../../../../../global-components/layout/Loader';
import { parseDate, $API, Toast, getCurrentUserToken } from '../../../../../functions';
import Axios from 'axios';
import API from '../../../../../config/API';

export default class StatisticTable extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            hidden_td: {}
        }

        this.changeRoleOnCourse = this.changeRoleOnCourse.bind(this)
        this.hideTdTable = this.hideTdTable.bind(this)
    }

    hideTdTable ({ $key }) {    
        // Добавляем активный элемент (для выбора ячеек) в состояние
        this.setState(prevState => ({
            hidden_td: {
                ...prevState.hidden_td,
                [$key]: !prevState.hidden_td[$key]
            }
        }))

        // Скрываем активный лемент ячейки на основе состояния (ДОРАБОТАТЬ ПО REACT-ОСНОВУ БЕЗ JQUERY)
        const index_el = this.props.td.findIndex(item => item.$key == $key) + 1,
            el_selector = `#statistic_table table td:nth-child(${index_el}), #statistic_table table th:nth-child(${index_el})`

        $(el_selector).toggleClass('hidden')
    }

    changeRoleOnCourse (e, user) {
        const val = e.target.value
        const TOKEN = getCurrentUserToken()

        if(val == "close") {
            $API.delRoleSettings(user.role_on_course.id, data => {
                Toast(data.error_message, (data.success) ? 'green' : 'red')

                this.props.onSearchCourse( this.props.active_course_name )
            })
        } else {
            Axios.post(API.host + '/api/courses/' + this.props.activeCourseId + '/ADD_USER_TO_COURSE', {
                email: user.email
            }, { headers: {'Authorization': TOKEN} }).then(response => {
                const data = response.data
                Toast(data.error_message, (data.success) ? 'green' : 'red')

                this.props.onSearchCourse( this.props.active_course_name )
            })
        }
    }

    render() {
        const { td, users_in_course, onSorting, onGetUserStatistic } = this.props
        const course_has_been_loaded = users_in_course.length > 0;

        return (
            <div className="Tsds__page--courses-statistic__table" id="statistic_table">
                <p>Найдено пользователей: {users_in_course.length}</p>

                {users_in_course.length && course_has_been_loaded ? <div className="Tsds__page--courses-statistic__filter__result">
                    {td.map((item, i) => {
                        const active_cls = (this.state.hidden_td[item.$key]) ? 'gray' : ''
                        return <div className={`m-item ${active_cls}`} onClick={() => { this.hideTdTable(item, i) }}>{item.name}</div>
                    })}
                </div> : ''}

                <table className="responsive-table table-bordered bg-white">
                    <thead className="thead-light2">
                        <tr className="head-tr">
                            {td.map((item, i) => {
                                const is_sort = item.sort;

                                return <th className={is_sort ? 'sort' : ''} data-index={i} key={i}>
                                    {item.name.trim()}

                                    {is_sort ? <a href="" onClick={e => {
                                        e.preventDefault()
                                        onSorting(item, i)
                                    }} className="sort__item">
                                        <span className="material-icons align-text-bottom ml-1 md-18">sort</span>
                                    {/*<img src={'/img/down-arrow.svg'} width={15} />*/}
                                    </a> : ''}
                                </th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {course_has_been_loaded ? users_in_course.map((user, i) => {
                            return <tr key={i}>
                                <td>{user.id}</td>
                                <td>{user.fio}</td>
                                <td>{user.role}</td>
                                <td>
                                    <select onChange={e => this.changeRoleOnCourse(e, user)} name="role_on_course" className="browser-default">
                                        <option value="" disabled="true" selected={true}>{user.role_on_course.value_role ? 'Открыт доступ' : 'Закрыт доступ'}</option>
                                        <option value={user.role_on_course.value_role}>Открыть доступ</option>
                                        <option value={'close'}>Закрыть доступ</option>
                                    </select>
                                </td>
                                <td>{user.blocked}</td>
                                <td>{user.group_name}</td>
                                <td>{user.course_name}</td>
                                <td>{user.email}</td>
                                <td>{parseDate(user.date_register)}</td>
                                <td>{parseDate(user.date_payment)}</td>
                                <td>{user.days_payment}</td>
                                <td>{user.summ_payment}</td>
                                <td>{user.geolocation}</td>
                                <td>
                                    <Button title={'Подробнее'} customClass="shadow--none" onChange={() => {
                                        onGetUserStatistic(user.id)
                                    }} />
                                </td>
                            </tr>
                        }): ''}
                    </tbody>
                </table>

                {!course_has_been_loaded ? <Loader /> : ''}

                <nav className="users__table__navigation" aria-label="Page navigation example">
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
        )
    }
}