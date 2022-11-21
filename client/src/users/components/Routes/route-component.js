import React from 'react'
import { Route, Routes } from 'react-router-dom'

export default class RoutesComponent extends React.Component {
    render () {
        const { routes } = this.props;

        return (
            <React.Fragment>
                <Routes>
                {routes.map((route, i) => {
                    return <Route key={i} path={route.path} exact={route.exact} 
                    element ={
                            <route.component data={route.data} {...route.props} />
                     } />
                })}</Routes>
            </React.Fragment>
        )
    }
}