import React from 'react'

import TableUserData from './TableUserData'
import Loader from '../../../../../global-components/layout/Loader'

export default class TableUsers extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            from_slice: 0,
            to_slice: 1,
            default_slice_value: 10,
            search_query: ''
        }
        
        this.paginate = this.paginate.bind(this)
        this.changeDefaultSlice = this.changeDefaultSlice.bind(this)
        this.searchUser = this.searchUser.bind(this)
    }

    changeDefaultSlice (e) {
        const val = parseInt(e.target.value)

        if(!isNaN(val)) {
            this.setState(() => ({
                default_slice_value: val
            }))
        }
    }

    paginate (from_slice) {
        this.setState(() => ({
            from_slice,
            to_slice: from_slice+1
        }))
    }

    searchUser (search_data, save_query = true) {
        // Если запрос уже есть, то ищем пользователя
        if(!save_query && search_data.length >= 2 && this.props.data) {
            search_data = search_data.trim().toUpperCase()

            let users = {...this.props.data}
                users.users = users.users.filter(user => {
                    return JSON.stringify(user).toUpperCase().match(eval('/'+search_data+'/g')) !== null
                })

            return users
        } else if(!save_query) {
            return this.props.data
        }

        // Если это новый запрос, то вводим его
        if(save_query) {
            this.setState(() => ({ search_query: search_data }))
        }   
    }

    render () {
        let users = this.props.data,
            totalRole = this.props.totalRole

        let { from_slice, to_slice } = this.state

        // Поиск по юзерам
        users = this.searchUser(this.state.search_query, false)

        // Пагинация юзеров
        const data = users.users,
            default_slice_value = this.state.default_slice_value,
            COUNT_SYMB_PAG = Math.floor( data.length/default_slice_value ),
            showPagination = () => {
                let alls = []
                let to_slice_val = to_slice+((default_slice_value/2)),
                    minus_val = to_slice_val-COUNT_SYMB_PAG-1;
                    minus_val = (minus_val < 0) ? 0 : minus_val

                to_slice_val-= (minus_val > 0) ? minus_val : 0

                for(let i = from_slice-minus_val; i < to_slice_val; i++) {
                    if(i < 0) continue;

                    let round_i = Math.round(i)

                    alls.push(<li key={i} className={`page-item ${this.state.from_slice == round_i ? 'active' : ''}`}>
                        <a href="" className="page-link" onClick={e => {
                            e.preventDefault()
                            this.paginate(round_i)
                        }}>{round_i+1}</a>
                    </li>)
                }
        
                return alls
            }

        let slice_data = data.slice(from_slice*default_slice_value, to_slice*default_slice_value)

        return (
            <div>
            <input placeholder={'Поиск по пользователям...'} type="search" onInput={e => this.searchUser(e.target.value.trim())} />
            <table className="table table-bordered bg-white">
                <thead className="thead-light2">
                    <tr>
                        {
                            users.fields.map((field, i) => {
                                return <th scope="col" className="resizable" key={i}>
                                    {field}
                                    <span className="material-icons align-text-bottom ml-1 md-18">sort</span>
                                </th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        slice_data.map((user, i) => {
                            return <TableUserData index={i} onDeleteUser={this.props.onDeleteUser} totalRole={totalRole} key={i} data={user} />
                        })   
                    }
                </tbody>
            </table>

                <nav className="users__table__navigation" aria-label="Page navigation example">
                    <form className="form-inline float-left">
                        <label className="my-1 mr-2 d-none d-md-block" htmlFor="show-data">Показывать от 10 до 100 строк</label>
                        <select className="form-control" onChange={this.changeDefaultSlice} id="show-data">
                            <option selected={true} disabled={true}>Кол-во строк</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </form>
                    {(data.length >= 10) ? <ul className="pagination justify-content-end">
                        <li className="page-item">
                            <a onClick={e => { e.preventDefault(); this.paginate((from_slice-1<0?0:from_slice-1)) }} className="page-link" href="#" tabIndex="-1">&lt;</a>
                        </li>
                        {showPagination()}
                        <li className="page-item">
                            <a onClick={e => { e.preventDefault(); this.paginate((from_slice+1>COUNT_SYMB_PAG?from_slice:from_slice+1)) }} className="page-link" href="#">&gt;</a>
                        </li>
                    </ul> : ''}
                </nav>
            </div>
        )
    }
}