import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import {} from 'materialize-css/dist/css/materialize.min.css'
import {} from './assets/less/index.less'

import './init-materialize'

import Application from './App'
class App extends React.Component 
{
    constructor () {
        super()
    }

    render () 
    {
        return (
            <div className="Aba-english" id="root-application">
                <Application />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));