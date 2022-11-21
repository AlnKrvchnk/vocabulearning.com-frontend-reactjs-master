import React from 'react'
import Button from '../../../global-components/layout/Button'
import Input from '../../../global-components/layout/Input'

// Компоненты статистики
import StatisticTable from './components/CoursesStatisticAction/StatisticTable'
import SearchCourseForm from './components/CoursesStatisticAction/SearchCourseForm'
import SearchTableDataForm from './components/CoursesStatisticAction/SearchTableDataForm'
import API from '../../../config/API';
import Axios from 'axios';
import StatisticMenu from './components/CoursesStatisticAction/StatisticMenu';
import { getCurrentUserToken, Toast, showLoader, hideLoader, dynamicSort, parseDate, dateIF } from '../../../functions';
import StatisticTableFilter from './components/CoursesStatisticAction/StatisticTableFilter';
import FilterItems from './components/CoursesStatisticAction/FilterItems';
import StatisticCourses from '../../../users/pages/Auth/Statistic'
import Modal from '../../../global-components/layout/Modal'

export default class CoursesStatisticAction extends React.Component {
    constructor () {
        super()

        this.courses_names = {}
        
        this.state = {
            table_rows: [
                /**
                 * sort - если true, то появится стрелочка сортировка (значение $key и is_active обязательны!)
                 * $key - значение по которому будет сортироваться таблица (из users_in_course)
                 */
                {name: 'ID', sort: true, $key: 'id', is_active: false},
                {name: 'ФИО', sort: true, $key: 'fio', is_active: false},
                {name: 'Роль', $key: 'role', is_active: false, sort: true},
                {name: 'Роль на курсе', $key: 'role_on_course', is_active: false, sort: true},
                {name: 'Блокировка', $key: 'blocked', is_active: false, sort: true},
                {name: 'Группа', sort: true, $key: 'group_name', is_active: false},
                {name: 'Курс', sort: true, $key: 'course_name', is_active: false},
                {name: 'E-mail', $key: 'email'},
                {name: 'Дата регистрации', sort: true, $key: 'date_register', is_active: false},
                {name: 'Дата оплаты', sort: true, $key: 'date_payment', is_active: false},
                {name: 'Окончание оплаты / кол-во дней', sort: true, $key: 'days_payment', is_active: false},
                {name: 'Сумма оплаты', sort: true, $key: 'summ_payment', is_active: false},
                {name: 'IP/Страна/Регион/Город', sort: true, $key: 'geolocation', is_active: false},
                {name: "Подробная статистика ученика"}
            ],
            activeFilters: [],
            valTo: null, // фильтр для дат
            currentKey: '', // текущий ключ фильтра
            filterRanges: [],
            users_in_course: [
                /*{
                    id: 1, 
                    fio: 'Андрей Тищенко', 
                    email: 'andrey.tishenko200229@mail.ru', 
                    date_register: 'test',
                    date_payment: 'test',
                    days_payment: 0, <-- Окончание оплаты + сколько осталось дней
                    summ_payment: 15000,
                    geolocation: 'test',
                    IP: 'test'
                }*/
            ],
            courseInfo: {
                count_pupils_now: 0, // Всего участников сейчас
                count_payments_now: 0, // Платных сейчас
                total_count_pupils: 0, // Всего было учеников
                total_count_payments: 0, // Платных было
                total_payment_summ: 0 // Общая сумма этого курса
            },
            courses_names: {},
            course_has_loaded: false,
            activeClass: '',
            user_statistic_data: {},
            activeCourseId: null,
            active_course_name: ''
        }

        this.activateMenu = this.activateMenu.bind(this)
        this.onSearchCourse = this.onSearchCourse.bind(this)
        this.onSearchData = this.onSearchData.bind(this)
        this.onSorting = this.onSorting.bind(this)
        this.setActiveFilters = this.setActiveFilters.bind(this)
        this.removeFilter = this.removeFilter.bind(this)
        this.filterUsersInCourse = this.filterUsersInCourse.bind(this)
        this.getUserStatistic = this.getUserStatistic.bind(this)
    }

