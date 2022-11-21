import React from 'react'
import API from '../../../../../../config/API'
import Axios from 'axios'
import {} from './index.less'
import { getFullDate, getCurrentUserToken } from '../../../../../../functions'

export default class TestQuiz extends React.Component {
    constructor (props) {
        super(props)

        this.default_statistic_obj = {
            date_start: getFullDate(),
            invalid_answers: 0,
            valid_answers: 0,
        }
        
        this.state = {
            current_question: {
                title: '',
                answers: {}, 
                index: 0
            },

            current_test: {
                name: '...'
            },

            sliding_class: '',
            statistic: this.default_statistic_obj,
            is_end_test: false
        }
        // REFS
        this.$form = React.createRef()

        // ACTIONS
        this.toggleSlideNext = this.toggleSlideNext.bind(this)
        this.saveResults = this.saveResults.bind(this)
        this.plusStatisticItem = this.plusStatisticItem.bind(this)
        this.checkAnswerValid = this.checkAnswerValid.bind(this)
        this.loadTest = this.loadTest.bind(this)
    }

    saveResults () {
        const { date_start, invalid_answers, valid_answers } = this.state.statistic
        const len_answers = Object.keys(this.state.current_test.q_and_a).length

        let q_and_a = {
            date_start,
            date_end: getFullDate(),
            invalid_answers: `${invalid_answers} / ${len_answers}`,
            valid_answers: `${valid_answers} / ${len_answers}`,
            test_has_finished: `${Math.floor(valid_answers/len_answers*100)}%`
        }

        this.setState(() => ({
            is_end_test: true,
            statistic: q_and_a
        }), () => {
            const user_id = getCurrentUserToken('id'),
                course_id = this.props.course_id,
                test_id = this.props.test_id,
                TOKEN = getCurrentUserToken()

            Axios.post(API.host + '/api/tests/all/save-results', {
                user_id, course_id, test_id,
                q_and_a
            }, { headers: {'Authorization': TOKEN} })
        })
    }

    plusStatisticItem (prop = 'invalid_answers', cb) {
        this.setState(prevState => ({
            statistic: {
                ...prevState.statistic,
                [prop]: prevState.statistic[prop] += 1
            }
        }), cb)
    }

    toggleSlideNext () {
        let sliding_class = (this.state.sliding_class == '') ? 'sliding' : ''

        this.setState(() => ({ sliding_class }))
    }

    checkAnswerValid (item = '', cb) {
        if(this.state.current_question.answers[item]) 
            this.plusStatisticItem('valid_answers', cb) 
        else 
            this.plusStatisticItem('invalid_answers', cb)
    }

    doAnswer (action = 'NEXT', item, item_index) {
        let { index, answers } = this.state.current_question
        let current_test_qa = Object.keys(this.state.current_test.q_and_a)

        switch(action.toUpperCase()) {
            case 'NEXT':
                if(index < current_test_qa.length && current_test_qa.length-1 !== index) {
                    this.checkAnswerValid(item)

                    index++
                    this.setState(() => ({
                        current_question: {
                            title: current_test_qa[index],
                            answers: this.state.current_test.q_and_a[current_test_qa[index]],
                            index
                        }
                    }), () => {
                        this.toggleSlideNext()
                        setTimeout(() => { 
                            this.$form.current.reset()
                            this.toggleSlideNext()
                        }, 400)
                    })
                } else {
                    this.checkAnswerValid(item, this.saveResults)
                }
            break;
        }
    }

    loadTest (
        test_id = this.props.test_id,
        course_id = this.props.course_id
    ) {
        Axios.post(API.host + '/api/tests/all/', {
            test_id,
            course_id
        }).then(response => {
            const data = response.data
            if(data.success) {
                let test = data.tests[0]
                    test.q_and_a = JSON.parse(test.q_and_a)
                let default_index = 0

                let first_q = Object.keys(test.q_and_a)[default_index]

                this.setState(() => ({ current_test: test, is_end_test: false, statistic: this.default_statistic_obj, current_question: {
                    title: first_q,
                    answers: test.q_and_a[first_q],
                    index: default_index
                }}))
            }
        })
    }

    componentWillReceiveProps (props) {
        const { test_id, course_id } = props

        this.loadTest(test_id, course_id)
    }

    componentDidMount () {
        this.loadTest()
    }

    render() {
        const { r_cls = 'app-quiz' } = this.props

        const { title, answers } = this.state.current_question
        const statistic = this.state.statistic

        return (
            <div className={r_cls}>
                <h4>{this.state.current_test.name} <span className="new badge blue">Тест курса</span></h4>
                {!this.state.is_end_test ? <div className={r_cls + '__answers ' + this.state.sliding_class}>
                    <div className={r_cls + '__title'}>{title}</div>
                    <form ref={this.$form}>
                        {Object.keys(answers).map((item, i) => {
                            return <label className={r_cls + '__q-item'} key={i}>
                                <input onInput={() => this.doAnswer('NEXT', item, i)} name={'app-quiz-field'} defaultChecked={false} type="radio" />
                                <span>{item}</span>
                            </label>
                        })}
                    </form>
                </div> : <p className={r_cls + '__results'}>
                    <span>Результаты:</span><br/>
                    Дата начала - {statistic.date_start}<br/>
                    Дата завершения - {statistic.date_end}<br/>
                    Неверные ответы - {statistic.invalid_answers}<br/>
                    Верные ответы - {statistic.valid_answers}<br/>
                    <b>Тест пройден на {statistic.test_has_finished}</b>
                </p>}
            </div>
        )
    }
}