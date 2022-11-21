import React from 'react'
import Axios from 'axios'
import API from '../../../../../config/API'
import {} from './index.less'
import { getCurrentUserToken, Toast } from '../../../../../functions'
import TestsFilterComponent from './TestsFilterComponent'
import TestsCreateUpdate from './TestsCreateUpdate'
import TestsUsersStatistic from './TestsUsersStatistic'
import TestQuiz from './TestQuizComponent/TestQuiz'

const TOKEN = getCurrentUserToken()
export default class TestsWidget extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            courses: [],
            active_course: null,
            tests: {},
            active_test: null,
            test_results: [],
            r_cls: 'courses-tests'
        }

        this.onLoadingUsers = this.onLoadingUsers.bind(this)
        this.onClickTest = this.onClickTest.bind(this)
        this.onCheckedCourse = this.onCheckedCourse.bind(this)
        this.loadTests = this.loadTests.bind(this)
        this.onDeleteTest = this.onDeleteTest.bind(this)
        this.setResults = this.setResults.bind(this)
        this.showAdminWidgets = this.showAdminWidgets.bind(this)
    }

    loadTests ({ id = 0 }) {
        Axios.post(API.host + '/api/tests/all/get', {
            course_id: id
        }).then(response => {
            if(response.data) {
                const data = response.data

                if(response.data.tests) {
                    this.setState(() => ({ tests: {
                        [id]: data.tests
                    } }))
                }
            }
        })
    }

    setResults (results = []) {
        this.setState(() => ({ test_results: results }))
    }

    onLoadingUsers ($test) {
        Axios.post(API.host + '/api/tests/all/get-results', {
            test_id: $test.id,
            course_id: $test.course_id
        }, { headers: {'Authorization': TOKEN} }).then(response => {
            if(response.data) {
                const data = response.data

                if(data.success) {
                    this.setResults(data.results)
                }

                Toast(data.error_message)
            }
        })
    }

    onClickTest ($test) {
        this.setState(() => ({ active_test: $test, test_results: [] }))
    }

    onDeleteTest (active_test, cb) {
        let active_test_id = active_test.id
        let new_tests = this.state.tests[this.state.active_course.id].filter(item => item.id !== active_test_id)

        Axios.post(API.host + '/api/tests/delete/test', {
            test_id: active_test_id
        }, { headers: {'Authorization': TOKEN} }).then(response => {
            if(response.data) {
                Toast(response.data.error_message)

                this.setState(() => ({ active_test: null, tests: new_tests }), () => {
                    this.loadTests(this.state.active_course)
                })

                if(cb) cb()
            }
        })
    }

    onCheckedCourse (course) {
        this.setState(() => ({ active_course: null, active_test: null }))

        this.loadTests({ id: course.id })

        if(this.props.is_admin_widget) {

            Axios.get(API.host + '/admin/modules/' + course.id, {
                headers: {'Authorization': TOKEN}
            }).then(response => {
                if(response.data && response.data.success) {
                    this.setState(() => ({ active_course: response.data.data, test_results: [] }))
                }
            })

        } else this.setState(() => ({ active_course: course }))
    }

    componentDidMount () {
        // Загрузка курсов
        let { all_loading_courses = false, course_id = null } = this.props
        let courses_path = '/admin/modules',
            courses_method = 'get',
            active_course = null

        if(self.userData) {
            if (all_loading_courses && self.userData.role >= 2) {
                courses_path = '/courses'
                courses_method = 'post'
            }
        }

        Axios[courses_method](`${API.host}${courses_path}`, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            const data = response.data;

            // Если ID курса задан по умолчанию
            if(course_id) {
                active_course = data.data.filter(item => item.id == course_id)
                if(active_course.length) {
                    this.onCheckedCourse(active_course[0])
                }
            }

            if(data.success) {
                this.setState(() => ({
                    courses: data.data
                }))
            } else {
                this.setState(() => ({
                    courses: []
                }))
            }
        })
    }

    showAdminWidgets () {
        const { active_course, test_results, active_test } = this.state

        if(active_course && !test_results.length) {
            return <TestsCreateUpdate
                active_test={active_test}
                active_course={active_course}
                onDeleteTest={this.onDeleteTest}
            />
        } else if(active_course && test_results.length) {
            return <TestsUsersStatistic
                test_results={test_results}
                r_cls={this.state.r_cls}
            />
        }

        return ''
    }

    render() {
        const { is_admin_widget = false, course_id = null } = this.props
        const { active_test, active_course, courses, tests } = this.state

        return (
            <div className={`${this.state.r_cls} row`}>

                <div className={'col-xl-4 col-lg-4 col-md-4 col-sm-12'}>
                <TestsFilterComponent
                    courses={courses}
                    tests={tests}
                    focus_course_id={course_id}
                    active_course={active_course}
                    active_test={active_test}
                    is_admin_widget={is_admin_widget}
                    onCheckedCourse={this.onCheckedCourse}
                    onClickTest={this.onClickTest}
                    onLoadingUsers={this.onLoadingUsers}
                />
                </div>
                <div className={'col-xl-8 col-lg-8 col-md-8 col-sm-12'}>
                {is_admin_widget ? this.showAdminWidgets() : (active_test && active_course) ?
                    <TestQuiz course_id={active_course.id} test_id={active_test.id} />
                : ''}
                </div>
            </div>
        )
    }
}
