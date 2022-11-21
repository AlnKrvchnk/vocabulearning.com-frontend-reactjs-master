import React, { Component } from 'react';
import './index.less';
import { clearInput } from '../../../functions';

export default class InputToggler extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isButtonClicked: false,
            enableClose: false
        }
        this.toggleDisabledInput = this.toggleDisabledInput.bind(this);
    }

    toggleDisabledInput (evt, element, attr) {
        const targetInput = document.querySelector(`${element}[id=${attr}]`);
        if (!targetInput.getAttribute(`disabled`)) {
            targetInput.setAttribute('disabled', 'true');
            this.setState(() => ({ enableClose: false }))
        } else {
            targetInput.removeAttribute(`disabled`);
            this.setState(() => ({ enableClose: true }))
        }
    }


    render() {
        const {element, selector} = this.props
        return (
            <div className="course-edit__clear">
                <a href="" onClick={(evt) =>
                    {
                        evt.preventDefault();
                        this.toggleDisabledInput(evt, element,  selector)}
                }
                   title={'Нажмите для перевода поля в активное состояние'}
                >
                    <img src="/img/icons/modal-author-item-edit-button.svg" alt={""}/>
                </a>
                {/* TODO Поставить крестик когда нажата кнопка редактирования и убран Disabled */}
                {
                    this.state.enableClose ? <a href="" onClick={(evt)=>{evt.preventDefault(); clearInput(`${element}[name=${selector}]`)}}><img src="/img/icons/modal-author-item-close-button.svg" alt={""} /></a> : ''
                }

            </div>
        )
    }
}
