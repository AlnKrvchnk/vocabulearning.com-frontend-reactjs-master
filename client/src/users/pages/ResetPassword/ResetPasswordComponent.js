import React from 'react'
import Input from '../../../global-components/layout/Input';
import Button from '../../../global-components/layout/Button';

import './index.less'
import Axios from 'axios';
import API from '../../../config/API';
import { Toast } from '../../../functions';

export default class ResetPassword extends React.Component {
    constructor () {
        super()

        this.state = {
            formOpen: false,
            email_data: ''
        }

        this.openForm = this.openForm.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    changeInput (data) {
        this.setState(() => ({ email_data: data }))
    }

    openForm () {
        this.setState(prevState => ({
            formOpen: !prevState.formOpen
        }))
    }

    submitForm () {
        const { email_data } = this.state

        if(email_data != '' && email_data.length > 5) {
            Axios.get(API.host + '/auth/reset/pass/' + email_data).then(response => {
                if(response.data) {
                    const data = response.data;
                    
                    Toast(data.error_message, (data.success) ? 'green' : 'red')
                }
            })
        }
    }

    render() {
        const { formOpen } = this.state

        return (
            <div className="resetpassword-component row">
                <p>Забыли пароль? <a href="" onClick={e => { e.preventDefault(); this.openForm(); }}>Восстановить {formOpen ? '-' : '+'}</a></p>
                
                {formOpen ? <div className="resetpassword-component__inputs">
                    <Input onChange={this.changeInput} label={'Ваш E-mail...'} name={'email_checking'} />
                    <a onClick={e => {
                        e.preventDefault();
                        this.submitForm();
                    }} className="resetpassword-component__link" href=""><i className="material-icons">update</i></a>
                </div> : ''}
            </div>
        )
    }
}