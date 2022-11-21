import React from 'react'
import jQuery from 'jquery'
import { BrowserRouter as Router } from 'react-router-dom'

import RouterView from './components/routerview/index'
import Sidebar from './components/sidebar/index';

import axios from 'axios'
import API from '../config/API';
import { fetchLangueges, getCurrentUserToken } from '../functions'

import GlobalLoader from '../global-components/layout/GlobalLoader'
import AuthChecker from '../users/components/AuthChecker/AuthChecker';

window.$ = jQuery;
window.jQuery = jQuery;
window.jquery = jQuery;

export default class Application extends React.Component {
    constructor () {
        super()

        this.state = {
            allLoaded: false,
            globalLoaderHidden: false
        }
    }

    allLibsHasLoaded () {
        setTimeout(() => {
            this.setState(() => ({ allLoaded: true }))
        }, 500)
    }

    componentDidMount () {
        fetchLangueges(data => {
            window.defaultLangueges = data

            window.userData = getCurrentUserToken(null)

            this.setState(() => ({
                globalLoaderHidden: true
            }))
            
            this.allLibsHasLoaded()
        })
    }
    render () {
        const TOKEN = getCurrentUserToken()

        return (
            <React.Fragment>
                {!this.state.allLoaded ? <GlobalLoader isHidden={this.state.globalLoaderHidden} /> :
                    <Router>
                            <AuthChecker token={TOKEN} />

                            <Sidebar />
                            <div className="content-area">
                                <div className="content-wrapper">
                                    <RouterView />
                                </div>
                            </div>
                    </Router>
                }
            </React.Fragment>
        )
    }
}