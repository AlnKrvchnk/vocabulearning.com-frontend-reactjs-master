import React from 'react'

import { random } from '../../functions'
import {v4 as uuid} from 'uuid';

export default class Input extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            default_value: props.val || ''
        }
    }

    componentWillReceiveProps (props) {
        if(props.val && props.autoSetValue === false)
            this.setState(() => ({ default_value: props.val.trim() }))
    }

    render() {
        const { props } = this

        const typeInput       = props.type || 'text',
                name          = props.name || 'name',
                isRequire     = props.isRequire || false,
                col           = props.col || 12,
                inputId       = name + '_' + random(500, 9999) + '_' + random(500, 9999),
                inputLabel    = props.label || '',
                readonly      = props.readonly || false,
                disabled      = props.disabled || false,
                onInit        = props.onInit || false,
                onBlurring    = props.onBlurring || false,
                onChange      = props.onChange || false,
                validReg      = props.validReg || false,
                autocomplete  = props.autocomplete || 'off',
                minLength     = props.minLength || 0;

        const val = this.state.default_value

        if(onInit) {
            onInit({ inputID: inputId })
        }

        const generateData = e => {
            e.preventDefault()
            const el = document.querySelector('#' + inputId)
            const data = uuid.v4().slice(0,10)

            el.value = data
            el.type = "text"
        }

        return (
            <>
                { typeInput === `textarea` ?
                <div className={`input-field col m${col} s12`}>
                    <textarea tabINdex='2'  onInput={e => {
                    let currentInputValue = e.target.value;

                    this.setState(() => ({ default_value: currentInputValue }))

                    if(onChange) onChange(currentInputValue, e.target, e);

                    if(validReg) {
                        let matchReg = currentInputValue.match(validReg)
                        if(matchReg !== null) {
                            e.target.value = matchReg[0];
                        } else {
                            e.target.value = currentInputValue.substr(0,currentInputValue.length-1)
                        }
                    }
                }} onBlur={e => {
                    if(onBlurring) onBlurring(e.target.value)
                }} autoFocus minLength={minLength} id={inputId} readOnly={readonly} value={val} autoComplete={autocomplete} name={name} required={isRequire}></textarea>
                </div>
            :
                <div className={`input-field col m${col} s12`}>
                    <p>
                        <label htmlFor={inputId}>{inputLabel}</label>
                    </p>
                    <input tabIndex='2' type={typeInput} disabled={disabled} onInput={e => {
                        let currentInputValue = e.target.value;

                        this.setState(() => ({ default_value: currentInputValue }))

                        if(onChange) onChange(currentInputValue, e.target, e);

                        if(validReg) {
                            let matchReg = currentInputValue.match(validReg)
                            if(matchReg !== null) {
                                e.target.value = matchReg[0];
                            } else {
                                e.target.value = currentInputValue.substr(0,currentInputValue.length-1)
                            }
                        }
                    }} onBlur={e => {
                        if(onBlurring) onBlurring(e.target.value)
                    }} autoFocus minLength={minLength} id={inputId} readOnly={readonly} value={val} autoComplete={autocomplete} name={name} required={isRequire} className="validate" />
                    {props.generate ? <a href="" className={'btn-new btn-new--green'} onClick={generateData}>Сгенерировать</a> : ''}
                </div>
                }                  
            </>

        )
    }
}
