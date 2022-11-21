import React from 'react'
import Button from '../../global-components/layout/Button'
import Loader from '../layout/Loader'
import ChatLinkItem from './ChatLinkItem'
import ChatDialog from './ChatDialog'
import ChatForm from './ChatForm'
import { Toast, uniqueArrObj } from '../../functions'

// Диалоги и общение с пользователем
export default class ChatModule extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            dialogs: [],

            active_dialog: null,
            active_filter_user: null,
        }

        this.showDialogs = this.showDialogs.bind(this)
        this.setActiveDialog = this.setActiveDialog.bind(this)
        this.getDialogs = this.getDialogs.bind(this)
        this.createChat = this.createChat.bind(this)
        this.filterDialogFromUser = this.filterDialogFromUser.bind(this)
    }

    setActiveDialog (data = null) {
        if(!data && this.state.active_dialog) {
            this.props.socket.emit('leave_room', { dialog_id: this.state.active_dialog.id || 0 })
        }

        this.setState(() => ({ active_dialog: data }), () => {
            if(data) this.props.socket.emit('join_room', { dialog_id: data.id })
        })
    }

    getDialogs () {
        const { socket, course } = this.props

        // Получение списка диалогов
        socket.emit('im_chat_get_dialogs', { course_id: course.id })
        socket.on('im_chat_get_dialogs', data => {
            console.log(data)
            if(data.length) this.setState(() => ({ dialogs: data }))
        })
    }

    componentDidMount () {
        this.getDialogs()
    }
    
    filterDialogFromUser (e) {
        let value = e.target.value;

        if(value == 'all') {
            value = null
        } else value = parseInt(value)

        this.setState(() => ({ active_filter_user: value }))
    }

    // Отображение диалогов
    showDialogs () {
        if(this.state.dialogs.length && !this.state.active_dialog) {
            // Загрузка диалогов
            const users_authors = uniqueArrObj(this.state.dialogs, 'login')
            const curr_u_filter = this.state.active_filter_user

            return <React.Fragment>
                <div className={this.props.r_cls + '__filter'}>
                    <select onChange={this.filterDialogFromUser} className={'browser-default'} name={'user'}>
                        <option selected={true} disabled={true}>Выберите автора чата</option>
                        <option value={'all'}>Показать все</option>
                        {users_authors.map((item, i) => {
                            return <option key={i} value={item.user_id}>{item.login}</option>
                        })}
                    </select>
                </div>
                <div className={this.props.r_cls + '__dialogs'}>
                    {
                        this.state.dialogs.map((dialog, i) => {
                            // Фильтруем активных пользователей
                            if(curr_u_filter) {
                                if(curr_u_filter !== dialog.user_id) return ''
                            }

                            // Выдаем данные на рендер
                            return <ChatLinkItem
                                title={`${dialog.name} (0)`}
                                pulse_circle={null}
                                key={i}
                                postfix={'Автор: ' + dialog.login}
                                on_click={() => {
                                    this.setActiveDialog(dialog)
                                }}
                            />
                        })
                    }
                </div>
            </React.Fragment>
        } else {
            // Загрузка ДИАЛОГА
            if(this.state.active_dialog) {
                return <ChatDialog 
                    dialog={this.state.active_dialog}
                    r_cls={this.props.r_cls}
                    socket={this.props.socket}
                    course={this.props.course}
                />
            } else return <Loader />
        }
    }

    createChat (e) {
        const chat_name = e.target.message.value;
        const { socket, course } = this.props

        if(chat_name.length >= 2) {
            socket.emit('im_chat_create_dialog', { name: chat_name, course_id: course.id || 0, connect_user_id: course.author_id })
            socket.emit('im_chat_get_dialogs', { course_id: course.id })
        }
    }

    render() {
        const { on_back, r_cls, course, trigger_input_value } = this.props
        return (
            <div data-course-id={course.id} className={r_cls + '__chat-module'}>
                {!this.state.active_dialog ? <React.Fragment>
                    <a href="" onClick={e => {e.preventDefault(); on_back(null) }}>&lt; Назад к курсам</a>
                    <h6>{course.name}</h6>
                    <p>Ваши диалоги:</p>
                    <ChatForm place={'Название чата...'} val={trigger_input_value} btn_name={'Создать чат'} onSub={this.createChat} />
                </React.Fragment> : <React.Fragment>
                    <a href="" onClick={e => {e.preventDefault(); this.setActiveDialog(null) }}>&lt; Назад к диалогам</a>    
                </React.Fragment>}

                {this.showDialogs()}
            </div>
        )
    }
}