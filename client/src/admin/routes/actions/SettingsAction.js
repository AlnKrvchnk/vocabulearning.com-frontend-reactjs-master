import React from 'react'

import Button from '../../../global-components/layout/Button'

import axios from 'axios'
import API from '../../../config/API'
import TableUsers from './components/UsersAction/TableUsers'
import Loader from '../../../global-components/layout/Loader'

import { getCurrentUserToken, $API } from '../../../functions'
import { Row, Col } from '../../../global-components/layout/Bootstrap'
import LanguegesSettings from './components/SettingsAction/LanguegesSettings'

export default class SettingsAction extends React.Component {
    constructor () {
        super()

        this.state = {
            
        }
    }
    
    render() {
        return (
            <div className="Tsds__page Tsds__page--settings" id="settings-page">
                <h1>Настройки</h1>

                <Row>
                    <LanguegesSettings />   
                </Row>    
            </div>  
        )   
    }
}