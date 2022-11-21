import Axios from 'axios'
import React from 'react'
import API from '../../../config/API'
import { getCurrentUserToken, Toast } from '../../../functions'
import Button from '../../../global-components/layout/Button'

export default class SubtitlesTable extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            from_slice: props.from_slice || 0,
            to_slice: props.to_slice || 1,
            default_slice_value: 10,
            hasEdited: {}
        }

        this.paginate = this.paginate.bind(this)
        this.onCreateWordHandler = this.onCreateWordHandler.bind(this)
    }
    paginate (from_slice) {
        let to_slice = from_slice+1
        
        this.state.to_slice = to_slice
        this.state.from_slice = from_slice
        
        this.setState(() => ({
            from_slice,
            to_slice
        }))
    }

    getActiveTranslate (item, itemIndex) {
        if(this.props.listTranslates.length) {
            let translates = this.props.listTranslates,
                trItem = translates[itemIndex]

            if(trItem) {
                return trItem ? (<>
                    <b>{trItem.text}</b>
                    <div>
                        <input type="text" value={trItem.timecode.start_time} /> - <input type="text" value={trItem.timecode.end_time} />
                    </div>
                </>) : ''
            }

            
        }

        return ''
    }

    getFieldsItem (fieldId) {
        const valid_fields = ['start_text', 'end_text', 'start_time', 'end_time']

        let data = {}

        valid_fields.forEach(item => {
            data[item] = document.getElementById(this.genName(fieldId, item)).value
        })

        return data
    }

    saveFields ({ id, word_id }) {
        let data = this.getFieldsItem(id)

        data['word_id'] = this.state.hasEdited[id] ? this.state.hasEdited[id] : word_id
        data['action'] = 'PUT'
        data['id'] = id

        Axios.put(API.host + '/api/subtitles', data, {
            headers: { 'Authorization': getCurrentUserToken() }
        }).then(response => {
            const msg = response.data
            
            return Toast(msg.error_message, msg.success ? 'green' : 'red')
        })
    }

    onCreateWordHandler ({ id }) {
        let fields = this.getFieldsItem(id)

        this.props.onCreateWord(
            fields['start_text'].split(' ')[0],
            fields['start_text'],
            fields['end_text'], 
            data => {
                if(data.insertId) {
                    Toast('Успешно добавлено в курс!')
                    this.setState(prevState => ({
                        hasEdited: {
                            ...prevState.hasEdited,
                            [id]: data.insertId
                        }
                    }), () => {
                        this.saveFields({ id, word_id: data.insertId })
                    })
                }
            }
        )
    }

    genName (_id, _name) {
        return `subtitle[${_id}][${_name}]`
    }

    render() {
        const { list, listTranslates, isApiData = false } = this.props

        let { from_slice, to_slice, default_slice_value, hasEdited } = this.state

        // pagination
        const COUNT_SYMB_PAG = Math.floor( list.length/default_slice_value )
        const showPagination = () => {
            let alls = []
            let to_slice_val = to_slice+((default_slice_value/2)),
                minus_val = to_slice_val-COUNT_SYMB_PAG-1;
                minus_val = (minus_val < 0) ? 0 : minus_val

            to_slice_val-= (minus_val > 0) ? minus_val : 0

            for(let i = from_slice-minus_val; i < to_slice_val; i++) {
                if(i < 0) continue;
                alls.push(<a href="" key={i} className={`pagination__item ${this.state.from_slice == i ? 'pagination__item--active' : ''}`} onClick={e => {
                    e.preventDefault()
                    this.paginate(i)
                }}>{i+1}</a>)
            }
    
            return alls
        }

        let slice_data = list.slice(from_slice*default_slice_value, to_slice*default_slice_value)
        
        return (
            <div className="SubtitlesTable">
                <form>
                    <table>
                        <thead>
                            <tr>
                                <th width="30">#</th>
                                <th>Тайминг и фраза</th>
                                <th>Перевод</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length ? slice_data.map((item, i) => {
                                const n_start_text = this.genName(item.id, 'start_text'),
                                    n_start_time = this.genName(item.id, 'start_time'),
                                    n_end_text = this.genName(item.id, 'end_text'),
                                    n_end_time = this.genName(item.id, 'end_time')
                                
                                if(isApiData) { 
                                    return <tr data-id={item.id} key={i}>
                                        <td width="30">{i+1}</td>
                                        <td>
                                            <input type="text" id={n_start_text} name={n_start_text} defaultValue={item.start_text} />
                                            <div>
                                                <input type="text" id={n_start_time}  name={n_start_time} defaultValue={item.start_time} />
                                            </div>
                                        </td>
                                        <td>
                                            <input type="text" id={n_end_text} name={n_end_text} defaultValue={item.end_text} />
                                            <div>
                                                - <input type="text" id={n_end_time} name={n_end_time} defaultValue={item.end_time} />
                                            </div>
                                        </td>
                                        <td>
                                            {item.word_id || hasEdited[item.id] ? <Button title={'Редактировать в курсе'} onChange={() => {
                                                self.loadWord(
                                                    item.word_id ? item.word_id : hasEdited[item.id]
                                                )
                                            }} color={'green'} />
                                            : <Button title={'Добавить в курс'} onChange={() => {
                                                this.onCreateWordHandler(item)
                                            }} />}

                                            <Button title={'Сохранить поля'} onChange={() => this.saveFields(item)} />
                                            
                                        </td>
                                    </tr>
                                } else {
                                    return <tr key={i}>
                                        <td width="30">{item.index}</td>
                                        <td>
                                            <input type="text" value={item.text} />
                                            <div>
                                                <input type="text" value={item.timecode.start_time} /> - <input type="text" value={item.timecode.end_time} />
                                            </div>
                                        </td>
                                        <td>
                                            {this.getActiveTranslate(item, i)}
                                        </td>
                                        <td></td>
                                    </tr>
                                }
                                
                            }): <tr></tr>}
                        </tbody>
                    </table>
                </form>

                <div className="lemma__pagination__block lemma__phrases__pagination__block">
                    {(list.length >= default_slice_value) ? 
                    <div className="fingman__phrases__pagination">
                        <a href="" onClick={e => { e.preventDefault(); this.paginate((from_slice-1<0?0:from_slice-1)) }} className="pagination__item pagination__prev">&lt;</a>
                        {showPagination()}
                        <a href="" onClick={e => { e.preventDefault(); this.paginate((from_slice+1>COUNT_SYMB_PAG?from_slice:from_slice+1)) }} className="pagination__item pagination__next">&gt;</a>
                    </div> : ''}
                </div>
            </div>
        )
    }
} 