import React from 'react'
import {} from './ChatWidgetComponent/index.less'
import ChatWindow from './ChatWidgetComponent/ChatWindow'

class ChatWidget extends React.Component {
    constructor (props) {
        super(props)

        // settings
        this.state = {
            chat_open: false,
            chat_fullscreen: false,
            chat_classes: {}
        }
        this.root_class = 'app-chat';

        this.do_cls = this.do_cls.bind(this)
        this.doChatCO = this.doChatCO.bind(this)

        // global_functions
        window._openChat = this.doChatCO
    }

    // do with cls
    do_cls (cls = '', auto_delete = false) {
        let chat_classes = this.state.chat_classes

        if(auto_delete && chat_classes[cls]) {
            delete chat_classes[cls]
        } else {
            if(!chat_classes[cls]) {
                chat_classes[cls] = true
            } else delete chat_classes[cls]
        }

        this.setState(() => ({ chat_classes }))
    } 

    // doChatCloseOpen (open or close chat widget)
    doChatCO () {
        this.setState(prevState => ({ chat__open: !prevState.chat__open }), () => {
            this.do_cls(this.root_class + '--opened')

            if(!this.state.chat__open && this.state.chat_classes[this.root_class + '--fullscreen']) {
                this.do_cls(this.root_class + '--fullscreen', true)
            }
        })
    }
    render() {
        const { active_course_id = null, trigger_input_value = '', display_btn = true } = this.props

        return (
            <div className={`${this.root_class} ${Object.getOwnPropertyNames(this.state.chat_classes).join(' ')}`}>
                {display_btn || this.state.chat__open ? <a onClick={e => { e.preventDefault(); this.doChatCO(); }} className="app-chat__open" href="">{this.state.chat__open ? 'Закрыть' : 'Открыть'} чат</a> : ''}
                
                { /** Кнопка триггера полноэкранного режиме */
                    this.state.chat__open ? <a href="" className="app-chat__fullscreen" onClick={e => {
                        e.preventDefault()
                        this.do_cls(this.root_class + '--fullscreen')
                    }}><i className="material-icons">fullscreen</i></a> : ''
                }

                <ChatWindow 
                    active_course_id={active_course_id}
                    trigger_input_value={trigger_input_value}
                    r_cls={this.root_class} 
                />
            </div>
        )
    }
}

export default ChatWidget;