import React from 'react'

import ModuleItem from './Modules-Item'

export default class CoursesModules extends React.Component {
    constructor (props) {  
        super(props)
    }

    render () {
        return (
            <div className="row Tsds__modules">
                {
                    this.props.list.map(
                        ($module, i) => {
                            return <ModuleItem
                                key={i}
                                index={i}
                                id={$module.id}
                                name={$module.name}
                                description={$module.description}
                                url={$module.url}
                                author={$module.author}
                            />
                        }    
                    )
                }
            </div>
        )
    }
}