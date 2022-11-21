import React from 'react';
import './index.less';

export default class ToolTip extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isButtonClicked: false,
            infoBlock: null
        }

        this.toggleInfo = this.toggleInfo.bind(this)
    }
    toggleInfo() {
        this.setState(prevState => ({
            isButtonClicked: !prevState.isButtonClicked
        }))
    }

    render() {
        const { isButtonClicked } = this.state
        const {info, icon} = this.props
        return (
            <React.Fragment>
                <div className="tooltip-block">
                    <a
                        href={""}
                        tabIndex='-1'
                        onClick={
                            (evt) => {
                                evt.preventDefault()
                                this.toggleInfo()
                            }
                        }
                        onMouseEnter={
                            (evt) => {
                                evt.preventDefault()
                                this.toggleInfo()
                            }
                        }
                        onMouseLeave={
                            (evt) => {
                                evt.preventDefault()
                                this.toggleInfo()
                            }
                        }
                    >
                        <i className="material-icons">{icon}</i>
                    </a>
                    {isButtonClicked ?
                        <div className={'infoblock'}>
                            <a tabIndex='-1'
                                href=""
                                className={'infoblock__close'}
                                onClick={(evt) => {
                                    evt.preventDefault();
                                    this.toggleInfo()
                                }}
                            >
                                <i className="material-icons">close</i>
                            </a>
                        {info}
                        </div> : ''}
                </div>
            </React.Fragment>

        )
    }
}