    componentDidMount () {
        const TOKEN = getCurrentUserToken()
        Axios.get(API.host + '/admin/modules', {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            if(response.data) {
                this.setState(() => ({ courses_names: response.data.data }))
            }
        })

        this.currentTable = $('.Tsds__page--courses-statistic__table table');

        $(document).keyup(e => {
            if(e.keyCode == 27) {
                this.setState(() => ({ activeClass: '' }))
            }
        })

        $(document).mouseup(e => { 
            let checkElem = $(".Tsds__page--courses-statistic__menu"); 
            if (!checkElem.is(e.target)
                && checkElem.has(e.target).length === 0) {
                if (this.state.activeClass == 'active') {
                    this.setState(() => ({ activeClass: '' })) 
                }
            }
        });
    }

    // сортировка (по стрелочке)
    onSorting (item, index) {
        if(item.sort && item.$key) {
            const { $key } = item
            let users_course = this.state.users_in_course
            let table_rows = this.state.table_rows

            if(users_course.length > 0) {
                if(table_rows[index]) {
                    table_rows[index].is_active = !table_rows[index].is_active

                    users_course.sort(dynamicSort($key, table_rows[index].is_active))

                    this.setState(() => ({ users_in_course: users_course, table_rows: table_rows }))
                }
            }
        } 
    }

