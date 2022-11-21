import React from 'react'

export default class AnotationPhrase extends React.Component {
    constructor (props) {
        super(props)
    }

    render() {
        return (
            <div className="app-tabs app-tabs--small">
                <div className="app-tabs__body">
                    {this.props.data}
                </div>
            </div>
        )
    }
}