import React from 'react'
import { BrowserRouter as Router } from "react-router-dom";

import Header from './components/Header';

import RoutesComponent from './components/Routes/route-component'
import RoutePaths from './components/Routes/route-paths'

function Application () {
    return (
        <Router>
            <div className="Aba-english__application">
                <Header />
                <RoutesComponent routes={RoutePaths} /> 
            </div>
        </Router>
    )
}

export default Application;