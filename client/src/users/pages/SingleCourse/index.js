import React from 'react'
import Lesson from './components/Lesson'
import LessonProgress from './components/LessonProgress'
import LessonContainer from './components/LessonContainer'

import ChatWidget from '../../../global-components/ChatWidget'
import M from 'materialize-css'
import Axios from 'axios';
import API from '../../../config/API';
import { $liveSession, localSave, getLocal, getCurrentUserToken, Toast } from '../../../functions'
import Button from '../../../global-components/layout/Button'
import { Link } from 'react-router-dom'
import Modal from '../../../global-components/layout/Modal'
import PaymentWidget from '../../../global-components/Payment/PaymentWidget'

export class DisplayCourse extends React.Component {
    constructor (props) {
        super(props)

        this.defaultState = {
            currentLesson: 0,
            progressBarIndex: 0,
            custom_user_anotation: {},
            course: props.info,
            minusIndex: false,
            counter_words_move: {
                valid: 0,
                notvalid: 0
            },
            isRandomtest: false,

            // Подписка
            error_subscribe: false,

            // Типы обучения
            type_studies: [
                {value: 1, title: 'Перевод и слово'},
                {value: 2, title: 'Аудио слова'},
                {value: 3, title: 'Аудио фразы'}
            ],
            type_study: null
        }

        this.state = Object.assign(this.props.info, this.defaultState)

        this.defaultCourseWordsLength = this.state.course.words.length;

        this.getCurrentLesson = this.getCurrentLesson.bind(this)
        this.moveLesson = this.moveLesson.bind(this)
        this.changeCurrentLesson = this.changeCurrentLesson.bind(this)
        this.appendWord = this.appendWord.bind(this)
        this.checkingNextWord = this.checkingNextWord.bind(this)
        this.createNewWord = this.createNewWord.bind(this)
        this.loadPrevSession = this.loadPrevSession.bind(this)
        this.onUpdateTypeStudy = this.onUpdateTypeStudy.bind(this)
        this.checkIsRandomTest = this.checkIsRandomTest.bind(this)

        // Подписка
        this.subscribeOnCourse = this.subscribeOnCourse.bind(this)
    }

    /**
     * Type = NUMBER
     */
    onUpdateTypeStudy (type_study = 0) {
        if(!isNaN(type_study)) {
            this.setState(() => ({ type_study }))
        }
    }

    getCurrentLesson (index) {
        const { currentLesson } = this.state;
        const { words } = this.state.course;
        let defaultWord = words[currentLesson];

        if(words[index]) {
            defaultWord = words[index]
        }

        return defaultWord;
    }

    checkIsRandomTest (randomTest) {
        this.setState({
            isRandomTest: randomTest
        })
    }

    createNewWord (word, isPushing = true) {
        let newWords = this.state.course.words;
        let currentLessonIndex = this.state.currentLesson;
        let wordsFromIndex = [];
        let wordsToIndex = [];

        // добавляем слова к массиву до активного слова
        for(let i = 0; i <= currentLessonIndex; i++) {
            wordsFromIndex.push(newWords[i])
        }
        // добавляем слова к массиву после активного слова
        for(let j = currentLessonIndex+1; j < newWords.length; j++) {
            wordsToIndex.push(newWords[j])
        }
        // сортируем слова по рандому

        if(isPushing) {
            wordsToIndex.push(word)
        }

        function shuffle(arr){
            let k, temp;
            for(let i = arr.length - 1; i > 0; i--){
                k = Math.floor(Math.random()*(i + 1));
                temp = arr[k];
                arr[k] = arr[i];
                arr[i] = temp;
            }
            return arr;
        }

        wordsToIndex = shuffle(wordsToIndex)

        let checkerIteration = 0;
        function checkNextWord () {
            checkerIteration++;
            try {
                if(wordsFromIndex[currentLessonIndex].id == wordsToIndex[0].id) {
                    wordsToIndex = shuffle(wordsToIndex)
                    checkNextWord()

                    if(checkerIteration > 100) return;
                } else {
                    return;
                }
            } catch(e) {}
        }
        checkNextWord()

        // создаем массив результата
        let resultArray = [...wordsFromIndex, ...wordsToIndex]

        this.setState(prevState => ({
            course: {
                ...prevState.course,
                words: resultArray
            }
        }))
    }

    checkingNextWord (word) {
        this.createNewWord(word, false)
    }

    appendWord (word) {
        this.createNewWord(word)
    }

