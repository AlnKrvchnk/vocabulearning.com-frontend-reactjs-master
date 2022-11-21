import React from 'react'
import Button from '../../../../../global-components/layout/Button'
import { showInpEdit, renameKeys, getCurrentUserToken, Toast, random } from '../../../../../functions'
import Axios from 'axios'
import API from '../../../../../config/API'
import {Vcheckbox} from "../../../../../global-components/layout/Inputs";

const TOKEN = getCurrentUserToken()
export default class TestsCreateUpdate extends React.Component  {
    constructor (props) {
        super (props)

        this.state = {
            q_and_a: {

            },
            default_name: '',
            active_test_id: 0
        }

        this.createQuestion = this.createQuestion.bind(this)
        this.showQuestions = this.showQuestions.bind(this)
        this.toggleValidInvalid = this.toggleValidInvalid.bind(this)
        this.createObjectQuestion = this.createObjectQuestion.bind(this)
        this.doAnswer = this.doAnswer.bind(this)
        this.formSubmit = this.formSubmit.bind(this)
        this.showWords = this.showWords.bind(this)
    }

    toggleValidInvalid (i,j, new_value = null, delete_all = false) {
        let new_state = this.state.q_and_a

        if(new_state[i]) {
            if(!new_value && j) {
                new_state[i][j] = !new_state[i][j]
            } else if(j && new_value) {
                new_state[i] = renameKeys(new_state[i], {
                    [j]: new_value
                })
            } else if (new_value) {
                new_state = renameKeys(new_state, {
                    [i]: new_value
                })
            }
        }

        if(delete_all) {
            this.setState(() => ({
                q_and_a: {},
                default_name: '',
                active_test_id: 0
            }))
            return;
        }

        this.setState(() => ({ q_and_a: new_state }))
    }

    createObjectQuestion (q_name = 'Вопрос ' + Math.floor(Math.random()*999), answers = {
        "Ответ 1": true, "Ответ 2": false,
        "Ответ 3": false, "Ответ 4": false
    }) {
        this.setState(prevState => ({ q_and_a: {
            ...prevState.q_and_a,
            [q_name]: answers
        } }))
    }

    createQuestion () {
        showInpEdit('Вопрос №1', data => {
            this.createObjectQuestion(data)
        }, 'Создание вопроса')
    }

    doAnswer (action = 'PUSH', i, j = null) {
        let new_state = this.state.q_and_a

        switch(action.toUpperCase()) {
            case 'PUSH':
                new_state[i] = {
                    ...new_state[i],
                    [`Ответ ${Math.floor(Math.random()*999)}`]: false
                }
            break;

            case 'DELETE':
                if(j !== null) {
                    if(Object.values(new_state[i]).length > 1) {
                        delete new_state[i][j]
                    } else Toast('В вопросе не может быть меньше 1 ответа', 'red')
                } else {
                    if(Object.values(new_state).length > 1) {
                        delete new_state[i]
                    } else Toast('В тесте не может быть меньше 1 вопроса', 'red')
                }
            break;
        }

        this.setState(() => ({ q_and_a: new_state }))
    }

    showWords (words) {

        return words.map((word, i) => {
            return <div key={i} className='courses-tests__create__words__item'>
                <div className={'courses-tests__create__words__btn'}>
                    <a href="" onClick={e => {e.preventDefault();
                    // генерация вопроса
                    let words_to_question = {}

                    let random_valid_question_pos = random(0,3)
                    for(let k = 0; k <= 3; k++) {
                        if(k == random_valid_question_pos)
                            words_to_question[word.word] = true
                        else
                            words_to_question[words[random(0, words.length-1)].word] = false
                    }

                    this.createObjectQuestion(word.phrase, words_to_question)

                } } className=""><span className="material-icons">add</span></a></div>
                <div className={'courses-tests__create__words__text'}>
                    {word.phrase}<br/>
                </div>
                <div className={'courses-tests__create__words__answer'}>
                    <span>Правильный ответ</span>
                    <span>{word.word}</span>
                </div>
            </div>
        })

    }

    pageReload(e) {
        e.preventDefault();
        window.location.reload(true);
    }

