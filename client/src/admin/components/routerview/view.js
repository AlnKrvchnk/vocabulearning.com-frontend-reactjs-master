import React from 'react'

import RoutesList from '../../routes/config'
import { Route } from 'react-router-dom'

export default function View () {
    return (
        <React.Fragment>
            {
                RoutesList.map(
                    ($route, i) => {
                        return <Route 
                            key={i} 
                            exact={$route.exact} 
                            component={$route.page} 
                            path={$route.path} 
                        />
                    }
                )
            }
        </React.Fragment>
    )
}