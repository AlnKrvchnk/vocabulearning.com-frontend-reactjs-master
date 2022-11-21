import React from 'react'
import { randomNumbers } from '../../functions'

import DropdownItem from './Dropdown/Item'

export default class Dropdown extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            title: props.title
        }

        this.changeTitle = this.changeTitle.bind(this)
    }

    changeTitle (newTitle) {
        this.setState(() => ({
            title: newTitle
        }))

        if(this.props.onChange) {
            this.props.onChange(newTitle);
        }
    }

    render () {
        const dropdownId = 'dropdown_' + randomNumbers();
        let localData = null;

        if(this.props.local) {
            localData = localStorage.getItem(this.props.local);
        }

        return (
            <React.Fragment>
                <ul id={dropdownId} className="dropdown-content">
                    {
                        this.props.items.map(($item, i) => {
                            return <DropdownItem key={i} onChange={this.changeTitle} title={$item} />
                        })
                    }
                </ul>
                <a className="dropdown-trigger Tsds-english__dropdown" href="#" data-target={dropdownId} onClick={(evt) => {evt.preventDefault(); console.log(evt.target.parentNode)}}>
                    <img src="img/icons/icon-russian.svg" />
                </a>
            </React.Fragment>
        )
    }
}