    // загружаем курс
    onSearchCourse ($data) {
        const TOKEN = getCurrentUserToken();

        showLoader()
        Axios.post(API.host + '/admin/courses-statistics/', {
            course_name: $data
        }, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            if(response.data) {
                const data = response.data
                if(data.success) {
                    const courseData = data.data
                    this.setState(() => ({
                        courseInfo: courseData.total_data,
                        users_in_course: courseData.users,
                        course_has_loaded: true,
                        activeCourseId: courseData.id,
                        active_course_name: $data
                    }))
                    hideLoader()
                } else {
                    hideLoader()
                    Toast(data.error_message, 'red')
                }
            }
        })
    }

    // собите поиска по таблице
    onSearchData (searchData) {
        const splitSearchData = searchData.toUpperCase().trim().split(' ');
        const findTableDatas = this.currentTable.find('tr:not(.head-tr)');

        findTableDatas.each((i, elem) => {
            const elemVal = elem.textContent.trim().toUpperCase().replace(/ /g, '');
            const current_element = $(elem);

            splitSearchData.forEach(searchDataItem => {
                if(elemVal.match(eval('/'+searchDataItem+'/g')) === null) {
                    current_element.hide()
                } else {
                    current_element.show()
                }
            })
        })
    }

    // активируем меню
    activateMenu () {
        const { activeClass } = this.state
        if(activeClass == '') { 
            this.setState(() => ({ activeClass: 'active' }))
        } else {
            this.setState(() => ({ activeClass: '' }))
        }
    }

    // назначаем активные фильтры из StaticTableFilter Component
    setActiveFilters (data, otherData = {} ) {
        // Если есть другие данные (например диапазон)
        if(otherData) {
            // Если диапазон является датой
            if(otherData.valTo && otherData.currentKey.indexOf('date') > -1) {
                if(dateIF( parseDate(otherData.valTo), '<=', parseDate(otherData.valFrom) )) {
                    Toast(otherData.valTo + ' не может быть меньше или равной исходной даты', 'red')
                    return
                }

                // Если фильтры в диапазоне уже есть
                if(this.state.filterRanges.length) {
                    let indexesSearchedFilter = null
                    let filtersDiapazone = this.state.filterRanges.filter((item, i) => {
                        if(item.keyFilterDate == otherData.currentKey) {
                            indexesSearchedFilter = i
                            return true
                        }
                    })

                    if(filtersDiapazone.length) {
                        if(indexesSearchedFilter !== null) {
                            let fRanges = this.state.filterRanges.slice()
                            fRanges[indexesSearchedFilter].valFrom = otherData.valFrom
                            fRanges[indexesSearchedFilter].valTo = otherData.valTo

                            this.setState(() => ({ filterRanges: fRanges }))
                        } 
                        return
                    }
                }

                this.setState(prevState => ({
                    filterRanges: [...prevState.filterRanges, {
                        keyFilterDate: otherData.currentKey,
                        valTo: otherData.valTo,
                        valFrom: otherData.valFrom
                    }]
                }))
            }
        }

        this.setState(() => ({ activeFilters: data }))
        Toast('Фильтр успешно добавлен')
    } 

    // фильтрация курсов (триггерится из StatisticTableFilter Component)
    filterUsersInCourse () {
        let users_in_course = this.state.users_in_course
        
        // Если значение к ... существует
        if (this.state.filterRanges.length) {
            let f_ranges = this.state.filterRanges
            // Значения полей из фильтра (set Active Filters)
            let new_users_in_course = []
            f_ranges.forEach(filterRange => {
                let { valTo, valFrom, keyFilterDate } = filterRange

                valTo = parseDate(valTo)
                valFrom = parseDate(valFrom)
                users_in_course.forEach(user => {
                    let userDate = parseDate(user[keyFilterDate])
                    if( dateIF(userDate, '<=', valTo) && 
                        dateIF(userDate, '>=', valFrom) ) new_users_in_course.push(user) 
                })
            })

            if(new_users_in_course.length) users_in_course = new_users_in_course
        }

        // Если заданы основные активные фильтры
        if(this.state.activeFilters.length) {
            let filterUsers = users_in_course.filter(user => {
                let checkFilter = [];
                this.state.activeFilters.forEach(filterItem => {
                    // Проверяем, не дублирует ли фильтр который находится уже в диапазоне
                    if(this.state.filterRanges.length) {
                        let isFilterValid = this.state.filterRanges.filter(fRange => filterItem[fRange.keyFilterDate])
                        if(isFilterValid.length) return
                    }
                    
                    // Ключи пользователя
                    let userKey = filterItem.f_key.split('.')
                        userKey = (userKey.length <= 1) ? user[userKey[0]] : user[userKey[0]][userKey[1]]

                    if(filterItem.f_data == userKey) {
                        checkFilter.push(filterItem)
                    }
                })

                return checkFilter.length > 0
            })

            if(filterUsers.length) return filterUsers
            else Toast('Пользователи по фильтру не найдены', 'red')
        }

        return users_in_course
    }
    
    // Удаление фильтра
    removeFilter (f_prop, index, cls = this, cb = false) {
        if(!cls.state[f_prop]) return ''

        cls.setState(prevState => {
            let newData = prevState[f_prop].slice()
            newData.splice(index, 1)
            return { [f_prop]: newData }
        }, () => {
            if(cb) cb()
        })
    }

    getUserStatistic (user_id) {
        const TOKEN = getCurrentUserToken()
        Axios.get(API.host + '/admin/users/' + user_id, {
            headers: {
                'authorization': TOKEN
            }
        }).then(response => {
            if(response.data) {
                const data = response.data;
                this.setState(() => ({
                    user_statistic_data: data.data
                }))   

                const inst = M.Modal.init(document.getElementById('modal-user-statistic-data'));
                inst.open();
            }
        })
    }

    render() {
        return (
            <div className="Tsds_ _page Tsds__page--courses-statistic" id="courses-statistic-page">
                <h1>Информация по курсам</h1>
                {/* Поиск курса */}
                <SearchCourseForm courses_tooltips={this.state.courses_names} onSearchCourse={this.onSearchCourse} />
                <hr />
                {/* Поиск по таблице */}
                {this.state.users_in_course.length ? <SearchTableDataForm onSearchData={this.onSearchData} /> : ''}
                {/* Фильтры по таблице */}
                <StatisticTableFilter setActiveFilters={this.setActiveFilters} parentState={this.state} />
                {/* Фильтры с диапазоном ОТ и ДО */}
                <FilterItems items={this.state.filterRanges} data={{
                    type: 'diap', // диапазон
                    hasClick: (i, item) => {
                        this.removeFilter('filterRanges', i)
                    }
                }} customClass='blue' />
                {/* Таблица пользователей */}
                <StatisticTable 
                    users_in_course={this.filterUsersInCourse()} 
                    td={this.state.table_rows}
                    onSearchCourse={this.onSearchCourse}
                    active_course_name={this.state.active_course_name} 
                    onSorting={this.onSorting}
                    activeCourseId={this.state.activeCourseId}
                    onGetUserStatistic={this.getUserStatistic}
                />

                {/* Меню курса */}
                <StatisticMenu 
                    activeClass={this.state.activeClass} 
                    course_has_loaded={this.state.course_has_loaded} 
                    course_info={this.state.courseInfo} 
                />

                <div id="modal-user-statistic-data" className="modal Tsds__modal Tsds__modal--user-statistic-data">
                    <StatisticCourses courseId={this.state.activeCourseId} data={this.state.user_statistic_data} />
                </div>
                
                <a href="" onClick={e => {
                    e.preventDefault()
                    this.activateMenu()
                }} className={`waves waves-effect waves-light shadow--none Tsds__page--courses-statistic__full ${this.state.activeClass}`}>
                    <img src={'/img/icons/more.svg'} width={30} />
                </a>
            </div>
        )
    }
}