import React from 'react'
import ReactDOM from 'react-dom'

import {} from './default-events'
import {} from 'materialize-css/dist/css/materialize.min.css'
import {} from './users/assets/less/index.less'

import './init-materialize'

import Application from './users/App'

import UsersWidget from './users/users-widget'
import EditorContent from './global-components/EditorContent'
import Axios from 'axios'
import API from './config/API'
class App extends React.Component 
{
    constructor () {
        super()

        this.state = {
            user: window.userData,
            app_loaded: false
        }

        this.getRole = this.getRole.bind(this)
    }

    getRole () {
        if(this.state.user) {
            return this.state.user.role > 0;
        }
        return 0;
    }

    componentDidMount () {
        Axios.get(API.host + '/api/langueges').then(response => {
            if(response.data.data) {
                let defLang = {};
    
                response.data.data.forEach(item => {
                    defLang[item.value] = item.languege;
                })
    
                window._defaultLangs = defLang;

                window.__e = EditorContent
                __e.loadAll(() => this.setState(() => ({ app_loaded: true })))
            }
        })
    }

    render () 
    {
        if(this.state.app_loaded) {
            return (
                <div className="Tsds-english" id="root-application">
                    <Application />
                    {/* <UsersWidget isAdmin={this.getRole()} /> */}
                </div>
            )
        } else return ''
    }
}

ReactDOM.render(<App />, document.getElementById('app'));