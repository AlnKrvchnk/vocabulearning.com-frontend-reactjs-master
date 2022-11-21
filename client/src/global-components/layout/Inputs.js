import React from 'react'

import { randomNumbers, readURL } from '../../functions'
import M from 'materialize-css'
import {v4 as uuid} from 'uuid'

export function Select ({ val = '', isRequire = true, name = '', title = '', items = [], col = 12, onChange = null }) {
    let defaultValue = (typeof val == 'string' && val.length > 0) ? val : '';
    let cv = (val.length) ? {value: val} : val

    return (
        <div className={`input-field col s${col}`}>
            <p>{title}</p>
            <select data-value={val} className={`browser-default select--styled`} defaultValue={defaultValue} name={name} onChange={(e) => {
                e.preventDefault();
                if(onChange) onChange(e.target.value)
            }} required={isRequire}>
                {(title) ? <option value="" disabled>{title}</option> : ''}
                {
                    items.map(
                        (item, i) => {
                            return <option checked={item.value == val} key={i} value={item.value}>{item.title}</option>
                        }
                    )
                }
            </select>
        </div>
    )
}

export class Vcheckbox extends React.Component {
    constructor (props) {
        super(props)

        this.id = uuid()

        this.state = {
            value: 0
        }

        this.setVal = this.setVal.bind(this)
    }

    setVal (value) {
        this.setState(() => ({ value }))
    }

    componentDidMount () {
        if(this.props) {
            const { defaultChecked, values } = this.props

            this.setVal(defaultChecked ? values.checked : values.unchecked)
        }
    }

    render() {
        let { defaultChecked = false, name = `checkbox${uuid()}`, values } = this.props

        return (
            <div className="V-checkbox">
                <input 
                    type="checkbox" 
                    defaultChecked={defaultChecked} 
                    name={name} 
                    value={this.state.value}
                    data-value={this.state.value}
                    id={this.id}
                    onChange={e => {
                        let $this = e.target
                        
                        $this.checked ? this.setVal(values.checked) : this.setVal(values.unchecked)
                    }}
                    className="checkbox_public" 
                />
                <label htmlFor={this.id}>
                    <span></span>
                </label>
            </div>
        )
    }
} 

export function Checkbox ({ title = '', name = 'test', type = 'checkbox', checked = false, onChange }) {
    const id = uuid()

    let checked_attr = {checked}

    if(type == "radio")
        checked_attr = {defaultChecked: checked}

    return (
        <label htmlFor={id}>
            <input id={id} {...checked_attr} name={name} type={type} onChange={e => {
                if(onChange) onChange(e.target.checked, e.target)
            }} />
            <span>{title}</span>
        </label>
    )
}

export class File extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            image_path: ''
        }

        this.updateImagePath = this.updateImagePath.bind(this)
    }

    updateImagePath (file) {
        this.setState(() => ({
            image_path: file
        }))
    }

    render () {
        let { onChange, name, title, val = '' } = this.props;
        const id = name + '_' + randomNumbers(10);
        const required = this.props.required || false;

        const validExts = this.props.validExts || /(\.jpg|\.svg|\.png|\.jpeg)/g;

        return (
            <React.Fragment>
                {this.props.type === 'image' ?
                    <div className="file-input file-input--image">
                        <div className="file-input--image__left">
                            <img src={this.state.image_path ? this.state.image_path : val} data-src={this.state.image_path ? `enabled` : `disabled`} className={'file-input--image__preview'} alt=""/>
                        </div>

                        <div className="file-input--image__right">
                            <input tabIndex='1' required={required} onChange={(e) => {
                            const matchExt = e.target.files[0].name.match(validExts);
                            if(matchExt == null) {
                                e.target.files = null;
                                e.target.value = '';
                                M.toast({html: 'Недопустимый формат файла!', classes: 'red'});
                                this.updateImagePath({name: ''})
                                return;
                            } else {
                                if(onChange) onChange(e.target.files)
                                
                                readURL(e.target, uri => {
                                    this.updateImagePath(uri)
                                })
                            }
                        }} type="file" name={name} id={id} />
                            <label className="photo__input__label"  htmlFor={id}>
                                <img src="/img/icons/upload-icon-arrow--white.svg" alt=""/>
                                <p>{this.state.image_path ? 'Обновить изображение' : 'Загрузить изображение'}</p>
                                <p>Формат изображений: png/jpg/jpeg/svg</p>
                            </label>
                        </div>
                    </div>
                    : this.props.type === 'audio' ?
                        <div className="file-input">
                            <input tabIndex='1' defaultValue={val} required={required} onChange={(e) => {
                                const matchExt = e.target.files[0].name.match(validExts);
                                if(matchExt == null) {
                                    e.target.files = null;
                                    e.target.value = '';
                                    M.toast({html: 'Недопустимый формат файла!', classes: 'red'});
                                    this.updateImagePath({name: ''})
                                    return;
                                } else {
                                    if(onChange) onChange(e.target.files);
                                    this.updateImagePath(e.target.files[0]);
                                }
                            }} type="file" name={name} id={id} />
                            <label className="audio__input__label"  htmlFor={id}>
                                <img src="/img/icons/upload-icon--arrow--white.svg" alt=""/>
                                {this.state.image_path ? 'Обновить файл' : this.props.title}
                            </label>
                            {this.state.image_path ? <p>{this.state.image_path}</p> : ''}
                        </div>
                        :
                        <div className="file-input">
                            {this.state.image_path ? <p>{this.state.image_path}</p> : ''}
                            <input tabIndex='1' defaultValue={val} required={required} onChange={(e) => {
                                const matchExt = e.target.files[0].name.match(validExts);
                                if(matchExt == null) {
                                    e.target.files = null;
                                    e.target.value = '';
                                    M.toast({html: 'Недопустимый формат файла!', classes: 'red'});
                                    this.updateImagePath({name: ''})
                                    return;
                                } else {
                                    if(onChange) onChange(e.target.files);
                                    this.updateImagePath(e.target.files[0]);
                                }
                            }} type="file" name={name} id={id} />
                            <label htmlFor={id}>
                                <img src="/img/icons/upload-icon--arrow--white.svg" alt=""/>
                                {this.props.title}
                            </label>
                        </div>
                }
            </React.Fragment>
        )
    }
}
