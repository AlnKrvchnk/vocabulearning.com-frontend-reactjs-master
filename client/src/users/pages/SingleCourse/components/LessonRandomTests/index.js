import React from 'react'
import { random } from '../../../../../functions'
import Button from '../../../../../global-components/layout/Button'
import Styles from './index.less'

export default class LessonRandomTests extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            currentQuestion: 0,
            tests: [],
            history: [],
            disabledAllBtns: false
        }

        this.initRandomTests = this.initRandomTests.bind(this)
        this.changeAnswer = this.changeAnswer.bind(this)
        this.renderResults = this.renderResults.bind(this)
        this.nextAnswer = this.nextAnswer.bind(this)
        this.getValidAnswer = this.getValidAnswer.bind(this)
    }

    // Показ результатов
    renderResults () {
        const { tests, history } = this.state

        let validResults = history.filter(item => item.valid)

        return <p>
            Верных ответов: {validResults.length}/{tests.length}
        </p>
    }

    // Показать сообщение
    renderMessage (msg, withTimeOut = false, cb = null) {
        this.setState(() => ({
            message: msg,
            disabledAllBtns: withTimeOut
        }), () => {
            if(withTimeOut) setTimeout(() => {
                if(cb) cb()
            }, 1000)
        })
    }

    // Next change
    nextAnswer () {
        this.setState(prevState => ({
            currentQuestion: prevState.currentQuestion+1,
            history: [
                ...prevState.history,
                prevState.newHistoryItem
            ],
            newHistoryItem: {}
        }), () => {
            this.renderMessage('')
        })
    }

    getValidAnswer (answers) {
        return answers.filter(item => item.valid)[0]
    }

    // Смена вопроса
    changeAnswer (i = 0, valid = false, name, answers) {
        const { currentQuestion, tests } = this.state

        let VALID_ANSWER = this.getValidAnswer(answers)

        if(currentQuestion < tests.length) {
            if(valid) {
                this.renderMessage(
                    <div className={'random-test__correct'}>
                        <div className={'random-test__wrapper'}>
                            <div className={'random-test__check'}>
                                <img src="../img/icons/icon-check-correct.svg" alt=""/>
                                <div className="random-test__check__text">
                                    <p>Правильный ответ</p>
                                    <p className={'random-test__correctWord'}>{VALID_ANSWER.name}</p>
                                </div>
                                <hr />
                                <div className="random-test__check__association random-test__check__association--success">
                                    <p>Перевод</p>
                                    <div className="random-test__association__text">
                                        {VALID_ANSWER.association}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>, true, () => {
                    this.setState(() => ({
                        newHistoryItem: {i, valid}
                    }))
                })
            } else {
                this.renderMessage(
                    <div className={'random-test__wrong'}>
                        <div className={'random-test__wrapper'}>
                            <div className={'random-test__check'}>
                                <img src="../img/icons/icon-check-wrong.svg" alt=""/>
                                <div className="random-test__check__text">
                                    <p className="random-test__wrongWord">Неправильный ответ.</p>
                                    <p className={'random-test__correctWord'}>Правильный ответ - "{VALID_ANSWER.name}"</p>
                                </div>
                                <hr />
                                <div className="random-test__check__association random-test__check__association--wrong">
                                    <p>Перевод</p>
                                    <div className="random-test__association__text">
                                        {VALID_ANSWER.association}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>, true)
            }
        }
    }

    // Инициализация тестов по списку слов WORDS
    initRandomTests (words) {
        words = words.map((item, i) => {

            let currentAnswers = {}
            let answers = words
                .filter(word => {
                    if(!currentAnswers[word.id] && word.id !== item.id) {
                        currentAnswers[word.id] = true;
                        return true;
                    }

                    return false;
                })
                .sort(() => Math.random() - 0.5)
                .slice(0,4)

            answers.splice(random(0, answers.length-1), 1, item)
            answers = answers.map(answer => {
                return {
                    name: answer.explanation_second,
                    association: answer.association,
                    valid: item.id === answer.id
                }
            })

            return {
                question: item.word,
                answers
            }
        })

        this.setState(() => ({ tests: words }))
    }

    componentDidMount () {
        this.initRandomTests(this.props.words)
        const checkRandomTest = this.props.checkRandomTest;
        checkRandomTest(true);
    }

    componentWillUnmount() {
        const checkRandomTest = this.props.checkRandomTest;
        checkRandomTest(false);
    }

    render() {
        const { words } = this.props
        const { tests, history, currentQuestion, message } = this.state
        const CURRENT_Q = this.state.tests[this.state.currentQuestion]

        // Показываем результат
        if(history.length === tests.length && history.length != 0) {
            return (
                <div className={Styles.randomTests}>
                    <h3>Результат</h3>

                    <div>{this.renderResults()}</div>
                </div>
            )
        }

        // Если нету слов или текущего вопроса, скрываем
        if(!words.length || !CURRENT_Q) return 'Не найдено слов или тестов...'

        return (
            <div className={'random-test'}>
                <div className="random-test__top">
                    {message}
                </div>
                <div className="random-test__middle">
                    <div className="random-test__quantity">
                        <p>{currentQuestion + 1} / {tests.length}</p>
                    </div>
                    <div className="random-test__message">
                        <div className={'random-test__question'}>{CURRENT_Q.question}</div>
                        <p>Выберите правильный вариант ниже <img src="../img/icons/curve-arrow.svg" alt=""/></p>
                    </div>
                    <div className="random-test__answers">
                        {CURRENT_Q.answers.map((item, i) => {
                            let custom_cls = ''

                            // Проверяем клик и валидный элемент
                            if(this.state.disabledAllBtns)
                                if(this.getValidAnswer(CURRENT_Q.answers) === item)
                                    custom_cls = 'disabled btn-success'
                                else
                                    custom_cls = 'disabled btn-danger'

                            return <Button key={i}
                                           color={'#707070'}
                                           customClass={'random-test__btn ' + custom_cls}
                                           onChange={() => this.changeAnswer(currentQuestion, item.valid, item.name, CURRENT_Q.answers)}
                                           title={item.name} />
                        })}
                    </div>
                    <div className="random-test__next">
                        {this.state.disabledAllBtns ? <Button color={'transparent'} customClass={'random-test__nextBtn'} onChange={() => this.nextAnswer()} title={'Дальше'} /> :''}
                    </div>
                </div>
            </div>
        )
    }
}
