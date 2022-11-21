import React from 'react'
import ReactDOM from 'react-dom'
import {} from 'materialize-css/dist/css/materialize.min.css'
import {} from './admin/assets/less/index.less'
import EditorContent from './global-components/EditorContent' 

import './init-materialize'

import Application from './admin/App'
import { $API } from './functions'
class App extends React.Component 
{
    constructor () {
        super()

        this.state = {
            app_loaded: false
        }
    }

    componentDidMount () {
        window.__e = EditorContent
        // получение пользователя и его роли
        $API.getUser(data => {
            let currentRole = 0;
            if(data.success) {
                currentRole = data.data.role;
            }
            window.__user_role = currentRole;
            
            __e.loadAll(() => this.setState(() => ({ app_loaded: true })))
        })
    }

    render () 
    {
        return (
            <div className="Tsds__admin wrapper" id="root-application">
                {this.state.app_loaded ? <Application /> : ''}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));