import React from 'react'

export default class TestsFilterComponent extends React.Component {
    constructor (props) {
        super(props)

        this.triggerData = this.triggerData.bind(this)
    }

    triggerData (prop, data) {
        this.props[prop](data)
    }

    render() {
        let { courses, r_cls = 'courses-tests', active_course, active_test, tests, is_admin_widget, focus_course_id = null } = this.props

        return (
            <div className={r_cls + '__filter col-md-12'}>
                <div className="courses-tests__heading">
                    Список тестов
                </div>
                <div className="courses-tests__wrapper">

                    {
                        courses.map((course, i) => {
                            const active_class = (active_course) ? (course.id == active_course.id) ? 'active' : '' : '',
                                hidden_class = (focus_course_id) ? (focus_course_id !== course.id) ? 'hidden' : '' : ''

                            return <div key={i} className="courses-tests__test">
                                <div data-id={course.id} className={r_cls + '__filter-item ' + active_class + ' ' + hidden_class} key={i}>
                                    <p className={'text-bold'}>{i+1}) {course.name}</p>
                                    {is_admin_widget ?
                                        <React.Fragment>
                                            <div className='courses-tests__buttons'>
                                                <a className={'btn courses-tests__button courses-tests__button--create'} onClick={e => { e.preventDefault(); this.triggerData('onCheckedCourse', course); }} href={'/courses/' + course.url}>Создать тест</a>
                                                <a className={'btn courses-tests__button courses-tests__button--show'} onClick={e => { e.preventDefault(); this.triggerData('onCheckedCourse', course); }} href={'/courses/' + course.url}>Показать тест</a>
                                            </div>
                                        </React.Fragment>
                                    : ''}

                                {tests[course.id] && active_class ? <div className={'table table-striped'}><div>
                                    {tests[course.id].map(($test, j) => {
                                        const active_class_test = (active_test) ? ($test.id == active_test.id) ? 'active' : '' : ''

                                        return <div key={j}>
                                            <div className={r_cls + '__filter-item ' + active_class_test} key={j} data-id={$test.id}>
                                                <a href={'/courses-tests/' + $test.id} className={'color--info'} target={'_blank'} onClick={e => { e.preventDefault(); this.triggerData('onClickTest', $test) }}>{i+1}.{j+1})&nbsp; {$test.name}</a>

                                                {is_admin_widget ? <React.Fragment>
                                                    <a href="" className={'ml1 mr1 ml-0 btn btn-info--new shadow--none'} onClick={e => { e.preventDefault(); this.triggerData('onClickTest', $test) }}>
                                                        {/*<span className="material-icons align-text-top mr-1 md-18">edit</span>*/}
                                                        Редактировать
                                                    </a>

                                                    <a href="" className={'btn btn-secondary--new shadow--none'} onClick={e => { e.preventDefault(); this.triggerData('onLoadingUsers', $test) }}>
                                                        {/*<span className="material-icons align-text-top mr-1 md-18">people</span>*/}
                                                        Результаты
                                                    </a>
                                                </React.Fragment> : ''}
                                            </div>
                                        </div>
                                    })}
                                </div></div> : ''}
                            </div></div>
                        })
                    }

                </div>
            </div>
        )
    }
}
