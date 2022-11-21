import React from 'react'
import { dynamicSort, showInpEdit, openModal, localSave } from '../../../functions'
import {v4 as uuid} from 'uuid'
import Slider from 'react-slick'
import ToolTip from '../../../global-components/layout/ToolTip/ToolTip'
import API from '../../../config/API'


export default class LemmaTableComponent extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            from_slice: props.from_slice || 0,
            to_slice: props.to_slice || 1,
            filters: {},
            active_phrases: {},
            archive_view: false,
            all_checked: false
        }

        this.paginate = this.paginate.bind(this)
        this.onSorting = this.onSorting.bind(this)
        this.sort_lemma = this.sort_lemma.bind(this)
        this.do_active_phrases = this.do_active_phrases.bind(this)
        this.getAllCheckedValue = this.getAllCheckedValue.bind(this)
    }

    componentDidMount () {
        const trigger_show_heads = document.getElementById('lemma_show_heads')

        if(trigger_show_heads) 
            trigger_show_heads.click()
    }

    do_active_phrases (cb) {
        let vals = Object.values(this.state.active_phrases)

        if(vals.length) {
            const last_item = vals[vals.length-1]

            this.setState(() => ({ active_phrases: {}, all_checked: false }), () => {
                
                vals.forEach(item => {
                    cb(item, last_item)
                })
            })
        }
    }

    sort_lemma (slice_array) {
        const { filters } = this.state

        if(Object.values(slice_array).length) {
            for(let i in filters) {
                slice_array.sort(dynamicSort(i, filters[i]))
            }
        }

        return slice_array
    }

    paginate (from_slice, save_local = true) {
        let to_slice = from_slice+1
        
        this.state.to_slice = to_slice
        this.state.from_slice = from_slice
        
        this.setState(() => ({
            from_slice,
            to_slice
        }))

        if(save_local) {
            const data_to_save = {
                from_slice,
                currentGlav: this.props.currentGlav,
                course_id: this.props.course_id,
                currentPage: location.hash 
            }

            localSave('lemma_page' + this.props.course_id, JSON.stringify(data_to_save))

            // Обновляем страницу с переходом на следущую (сохраняем главу и страницу пагинации)
            location.reload()
        }
    }

    onSorting (data, clear = false) {
        let object_to_state = {}
        
        if(!clear) {
            let currentFD = (this.state.filters[data] !== undefined) ? !this.state.filters[data] : false 
            object_to_state[data] = currentFD
        } 

        this.setState(() => ({ filters: object_to_state }))
    }

    // Если на конкретной странице выделены абсолютно все слова
    getAllCheckedValue (slice_data, slice_prop = 1) {
        let all_checked_value = slice_data.filter((item, i) => {
            const word_index = i+slice_prop
            const id_active_word = `${this.props.id}|${word_index}|${i}|${item.head_id}`

            return this.state.active_phrases[id_active_word] != undefined
        })
        
        if(all_checked_value.length === slice_data.length && (slice_data.length !== 0 && all_checked_value.length !== 0)) {
            return true
        } else {
            return false
        }
    }

    render () {
        let { onDoPhrase, onUpdatePhrase, onDeleteLemma, data, id, indexLemma, default_slice_value = 10, onSetActive, book_path } = this.props
        let { from_slice, to_slice } = this.state

        // table info
        const table_id = 'tb_lemm_' + (Math.floor(Math.random()*9999))
        const onSearch = e => {
            let val = e.target.value.toUpperCase()
            
            $(`#${table_id} .lemma__word`).each(function () {
                if ($(this).text().toUpperCase().match(eval('/'+val+'/g')) == null) {
                    $(this).parent().hide()
                } else {
                    $(this).parent().show()
                }
            })
        }
    
        // pagination
        const COUNT_SYMB_PAG = Math.floor( data.length/default_slice_value )
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

        let slice_data = data.slice(from_slice*default_slice_value, to_slice*default_slice_value)

        if(data.length) {
            if(this.state.archive_view) {
                if(!$('body').find('.lm-style').length)
                    $('body').append('<style class="lm-style">.lemma__table > form > table > tbody > tr:not(.lemma-archived){display:none;}</style>')
            } else {
                $('.lm-style').remove()
                slice_data = this.sort_lemma(slice_data)
            }
        }

        return (
            <React.Fragment>
                <div className="lemma__table" data-id={id}>
                    <div className="lemma__table__top">
                        <div className="lemma__table__item">
                            <div className="lemma__table__selected">
                                <p>Выбрано {Object.values(this.state.active_phrases).length} элементов</p>
                            </div>
                            <div className={`lemma__phrases-selector`}>
                                Сделать с выбранными
                                <i className="material-icons">expand_more</i>
                                <div className="lemma__phr-control__btns">
                                    <a href="" onClick={e => {
                                        e.preventDefault()
                                        this.do_active_phrases((item, last_item) => onDoPhrase(item.id, item.word_index, item.j, item.head_id, 'ADD_TO_COURSE', item.elem, item, last_item))
                                    }}>Добавить в курс</a>
                                    <a href="" onClick={e => {
                                        e.preventDefault()
                                        this.do_active_phrases((item, last_item) => onDoPhrase(item.id, item.word_index, item.j, item.head_id, 'ARCHIVE', item.elem, item, last_item))
                                    }}>Архивировать</a>
                                    <a href="" onClick={e => {
                                        e.preventDefault()
                                        this.do_active_phrases((item, last_item) => onDoPhrase(item.id, item.word_index, item.j, item.head_id, 'ARCHIVE', item.elem, item, last_item))
                                    }}>Разархивировать</a>
                                    <a href="" onClick={e => {
                                        e.preventDefault()

                                        if(confirm('Вы действительно хотите провести удаление?')) {
                                            this.do_active_phrases((item, last_item) => onDoPhrase(item.id, item.word_index, item.j, item.head_id, item.action || 'DELETE', item.elem, item, last_item))
                                        }
                                    }}>Удалить</a>
                                </div>
                            </div>
                        </div>
                        <div className="lemma__table__item">
                            <div className="lemma__archive-selector">
                                <span>Показывать архивированные фразы</span>
                                <input defaultChecked={this.state.archive_view} type="checkbox" onChange={() => this.setState(prevState => ({
                                    archive_view: !prevState.archive_view
                                }))} />
                               
                            </div>
                        </div>
                        <div className="lemma__table__item lemma__table__item__search">
                            <a href="" className="lemma__table__search__icon">
                                <i className="material-icons">search</i>
                            </a>
                            <ToolTip info={'Check'} icon={'more_horiz'} />
                            <input placeholder={'Введите слово'} type="search" onInput={onSearch} />
                        </div>
                        <div className="lemma__table__item lemma__table__item__clear">
                            <a href="" className="btn-new btn-new--grey" onClick={e => { e.preventDefault(); this.onSorting(null, true) }}>Очистить фильтр</a>
                        </div>
                    </div>
                    <div className="lemma__table__middle">
                        {book_path 
                            ? 
                            <p><a href={API.host + book_path.replace('public','')} target="_blank" className="btn-new btn-new--green">Посмотреть книгу</a></p> 
                            : ''
                        }
                    </div>
                    <div className="lemma-table-component">
                        <table id={table_id} className="table lemma-table">
                            <thead>
                                <tr>
                                    <th>
                                        <p>Все</p>
                                        <label>
                                            
                                            <input type="checkbox" className="lemma__table__checkbox" id="lemma_all_phrases" checked={this.getAllCheckedValue(slice_data, (from_slice*default_slice_value))} onChange={e => {
                                                const is_checked = e.target.checked
                                                let active_phrases = {}

                                                // Если активных нет
                                                if(is_checked) {
                                                    slice_data.forEach((item,i) => {
                                                        const word_index = i+(from_slice*default_slice_value)
                                                        const id_active_word = `${id}|${word_index}|${i}|${item.head_id}`

                                                        active_phrases[id_active_word] = {
                                                            id_active_phrase: id_active_word, id, word_index, j:0, head_id: item.head_id, action: 'DELETE_WORD', elem: 'WORD'
                                                        }
                                                    })
                                                } else {
                                                    active_phrases = {}
                                                }

                                                this.setState(() => ({ active_phrases, all_checked: is_checked }))
                                                    
                                            }} />
                                            <label htmlFor="lemma_all_phrases"></label>
                                        </label>
                                    </th>
                                    <th className="thead__item--bordered">
                                        <p>Слова</p> 
                                        <a href="" onClick={e => { e.preventDefault(); this.onSorting('word'); }} className="sort__item">
                                            <i className="material-icons">sort</i>
                                        </a>
                                    </th>
                                    <th className="thead__item--bordered">
                                        <p>Повторы</p> 
                                        <a href="" onClick={e => { e.preventDefault(); this.onSorting('repeating'); }} className="sort__item">
                                            <i className="material-icons">sort</i>
                                        </a>
                                    </th>
                                    <th>
                                        <p>Фразы</p> 
                                        <a href="" onClick={e => { e.preventDefault(); this.onSorting('phrases.selected'); }} className="sort__item">
                                            <i className="material-icons">sort</i>
                                        </a>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length ? slice_data.map((item, i) => {
                                    const ws_class = (item.phrases.filter(phr => phr.selected == true).length) ? 'lemma__word--selected' : ''
                                    const archived_cls = ((item.phrases.filter(phr => phr.archived == true).length) || item.archived) ? 'lemma-archived' : ''
                                    const word_index = i+(from_slice*default_slice_value)
                                    const id_active_word = `${id}|${word_index}|${i}|${item.head_id}`
                                    // Проверка, выбран элемен или нет
                                    const is_checked = this.state.active_phrases[id_active_word]

                                    // Если фраз нету в слове - удаляем слово
                                    if(!item.phrases.length) {  
                                        onDoPhrase(id, word_index, 0, item.head_id, 'DELETE_WORD')
                                    }

                                    // Если нет просмотра архивации, но фраза архивирована - пустое значение
                                    if(!this.state.archive_view && item.archived) return '';

                                    return (
                                        <tr key={i} className={`${archived_cls}`}>
                                            <td>
                                                <label>
                                                    <input className="lemma__table__checkbox" checked={is_checked} id={'word_'+id_active_word} data-id={'word_'+id_active_word} type="checkbox" onChange={
                                                        e => {
                                                            if(!e.target.checked) {
                                                                let new_st = this.state.active_phrases;
                                                                    delete new_st[id_active_word];
                                                                this.setState(() => ({ active_phrases: new_st, all_checked: false }))
                                                            } else {
                                                                this.setState(prevState => ({
                                                                    active_phrases: {
                                                                        ...prevState.active_phrases,
                                                                        [id_active_word]: {
                                                                            id_active_phrase: id_active_word, id, word_index, j:0, head_id: item.head_id, action: 'DELETE_WORD', elem: 'WORD'
                                                                        }
                                                                    },
                                                                    all_checked: false
                                                                    }
                                                                ))
                                                            }
                                                        }           
                                                    } 
                                                    />
                                                    <label htmlFor={'word_'+id_active_word}></label>
                                                    <span></span>
                                                </label>
                                            </td>
                                            <td className={`lemma__word ${ws_class}`}>{item.word}</td>
                                            <td>{item.repeating}</td>
                                            <td style={{ zIndex: (slice_data.length-i), position: 'relative' }}>
                                                <Slider fade={true} arrows={true} slidesToShow={1} infinite={false}>
                                                    {
                                                        item.phrases.sort((a,b) => b.selected - a.selected).map((phrase, j) => {
                                                            const active_class = (phrase.selected) ? 'lemma__phrase--active' : ''
                                                            const _phr = phrase.phrase
                                                            const id_active_phrase = `${id}|${word_index}|${j}|${item.head_id}`

                                                            // Если НЕ идет просмотр архивов и фраза архивирована 
                                                            if(!this.state.archive_view && phrase.archived) return '';

                                                            return <div key={j} className={`lemma__table__cell`}>
                                                                    <div className="lemma__table__cell__top">
                                                                        
                                                                    <p onClick={() => {
                                                                        // Если слово уже закреплено за словом в курсе, то редактируем его
                                                                        onSetActive(id, word_index,j, item.head_id)
                                                                    }} className={`lemma-item lemma__table__phrase ${active_class}`}>{_phr.trim()}</p>
                                                                    </div>
                                                                    <div className="lemma__table__cell__bottom">
                                                                        <div className="lemma__table__cell__checkbox">
                                                                            <label>
                                                                                <input type="checkbox" data-id={'phr_'+id_active_phrase} onChange={
                                                                                    () => this.setState(prevState => ({
                                                                                        active_phrases: {
                                                                                            ...prevState.active_phrases,
                                                                                            [id_active_phrase]: {
                                                                                                id_active_phrase, id, word_index, j, head_id: item.head_id, elem: 'PHRASE'
                                                                                            }
                                                                                        }
                                                                                    }), () => {
                                                                                    const is_checked = $(`[data-id="phr_${id_active_phrase}"`).is(':checked')
                                                                                    if(!is_checked) {
                                                                                        let new_st = this.state.active_phrases;
                                                                                            delete new_st[id_active_phrase];
                                                                                        this.setState(() => ({ active_phrases: new_st }))
                                                                                    }
                                                                                    }
                                                                                    )
                                                                                } 
                                                                                />
                                                                                <span>
                                                                                </span>
                                                                            </label>
                                                                        </div>
                                                                        <div className={`lemma__phrases-selector mr-3`}>
                                                                            Редактировать
                                                                            <i className="material-icons">expand_more</i>
                                                                            <div className="lemma__phr-control__btns">
                                                                                <a href="" onClick={e => {
                                                                                    e.preventDefault()

                                                                                    showInpEdit(_phr, data => {
                                                                                        onUpdatePhrase(id, word_index, j, item.head_id, data)
                                                                                    })
                                                                                }}>Редактировать текст</a>
                                                                                <a href="" onClick={e => {
                                                                                    e.preventDefault()
                                                                                    let total_phrase = this.props.phrase.replace(_phr, `<b class="lemma-m-text__b">${_phr}</b>`)
                                                                                    const m_id = uuid(),
                                                                                        m_id_html = `#${m_id}`

                                                                                    openModal(m_id, 0, `<p class="lemma-m-text">${total_phrase}</p>`, inst => {
                                                                                        let elem_to_scroll = $(`${m_id_html} .lemma-m-text__b`)

                                                                                        if(elem_to_scroll.length) {
                                                                                            $(m_id_html).scrollTop( elem_to_scroll.offset().top - 200 )
                                                                                        }
                                                                                    })
                                                                                }}>Показать в тексте</a>
                                                                                <a href="" onClick={e => {
                                                                                    e.preventDefault()

                                                                                    onDoPhrase(id, word_index, j, item.head_id, 'ARCHIVE')
                                                                                }}>Архивировать фразу</a>
                                                                                <a href="" onClick={e => {
                                                                                    e.preventDefault()

                                                                                    if(confirm('Вы действительно хотите провести удаление?')) {
                                                                                        onDoPhrase(id, word_index, j, item.head_id)
                                                                                    }
                                                                                }}>Удалить фразу</a>
                                                                            </div>
                                                                        </div>
                                                                        <div onClick={() => {
                                                                            if(phrase.word_id) {
                                                                                if(self.loadWord) self.loadWord(phrase.word_id)
                                                                            }
                                                                        }} className={`lemma__phrases-selector lemma__phrases-selector--green`}>
                                                                            Редактировать в курсе
                                                                        </div>
                                                                    </div>
                                                            </div>
                                                        })
                                                    }
                                                </Slider>
                                            </td>
                                        </tr>
                                    )
                                }) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="lemma__pagination__block lemma__phrases__pagination__block">
                    {/*TODO - убрать крайние ссылки*/}
                    {(data.length >= 10) ? 
                    <div className="fingman__phrases__pagination">
                        <a href="" onClick={e => { e.preventDefault(); this.paginate((from_slice-1<0?0:from_slice-1)) }} className="pagination__item pagination__prev">&lt;</a>
                        {showPagination()}
                        <a href="" onClick={e => { e.preventDefault(); this.paginate((from_slice+1>COUNT_SYMB_PAG?from_slice:from_slice+1)) }} className="pagination__item pagination__next">&gt;</a>
                    </div> : ''}
                    <div className="lemma__delete">
                        <a href="" className={`btn-new btn-new--grey mr-3`} onClick={e => {e.preventDefault(); onDeleteLemma(id,data[0].head_id);}}>Удалить таблицу</a>
                        <a href="#top" className="top-btn">&uarr;</a>
                    </div>
                    
                </div>

            </React.Fragment>
        )
    }
}