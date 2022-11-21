import React from 'react'
import { Select } from '../../../../../global-components/layout/Inputs'
import Button from '../../../../../global-components/layout/Button';
import { Toast, dynamicSort, parseDate } from '../../../../../functions';
import FilterItems from './FilterItems';

export default class StatisticTableFilter extends React.Component {
    constructor (props) {
        super(props)
    
        this.newTableRowsData = [
            {name: 'IP', $key: 'geo.IP'},
            {name: 'Город', $key: 'geo.city'},
            {name: 'Регион', $key: 'geo.region'},
            {name: 'Страна', $key: 'geo.country'},
            {name: 'Широта и долгота', $key: 'geo.lat_long'}
        ]
        
        this.state = {
            currentKey: '',
            filterInputType: 'text',
            activeFilters: [],
            to_value: ''
        }

        this.parseChangeData = this.parseChangeData.bind(this)
        this.getAllDataUsers = this.getAllDataUsers.bind(this)
        this.parseSubmitForm = this.parseSubmitForm.bind(this)
    } 

    parseChangeData (data) {
        let typeInput = 'text';

        this.setState(() => ({
            filterInputType: typeInput,
            currentKey: data
        }))
    }

    parseSubmitForm ($form, $data) {
        let activeFilters = this.state.activeFilters;
        const currentKey = $form.filter_key.value;
        const $value = $form.filter_value.value;
        let valTo = null;
        if($form.to_value) valTo = $form.to_value.value 

        let findCurrentFilterIndex = null;
        let findCurrentFilter = activeFilters.filter((item, i) => {
            if(item[currentKey] && item.f_data === $value) {
                findCurrentFilterIndex = i
                return item[currentKey]
            }
        })

        if(!findCurrentFilter.length > 0) {
            let newDataState = prevState => {
                if(!(valTo && $value)) return [...prevState.activeFilters, { [currentKey]: $value, f_data: $value, f_key: currentKey }]

                return prevState.activeFilters
            }              
            this.setState(prevState => ({
                activeFilters: newDataState(prevState)
            }), () => {
                this.props.setActiveFilters( this.state.activeFilters, {
                    valTo,
                    valFrom: $value,
                    currentKey,
                })
            })
        } else {
            Toast('Фильтр уже существует')
            /*this.setState(prevState => {
                let newData = prevState.activeFilters.slice()
                newData[findCurrentFilterIndex][currentKey] = $value;
                newData[findCurrentFilterIndex].f_data = $value;
                return { activeFilters: newData }
            }, () => {
                this.props.setActiveFilters( this.state.activeFilters )
            })*/
        }
    }

    // получить значение поля пользователей по ключу (key.property)
    getAllDataUsers (key) {
        const ps = this.props.parentState
        const keys = key.split('.')

        if(ps.users_in_course.length) {
            if(!key) return []
            let uniqueDatas = []
            let mapAllDatas = ps.users_in_course.map(item => {   
                let __item = (keys.length <= 1) ? item[key] : item[keys[0]][keys[1]] 

                if(__item !== undefined && __item !== null && __item !== "") {
                    
                    let findData = uniqueDatas.filter($itemFilter => {
                        if(parseDate($itemFilter) == parseDate(__item)) return true
                    })
    
                    if(findData.length <= 0) uniqueDatas.push(__item)

                    return __item
                } 
            })
            
            return uniqueDatas
            // Из-за этого кода не работает IP, Город и т.д. (проверить) .sort(dynamicSort(key, true))
        } else return []
    }

    render () {
        let { table_rows } = this.props.parentState;
        let allDatas = this.getAllDataUsers(this.state.currentKey)
        table_rows = [...table_rows, ...this.newTableRowsData]

        return (
            <div className="Tsds__page--courses-statistic__filter">
                { this.props.parentState.users_in_course.length ? <React.Fragment>

                    <div className="row Tsds__page--courses-statistic__filter__form statistic__filter__form">
                        <p>Фильтровать по:</p>
                        <form className="row" onSubmit={e => {
                            e.preventDefault()
                            this.parseSubmitForm(e.target, e)
                        }}>
                            <select className="browser-default col s12 m4" required name={'filter_key'} onChange={e => this.parseChangeData(e.target.value)}>
                                {table_rows.map((item, i) => {
                                    if(item.$key) {
                                        return <option value={item.$key} key={i}>{item.name}</option>
                                    }
                                })}
                            </select>
                            <div className="col s12 m4">
                                {allDatas.length ? (
                                    <React.Fragment>
                                        <select className="browser-default" required name={'filter_value'}>
                                            {allDatas.map((item, i) => {
                                                return <option value={item} key={i}>{parseDate(item)}</option>
                                            })}
                                        </select>

                                        {/* Если ключ является датой */}
                                        {this.state.currentKey.indexOf('date') > -1 ? <div id="filter-to-value">
                                            <p>До значения:</p>
                                            <select className="browser-default" name={'to_value'}>
                                                <option value="" disabled selected>Выберите значение из списка</option> 
                                                {allDatas.map((item, i) => {
                                                    return <option value={item} key={i}>{parseDate(item)}</option>
                                                })}
                                            </select>
                                        </div> : ''}
                                    </React.Fragment>
                                )
                                : <input type={this.state.filterInputType} required placeholder={'Введите значение'} name={'filter_value'} />}
                            </div>
                            <Button customClass={'shadow--none'} submit title={'Фильтровать'} />
                        </form>
                    </div>
                </React.Fragment> : ''}


                {this.state.activeFilters.length > 0 ? <div className="Tsds__page--courses-statistic__filter__result">
                    <FilterItems items={this.state.activeFilters} data={{
                        text: 'f_data',
                        hasClick: (i, item) => {
                            this.setState(prevState => {
                                let newData = prevState.activeFilters.slice()
                                newData.splice(i, 1)
                                return { activeFilters: newData }
                            }, () => {
                                this.props.setActiveFilters( this.state.activeFilters )
                            })
                        }
                    }} />
                </div> : ''}
            </div>
        )
    }
}