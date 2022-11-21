import React from 'react'
import {v1 as uuid} from 'uuid'
import {} from './SelectSearch/index.less'

export default class SelectSearch extends React.Component {
    constructor (props) {
        super (props)

        this.state = {
            inputVisible: false,
            id_name: uuid(),
            arr_data: [],
            stateValue: ''
        }

        this.toggleInputSearch = this.toggleInputSearch.bind(this)
        this.searchDataSelect = this.searchDataSelect.bind(this)
        this.changeSelectValue = this.changeSelectValue.bind(this)
    }

    get idRootElem () {
        return 'ssearch-' + this.state.id_name
    }

    get idSelectElem () {
        return 'sselect-' + this.state.id_name
    }

    changeSelectValue ({ title, value }) {
        this.setState(() => ({ stateValue: value }))

        this.toggleInputSearch()
    }

    searchDataSelect (search_data = '', toggleVisible = false) {
        let arr_data = []
        let data = $('#' + this.idSelectElem).find('option:not(:disabled)').each(function () {
            let t = this

            arr_data.push({
                title: t.innerText,
                value: t.value 
            })
        })

        this.setState(() => ({ arr_data, stateValue: search_data }))

        if(toggleVisible) {
            this.toggleInputSearch(null, true)
        }
    }

    toggleInputSearch (stateValue = null, inputVisibleValue = null) {
        if(stateValue) 
            return this.setState(() => ({ stateValue }))
        

        this.setState(prevState => ({ inputVisible: inputVisibleValue && !prevState.inputVisible }))
    }

    render () {
        const { onChange, name, onMapItems = null, dataOnMap = [], placeholder = '', value = '', required = 0 } = this.props
        const { inputVisible, id_name, arr_data, stateValue = '' } = this.state

        return (
            <div id={this.idRootElem} onBlur={e => {
                if(!$(e.relatedTarget).hasClass('select-search__link')) this.toggleInputSearch()
            }} className="Tsds-english__select select-search">
                <input value={stateValue} name={id_name} onClick={() => this.searchDataSelect('', true)} placeholder={placeholder} onInput={e => {
                    const etv = e.target.value
                    this.searchDataSelect(etv, false)
                }} className="select-search__input" id={id_name} />

                {inputVisible && arr_data.length ? <div className="select-search__data">
                    {arr_data.map((item, i) => {
                        // Если элемент поиска не найден в массиве - ничего не выводим
                        if (stateValue.length >= 1 && item.title.toUpperCase().match( eval('/'+stateValue.toUpperCase()+'/g') ) == null) 
                            return '';

                        return <a className="select-search__link" href={'#'} key={i} onClick={() => this.changeSelectValue(item)}>{item.title}</a>
                    })}
                </div> : ''}

                <select id={this.idSelectElem} required={!!required} onChange={() => {
                    onChange ? onChange : ''
                }} name={name} className="browser-default" defaultValue={value} value={stateValue}>
                    <option selected hidden disabled>{placeholder}</option>
                    
                    {onMapItems && dataOnMap ? dataOnMap.map((item, i) => {
                        return onMapItems(item, i)
                    }) : ''}
                </select>
            </div>
        )
    }
}
    