import React from 'react'
import API from '../../config/API'
import Axios from 'axios'
import ChatModule from './ChatModule'
import Loader from '../layout/Loader'
import { getCurrentUserToken, Toast } from '../../functions'
import io from 'socket.io-client'
import PulseCircle from '../WidgetsComponent/Widgets'
import ChatLinkItem from './ChatLinkItem'

// Окон выбора курсов
export default class ChatWindow extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            // all courses
            courses: [],

            // chat
            users_online: {},

            // null = default
            active_course: null
        }

        this.showCourses = this.showCourses.bind(this)
        this.do_active_course = this.do_active_course.bind(this)

        // SOCKET EVENTS
        this.socketConnected = this.socketConnected.bind(this)
        this.socketDisConnected = this.socketDisConnected.bind(this)
    }

    // Установка активного курса, либо удаление
    do_active_course (active_course = null) {
        this.setState(() => ({ active_course }))
    }

    // Отображение курсов в RENDER
    showCourses () {
        if(this.state.courses.length) {
            return this.state.courses.map((item, i) => {
                return (item.course) ? <ChatLinkItem
                    class_name={this.props.r_cls + '__link'}
                    key={i}
                    href={item.course.id}
                    on_click={() => {
                        this.do_active_course(item.course)
                    }}
                    title={item.course.name}
                    pulse_circle={this.state.users_online[item.course.author_id]}
                    type='COURSES'
                /> : ''
            })
        } else {
            return <Loader />
        }
    }

    socketConnected () {
        const $USER = getCurrentUserToken(null);
        // LOAD CURRENT COURSES
        Axios.get(API.host + '/api/user/statistic', {
            headers: {
                'Authorization': $USER.token
            }
        }).then(response => {
            if(response.data.success) {
                this.setState(() => ({
                    courses: Object.values(response.data.data)
                }))

                // SOCKET EVENTS
                this.socket.emit('im_online', {
                    user_id: $USER.id || 0,
                    user_name: $USER.data.login || ''
                })

                this.socket.on('im_online', data => {
                    this.setState(() => ({ users_online: data }))
                })
        
                this.socket.on('im_chat', data => {
                    Toast('Новое сообщение: ' + data.msg, 'green')
                })

                // NOTIFICATIONS
                this.socket.on('im_chat_notify', ({ data, type }) => {
                    switch(type) {
                        case 'GET_DIALOGS':
                            if(!data.length)
                                this.socket.emit('im_chat_create_dialog', { name: 'Чат с преподавателем', course_id: this.state.active_course.id || 0, connect_user_id: this.state.active_course.author_id })
                        break;
                    }
                })

            }
        })  
    }
    
    socketDisConnected () {
        this.setState(() => ({ courses: [], active_course: null }))
    }

    componentWillReceiveProps (props) {
        if(props.active_course_id && this.state.courses.length) {
            const course = this.state.courses.filter(course => {
                if(course.course) return course.course.id == props.active_course_id
            })

            if(course.length) this.do_active_course(course[0].course || null)
        }
    }

    componentDidMount () {
        const $USER = getCurrentUserToken(null);
        // SOCKET CREATE
        const socket = io('https://vocabulearning.com', {
            query: {
                user_token: $USER.token,
                user_id: $USER.id
            }
        });
        this.socket = socket;

        this.socket.on('connect', this.socketConnected) 

        this.socket.on('disconnect', this.socketDisConnected)
        // /SOCKET CREATE
    }

    render() {
        const { r_cls, trigger_input_value } = this.props

        return (
            <div className={r_cls + '__window'}>
                {!this.state.active_course ? <div className={r_cls + '__window__courses'}>
                     {this.showCourses()}
                </div> : <ChatModule 
                    on_back={this.do_active_course}
                    r_cls={r_cls}
                    trigger_input_value={trigger_input_value}
                    socket={this.socket}
                    course={this.state.active_course}
                />}
            </div>
        )
    }
}