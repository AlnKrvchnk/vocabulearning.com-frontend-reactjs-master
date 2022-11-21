import React from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import Header from './components/Header'
import Footer from './components/Footer'
import RoutesComponent from './components/Routes/route-component'
import RoutePaths from './components/Routes/route-paths'
import { getCurrentUserToken } from '../functions';
import AuthChecker from './components/AuthChecker/AuthChecker';
import LeftProfile from './components/LeftProfile/LeftProfile';

if(location.protocol === 'http:' && location.hostname === 'vocabulearning.com') {
    location.href = 'https://' + location.hostname + '/' + location.search
}
class Application extends React.Component  {
    constructor () {
        super();
    }

    render() {
        const TOKEN = getCurrentUserToken();

        return (
            <Router>
                <div className="Tsds-english__application">
                    <Header />
                    <LeftProfile token={TOKEN} />
                    {/* <AuthChecker token={TOKEN} /> */}
    
                    <RoutesComponent routes={RoutePaths} />
                </div>
            </Router>
        )

    }
}

export default Application;