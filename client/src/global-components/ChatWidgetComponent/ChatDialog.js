import React from 'react'
import ChatMessage from './ChatMessage'
import ChatForm from './ChatForm'
import { Toast } from '../../functions'

export default class ChatDialog extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            messages: []
        }

        this.sendMessage = this.sendMessage.bind(this)
    }

    // Отправка сообщения
    sendMessage (e) {
        e.preventDefault()

        const message = e.target.message.value

        if (this.props.socket && this.props.course && message.length >= 2) {
            this.props.socket.emit('im_chat_create_message', {
                to_id: this.props.course.author_id,
                msg: message,
                dialog_id: this.props.dialog.id,
                course_id: this.props.course.id
            })
        }
    }
    

    componentDidMount () {
        const { socket, dialog, r_cls } = this.props
        // Загрузка сообщений по данному диалогу
        socket.emit('im_chat_get_messages', { dialog_id: dialog.id })
        socket.on('im_chat_get_messages', data => {
            const last_el = data[data.length-1]
            Toast('Новое сообщение от '+last_el.login+' "'+dialog.name+'": ' + last_el.data, 'green')

            this.setState(() => ({ messages: data }), () => {
                $(`.${r_cls}__messages`).scrollTop(
                    $(`.${r_cls}__message`).length*500
                );
            })
        })
    }

    render() {
        const { dialog, r_cls } = this.props
        
        return (
            <div className={r_cls + '__chat'}>
                <div className={r_cls + '__messages'}>
                    {this.state.messages.map((message, i) => {
                        return <ChatMessage 
                            msg={message.data} 
                            login={message.login} 
                            date={message.date} 
                            key={i}
                            r_cls={r_cls}
                        />
                    })}
                </div>
                
                <ChatForm onSub={this.sendMessage} />
            </div>
        )
    }
}