    changeCurrentLesson (moveIndex, isEnd) {
        const { currentLesson, course } = this.state;
        const lessons = course.words;
        let newLessonIndex = currentLesson;
        let progressBarIndex = currentLesson;

        // как фраза изменилась (верно или не верно)
        const counter_words_param = (moveIndex < 0) ? 'notvalid' : 'valid'
        // счетчик изменения позиции фраз
        let counter_words_move = this.state.counter_words_move[counter_words_param]
            counter_words_move += 1

        if(moveIndex < 0) counter_words_move += window.invalid_word_counter

        this.setState(prevState => ({ counter_words_move: {
            ...prevState.counter_words_move,
            [counter_words_param]: counter_words_move
        } }))

        // если шаг является назад, но он уже был сделан - останавливаем функцию
        if(moveIndex < 0 && this.state.minusIndex) return;

        if(moveIndex < 0) {
            this.setState(() => ({
                minusIndex: true
            }))
        } else {
            this.setState(() => ({
                minusIndex: false
            }))
        }

        if(currentLesson + moveIndex > lessons.length-1) {
            newLessonIndex = lessons.length-1;
            progressBarIndex = newLessonIndex+1;

            if(isEnd) {
                this.setState(() => ({
                    progressBarIndex: 0,
                    currentLesson: 0,
                }));

                M.toast({ html: 'Поздравляем! Вы прошли курс ' + this.props.info.name, classes: 'blue' })
            }
        } else {
            newLessonIndex += moveIndex;
            progressBarIndex = newLessonIndex;
        }

        if(newLessonIndex < 0) {
            newLessonIndex = 0;
            progressBarIndex = newLessonIndex;
        }

        if(!isEnd) {
            this.setState(() => ({
                currentLesson: newLessonIndex,
                progressBarIndex
            }))
        }
    }

    loadPrevSession () {
        const user_id = getCurrentUserToken('id')
        const { head_id = 0 } = this.props
        const session_name = 'arc_course_' + this.state.course.id + '_' + head_id + '_' + user_id;
        let session_save = getLocal(session_name),
            current_word_index = 0

        if(session_save) {
            session_save = JSON.parse(session_save)

            if(session_save.currentWord) {
                current_word_index = this.state.course.words.findIndex(x => x.id == session_save.currentWord.id)
            }

            this.setState(() => ({
                currentLesson: current_word_index,
                progressBarIndex: session_save.progressBarIndex
            }))
        }
    }

    componentDidMount () {
        window.invalid_word_counter = 0;
        const { head_id = 0 } = this.props
        const user_subscribed = this.state.course.user_subscribed
        const check_domain = (location.host == API.hosts[0] || location.host == API.hosts[1] || location.host == 'localhost:3000') ? true : false;
        // проверяем, домен основной или нет
        if(!check_domain) {
            history.pushState('/','/','/');
        }

        if(window.userData && user_subscribed) {
            if(window.userData.id) {
                Axios.get(API.host + `/api/word-anotation-register/${userData.id}/${this.state.id}`).then(response => {
                    if(response.data) {
                        const data = response.data;
                        let dataObject = {};

                        data.data.forEach(item => {
                            dataObject[item.word_id] = item;
                        });
                        this.setState(() => ({
                            custom_user_anotation: dataObject
                        }))
                    }
                })
            }
        }

        // Загружаем предыдущую сохраненную сессию
        this.loadPrevSession()

        // Загружаем LIVE SESSION проверку
        let session_stat = {
            start_date: new Date(),
            cd () {
                return new Date()
            },
            sum () {
                const calc_date = session_stat.cd() - session_stat.start_date,
                    seconds = Math.ceil(calc_date/1000),
                    minutes = Math.ceil(seconds/60),
                    hours = Math.ceil(minutes/60),
                    days = Math.ceil(hours/24)

                return { seconds, minutes, hours, days }
            }
        }


        // Если пользователь подписан на курс
        if(user_subscribed) {
            $liveSession(location.pathname, (vp) => {
                // Сохраняем текущую фразу, на которой остался пользователь
                const { currentLesson, progressBarIndex } = this.state
                const currentWord = this.getCurrentLesson( currentLesson )

                const data = {
                    course_id: this.state.course.id,
                    currentWord,
                    currentLesson,
                    progressBarIndex
                }

                if(!vp) {
                    /**
                     * FULL_STATISTIC
                     * Сбор статистических данных
                     */
                    const FULL_STATISTIC = {
                        date: {
                            // сколько времени работал в последнюю сессию
                            result: session_stat.sum(),
                            start: session_stat.start_date,
                            // когда была последняя сессия
                            end: new Date(),
                            // общее время активности на курсе
                            start_and_end: { seconds: 0, minutes: 0, hours: 0, days: 0 }
                        },
                        // сколько слов поменяло позицию
                        counter_words_move: this.state.counter_words_move,
                        ...data
                    }

                    // Сохраняем данные в статистику пользователя
                    Axios.post(API.host + '/api/user/statistic', {
                        data: FULL_STATISTIC
                    }, {
                        headers: {'Authorization': getCurrentUserToken()}
                    })

                    const user_id = getCurrentUserToken('id')

                    localSave(`arc_course_${data.course_id}_${head_id}_${user_id}`, JSON.stringify(data))
                }
            })
        }
    }