    showQuestions () {
        const { r_cls = 'courses-tests' } = this.props
        let all_questions = []

        let showAnswers = (i) => {
            let all_answers = []
            for(let j in this.state.q_and_a[i]) {
                const current_j = this.state.q_and_a[i][j]

                all_answers.push(<div key={j} className={'courses-tests__question__version'}>
                    <div className={'test-question'}>
                        <input autoComplete={'off'} type="text" placeholder={'Вариант ответа'} defaultValue={j} onBlur={e => {this.toggleValidInvalid(i,j,e.target.value)}} />
                    </div>
                    <div className={'test-checkbox'}>
                        <label htmlFor="">
                            {/*<input autoComplete={'off'} onChange={() => {this.toggleValidInvalid(i,j)}} defaultChecked={current_j} type="checkbox" />*/}
                            {/*<span>{current_j ? 'Верно' : 'Неверно'}</span>*/}
                            Верно
                        </label>
                        <Vcheckbox
                            name={''}
                            defaultChecked={current_j}
                            values={{
                                checked: 1,
                                unchecked: 0
                            }}
                        />
                        <label htmlFor="">
                            Неверно
                        </label>
                    </div>
                    <div className={'test-delete'}>
                        <a href="" onClick={e => {e.preventDefault(); this.doAnswer('DELETE', i, j)}} className="test-delete__button">
                            <span className="material-icons">delete_outline</span>
                            Удалить
                        </a>
                    </div>
                </div>)
            }

            return all_answers
        }

        for(let i in this.state.q_and_a) {
            all_questions.push(<div key={i} className={r_cls + '__q-item'}>
                <div className="course-tests__questionName-group">
                    <input autoComplete={'off'} type="text" placeholder={'Название вопроса'} defaultValue={i} onBlur={e => {this.toggleValidInvalid(i,null,e.target.value)}} />
                    {/* TODO - поставить количество вопросов и номер текущего */}
                    <span className={'course-tests__questionName-counter'}>Вопрос 1 из 54</span>
                </div>


                <a href="" className={'courses-tests__addAnswer__btn'} onClick={e => {e.preventDefault(); this.doAnswer('PUSH', i) }}>+ Добавить ответ</a>
                <div className={r_cls + '__a-item courses-tests__addAnswer'}>
                    {showAnswers(i)}
                </div>
                <a href="" className={"courses-tests__deleteAnswer__btn"} onClick={e => {e.preventDefault(); this.doAnswer('DELETE', i) }}>Удалить вопрос</a>
            </div>)
        }

        return all_questions
    }

    formSubmit (e) {
        e.preventDefault()

        let data = {
            name: e.target.name.value,
            q_and_a: this.state.q_and_a,
            course_id: this.props.active_course.id,
            user_id: self.userData.id
        }
        let api_action = 'create'

        if(this.props.active_test) {
            data.test_id = this.props.active_test.id
            api_action = 'update'
        }

        Axios.post(API.host + '/api/tests/' + api_action, data, {
            headers: {'Authorization': TOKEN}
        }).then(response => {
            if(response.data) {
                Toast(response.data.error_message)
            }
        })
    }


    componentWillReceiveProps (props) {
        const {
            active_test = null
        } = props

        const new_active_test_id = (active_test) ? active_test.id : null

        if(!Object.values(this.state.q_and_a).length || (new_active_test_id !== this.state.active_test_id) &&
            (active_test !== null && new_active_test_id !== null)) {

            if(active_test && new_active_test_id) {
                this.setState(() => ({
                    default_name: active_test.name,
                    q_and_a: JSON.parse(active_test.q_and_a),
                    active_test_id: new_active_test_id
                }))
            }

        }
    }

    render() {
        const { r_cls = 'courses-tests', active_course = null, active_test = null, onDeleteTest } = this.props
        const { id, name, words = [] } = active_course

        return (
            <div className={r_cls + '__create col-md-12'}>
                <h4 className="courses-tests__heading">{active_test ? 'Редактирование' : 'Создание'} теста для курса {name}</h4>
                <form onSubmit={this.formSubmit}>
                    <p>{name}</p>
                    <div className={'edit_test_name'}>
                        <input autoComplete={'off'} type="text" defaultValue={this.state.default_name} placeholder={'Название теста'} name={'name'} />
                    </div>
                    <div className="row courses-tests__create__question">
                        {words.length ? <div className="col-xl-12 col-lg-12 col-md-12 pl-0 mt-3 mb-3">
                            <h5>Создайте вопрос к тесту из изучаемых на курсе слов:</h5>
                            <div className={r_cls + '__create__words'}>
                                <div className="courses-tests__words__wrapper">
                                    {this.showWords(words)}
                                </div>
                            </div>
                        </div> : ''}

                        <div className="courses-tests__add">
                            <h5>Добавьте / отредактируйте ответы к&nbsp;вопросам для теста:</h5>
                            <div className={"mb-5"}>
                                <Button color={'97C2D1'} onChange={() => {this.createObjectQuestion()}} title={'+ Добавить вопрос к тесту'} customClass={'courses-tests__button courses-tests__button--add'} />
                            </div>
                            <div className={r_cls + '__create__questions'}>
                                {this.showQuestions()}
                            </div>
                        <div className={'courses-tests__buttons'}>
                            {Object.values(this.state.q_and_a).length ? <Button color={'#97D1C7'} customClass={'courses-tests__button courses-tests__button--create'} submit title={`${active_test ? 'Обновить' : 'Создать'} тест`} /> : ''}
                            {active_test ? <a href="" className="btn btn-danger shadow--none mr1 ml1 btn-mobile-100" onClick={e => {e.preventDefault();
                                if(confirm('Точно удалить?')) {
                                    this.toggleValidInvalid(0, 0, null, true)
                                    onDeleteTest(active_test)
                                }
                            }}>Удалить тест</a> : ''}
                            <a href={''} onClick={(e)=>{e.preventDefault(); window.location.reload(true)}} className={'courses-tests__button courses-tests__button--update'}>Обновить страницу</a>
                        </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
