import React from 'react'
import TestsWidget from './components/TestsAction/TestsWidget'

export default class TestsAction extends React.Component {
    constructor () {
        super()

        this.state = {
            
        }
    }
    
    render() {
        return (
            <div className="Tsds__page Tsds__page--settings" id="settings-page">
                <h1>Тесты для курсов</h1>

                <TestsWidget 
                    is_admin_widget={true}
                />
            </div>  
        )   
    }
}