    moveLesson (action, type, isEnd) {
        this.changeCurrentLesson(action, isEnd);
    }

    subscribeOnCourse (course_id, is_user_registered) {
        // Если пользователь авторизован
        if (is_user_registered) {
            Axios.post(API.host + '/api/subscribe/' + course_id, {}, {
                headers: {'Authorization': getCurrentUserToken()}
            }).then(data => {
                if(data.data) {
                    const response = data.data
                    Toast(response.error_message, response.success ? 'green' : 'red')
                    location.reload()
                }
            })
        } else this.setState(() => ({ error_subscribe: true }))
    }

    render () {
        const { currentLesson, progressBarIndex, error_subscribe } = this.state;
        const { id, name, words, def_audio_success, def_audio_wrong, user_subscribed, price } = this.state.course;
        const is_user_registered = (getCurrentUserToken() && self.userData)

        // Если пользователь не подписан
        if(!user_subscribed) {
            return (
                <LessonContainer id={id}>
                    <h1>Подпишитесь на курс, чтобы начать обучение</h1>
                    <form onSubmit={e => {
                        e.preventDefault()
                        this.subscribeOnCourse(id, is_user_registered)
                    }} className="text-center Tsds-english__subscribe">
                        <Button title={'Подписаться и начать обучение'} submit />

                        {error_subscribe ? <p>Для того, чтобы подписаться - <Link to="/auth">авторизуйтесь</Link> или <Link to="/register">зарегистрируйтесь</Link> на портале</p> : ''}
                    </form>
                </LessonContainer>
            )
        }

        const lesson = this.getCurrentLesson(currentLesson);
        const countLessons = words.length;
        let lessonObject = {};

        if(lesson !== undefined) {
            lessonObject = {
                audio_phrase: lesson.audio_phrase || def_audio_success,
                audio_word: lesson.audio_word || def_audio_wrong,
                association: lesson.association,
                association_image: lesson.association_image,
                id: lesson.id,
                explanation: lesson.explanation,
                explanation_second: lesson.explanation_second,
                phrase: lesson.phrase,
                word: lesson.word,
                morph_priz: lesson.morph_priz,
                indicator: lesson.indicator,
                explanation_word: lesson.explanation_word,
                course_id: id,
                custom_user_anotation: this.state.custom_user_anotation,
                etymology: lesson.etymology
            }
        }

        return (
           <React.Fragment>
               {
                   (lesson) ?
                    <LessonContainer id={id}>
                        <Lesson {...lessonObject}
                            currentLesson={progressBarIndex}
                            countLessons={countLessons}
                            onChangeLesson={this.moveLesson}
                            onFailWord={this.appendWord}
                            currentCourse={this.state.course}
                            onSuccessWord={this.checkingNextWord}
                            type_study={this.state.type_study}
                            currentHead={this.props.currentHead}
                            words={words}
                            onUpdateTypeStudy={this.onUpdateTypeStudy}
                            type_studies={this.state.type_studies}
                            active_type_study={this.state.type_study}
                            checkRandomTest={this.checkIsRandomTest}
                        />
                        {
                            !this.state.isRandomTest ?
                                <LessonProgress countLessons={this.defaultCourseWordsLength} currentLesson={progressBarIndex} />
                            :
                                ``
                        }


                        <Modal modalClass={'payment-course'} data={{
                            price,
                            periods_type: 'months',
                            productId: id,
                            descr: name,
                            title: `Заказ: "${name}"`
                        }} content={PaymentWidget} />

                        <ChatWidget display_btn={false} trigger_input_value={lesson.phrase} active_course_id={id} />

                    </LessonContainer> : <h3>Курс находится в стадии разработки!</h3>
               }
           </React.Fragment>
        )
    }
}
