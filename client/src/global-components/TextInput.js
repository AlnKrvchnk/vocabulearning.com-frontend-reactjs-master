import React from 'react';

export default function CustomTextInput ({ required = false, id = '', name = '', val='', onChange, onInput, big, type, fingman, validReg, placeholder = '', min = 0, max = Infinity }) {
    const bigClass = (big) ? 'custom-textarea--big' : '';
    const fingmanClassName = (fingman) ? fingman : '';

    return (
        <>
        {type === 'textarea' ?
            <textarea
                required={required}
                max={max}
                name={name}
                min={min}
                defaultValue={val}
                id={id}
                autoComplete={id}
                placeholder={placeholder}
                className={`custom-textarea ${bigClass}${fingmanClassName}`}
                onBlur={e => {
                    if(onChange) {
                        onChange(e.target.value)
                    }
                }}
                onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                onInput={e => {
                    let currentInputValue = e.target.value;
                    if(validReg) {
                        let matchReg = currentInputValue.match(validReg)
                        if(matchReg !== null) {
                            e.target.value = matchReg[0];
                        } else {
                            e.target.value = currentInputValue.substr(0,currentInputValue.length-1)
                        }
                    }

                    if(onInput)
                        onInput(e.target.value)
                }}
            
            ></textarea>
        :
        <input
            type={'text'}
            required={required}
            max={max}
            name={name}
            min={min}
            defaultValue={val}
            id={id}
            autoComplete={id}
            placeholder={placeholder}
            className={`custom-textarea ${bigClass}${fingmanClassName}`}
            onBlur={e => {
                if(onChange) {
                    onChange(e.target.value)
                }
            }}
            onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
            onInput={e => {
                let currentInputValue = e.target.value;
                if(validReg) {
                    let matchReg = currentInputValue.match(validReg)
                    if(matchReg !== null) {
                        e.target.value = matchReg[0];
                    } else {
                        e.target.value = currentInputValue.substr(0,currentInputValue.length-1)
                    }
                }

                if(onInput)
                    onInput(e.target.value)
            }}
        />
        }
        
        </>
    )
}
