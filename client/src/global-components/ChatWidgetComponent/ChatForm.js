import React from 'react'
import Button from '../layout/Button'

export default class ChatForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            input_value: ''
        }
    }

    componentWillReceiveProps (props) {
        if(props.val) {
            this.setState(() => ({ input_value: props.val }))
        }
    } 

    render() {
        const { r_cls = 'app-chat', onSub, place = 'Сообщение', btn_name = 'Отправить' } = this.props

        return (
            <form className={r_cls + '__form'} onSubmit={e => {
                e.preventDefault()
                onSub(e)
                e.target.reset()
            }}>
                <input className="materialize-textarea" defaultValue={this.state.input_value} name="message" minLength={2} placeholder={place + '...'} />
                <Button submit title={btn_name} />
            </form>
        )
    }
}