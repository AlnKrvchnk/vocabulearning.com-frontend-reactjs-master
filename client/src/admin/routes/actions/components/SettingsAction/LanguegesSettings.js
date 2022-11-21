import React from 'react'
import { Col } from '../../../../../global-components/layout/Bootstrap'
import Axios from 'axios'
import API from '../../../../../config/API'
import Loader from '../../../../../global-components/layout/Loader'
import TextInput from '../../../../../global-components/TextInput'
import Button from '../../../../../global-components/layout/Button'
import { Toast, getCurrentUserToken } from '../../../../../functions'

const TOKEN = getCurrentUserToken();

export default class LanguegesSettings extends React.Component {
    constructor () {
        super()

        this.state = {
            langueges: []
        }

        this.loadLangs = this.loadLangs.bind(this);
        this.addLanguege = this.addLanguege.bind(this);
    }

    addLanguege (languege, value) {
        if(value.match(/[A-z]/g) !== null) {
            Axios.post(API.host + '/api/langueges', {
                languege, value
            }, {
                headers: {
                    'Authorization': TOKEN
                }
            }).then(response => {
                if(response.data) {
                    if(response.data.success) {
                        this.loadLangs();
                    }

                    Toast(response.data.error_message, (response.data.success) ? 'green' : 'red')
                }
            })
        } else {
            Toast('Краткое название языка должно быть на англ!', 'red');
        }
    }

    loadLangs () {
        Axios.get(API.host + '/api/langueges').then(response => {
            if(response.data) {
                const data = response.data.data;
                
                this.setState(() => ({
                    langueges: data
                }))
            }
        });
    }

    componentDidMount () {
        this.loadLangs();
    }   

    render() {
        const { langueges } = this.state;

        return (
            <Col col='m4'>
                <h5>Языки</h5>
                {TOKEN ? <form onSubmit={e => {
                    e.preventDefault();
                    this.addLanguege(e.target.languege.value, e.target.value.value)
                }}>
                    <TextInput name={'languege'} required={true} val={''} placeholder={'Название языка'} />
                    <TextInput name={'value'} required={true} val={''} placeholder={'Кратко'} />
                    <Button color={'blue'} submit title={'Добавить язык'} />
                </form> : ''}
                
                <div className="auto-scroll">
                    {langueges.length > 0 ? <table>
                        <thead>
                            <tr>
                                <th>Язык</th>
                                <th>Кратко (англ)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {langueges.map((lang, i) => {
                                return <tr key={i}>
                                    <td>{lang.languege}</td>
                                    <td>{lang.value}</td>
                                </tr>
                            })}
                        </tbody>
                    </table> : <Loader />}
                </div>
            </Col> 
        )   
    }
}