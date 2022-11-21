import React from 'react'
import {} from './index.less'
import { Col } from '../../../../global-components/layout/Bootstrap'
import { parseDate, getLocal, localDelete, localSave } from '../../../../functions'

import LemmaWordChange from '../LemmaWordChange'
import RangeTextElem from '../../../../global-components/layout/RangeTextElem'

export default class LemmaTextsItem extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            from_slice: 0,
            to_slice: 1,
            default_slice_value: 1,
            max_length_paginate: 0,
            first_row_scroll: [],

            // Дополнительные HTML-элементы
            bookmark_active: null, // закладка,
            bookmark_active_index: -1
        }
        
        this.paginate = this.paginate.bind(this)
        this.changeDefaultSlice = this.changeDefaultSlice.bind(this)
        this.searchFull = this.searchFull.bind(this)
        this.activatePaginate = this.activatePaginate.bind(this)
        this.paginateScroll = this.paginateScroll.bind(this)
        this.toggleLocalSavePage = this.toggleLocalSavePage.bind(this)
        this.toggleReaderBookmark = this.toggleReaderBookmark.bind(this)
    }

    paginateScroll(from_slice, scroll_top_auto = false) {
        let scrollingElementRoot = $('.reader__container__text')
        let offsetElementRoot = scrollingElementRoot[0].offsetTop
        let scroll_top = (scroll_top_auto) ? scroll_top_auto : from_slice * this.state.default_slice_value

        scrollingElementRoot.scrollTop( scroll_top )

        let first_row_scroll = []
        $('.lemma-word-change-item').each(function () {
            let offset_item = this.offsetTop - offsetElementRoot

            if(scroll_top + $(this).height() >= offset_item && scroll_top <= offset_item) {
                first_row_scroll.push( $(this).data('index') )
            }  
        })

        if(first_row_scroll.length) {
            this.setState(() => ({ first_row_scroll }))
        }
    }

    activatePaginate (cb) {
        let reader_elements_height = $('.reader__container .lemma').height(),
            reader_container_height = $('.reader__container__text').height(),
            count_paginate_elements = Math.floor( reader_elements_height / reader_container_height )

        if(this.state.max_length_paginate !== count_paginate_elements) {
            this.setState(() => ({
                default_slice_value: reader_container_height,
                max_length_paginate: count_paginate_elements
            }), cb)
        }
    }
    
    componentDidUpdate () {
        this.activatePaginate(() => {
            this.toggleLocalSavePage(true)
        })
    }

    componentDidMount () {
        this.activatePaginate(() => {
            this.toggleLocalSavePage(true)
        })
        
        // const readerHamburger = document.querySelector('.reader__range__hamburger');
        const navbarHamburger = document.querySelector('#navHamburger');
        const readerRange = document.querySelector('#reader__range__range');
        const navHamburger = document.querySelector('#navHaburger');
        const readerModal = document.querySelector('#readerModal');
        const highLightModal = document.querySelector('#highLightModal');
        const readerHighlight = document.querySelector('.reader--highlight');

        const showWordsBtn = document.getElementById('showWords');
        const showPhrasesBtn = document.getElementById('showPhrases');

        const highLightModalHamburger = document.getElementById("modalHamburger");

        // if(readerHighlight) {
        //     readerHamburger.addEventListener('click', function(e){
        //         e.preventDefault();
        //         readerRange.classList.toggle('d--none');
        //         readerHamburger.classList.toggle('hamburger--cross');
        //     });
        //     readerHighlight.addEventListener('click', function(e){
        //         e.preventDefault();
        //         highLightModal.classList.toggle('hide');
        //         highLightModal.classList.toggle('show');
        //         highLightModalHamburger.classList.add('hamburger--cross');
        //     });
        //     navHamburger.addEventListener('click', function(e){
        //         e.preventDefault();
        //         readerModal.classList.toggle('hide');
        //         readerModal.classList.toggle('show');
        //         navHamburger.classList.toggle('hamburger--cross');
        //     });
        // }

        // highLightModal.addEventListener('click', function(){
        //     highLightModal.classList.remove('show');
        //     highLightModal.classList.add('hide');
        // });

        showWordsBtn.addEventListener('click', function(e){
            // e.preventDefault();
            // this.classList.toggle('modal--active');
            // let icon = this.querySelector("i");
            // icon.classList.toggle('fa-eye');
            // icon.classList.toggle('fa-eye-slash');
        });
        showPhrasesBtn.addEventListener('click', function(e){
            // e.preventDefault();
            // this.classList.toggle('modal--active');
            // let icon = this.querySelector("i");
            // icon.classList.toggle('fa-eye');
            // icon.classList.toggle('fa-eye-slash');
        });

        if(highLightModalHamburger) {
            highLightModalHamburger.addEventListener('click', function(e){
                highLightModal.classList.toggle('show');
                highLightModal.classList.toggle('hide');
            });
        }

        let modalFontsBtns = document.querySelector('.modalFonts__btns');
        modalFontsBtns.addEventListener('click', function(e){
            if(e.target.classList.contains('btn')) {
                const selected = this.querySelector('.modal--active');
                if (selected) {
                selected.classList.remove('modal--active');
                }

                e.target.classList.add('modal--active');
            }
        });

        let navbarBookmark = document.querySelector('.navbar__bookmark');
        navbarBookmark.addEventListener('click', function(e){
            e.preventDefault();
            let bookmark = navbarBookmark.firstChild;
            bookmark.classList.toggle('fas');
            bookmark.classList.toggle('far')
        });
    }

    componentWillReceiveProps (props) {
        if(props.data && this.props.data) {
            this.setState(() => ({
                from_slice: 0,
                to_slice: 1
            }), () => {
                this.toggleLocalSavePage(true)
            })
        }
    }

    searchFull (data = []) {
        let { type_text_view = 0, search_text = '', } = this.props

        // Если поисковая фраза более 2х символов
        if(search_text.length >= 2) {
            if(type_text_view === 0)
                return data.filter(item => {
                    return item.lemma_text.toUpperCase().indexOf(search_text.toUpperCase()) > -1
                })
        } 

        // Если поисковой фразы не найдено, отдаем дефолт
        return this.props.data
    }

    changeDefaultSlice (e) {
        const val = parseInt(e.target.value)

        if(!isNaN(val)) {
            this.setState(() => ({
                default_slice_value: val
            }))
        }
    }

    paginate (from_slice, cb) {
        (from_slice < 0) ? from_slice = 0 : ''

        if(from_slice > this.state.max_length_paginate) from_slice -= 1

        let bookmark_active = this.state.from_slice !== this.state.bookmark_active_index

        this.setState(() => ({
            from_slice,
            to_slice: from_slice+1,
            bookmark_active
        }), () => {
            this.paginateScroll (from_slice)

            if(cb) cb()
        })  
    }

    toggleLocalSavePage (set_current_page = false) {
        let { course_id, head_id } = this.props
        let { bookmark_active, first_row_scroll, bookmark_active_index, from_slice } = this.state

        let user_id = (self.userData) ? self.userData.id : 0

        const ID_PAGE_READER = `reader_${course_id}_${head_id}_${user_id}`
        const CURRENT_PAGE_READER = localStorage.getItem(ID_PAGE_READER)

        const DATA_TO_SAVE = JSON.stringify({
            current_page: from_slice,
            first_row_scroll
        })

        if(set_current_page && CURRENT_PAGE_READER) {
            const DATA = JSON.parse(CURRENT_PAGE_READER)
            let LAST_ELEMENT_FIRST_ROW_INDEX = Number( DATA.first_row_scroll[0] ).first_row_scroll,
                LAST_ELEMENT_FIRST_ROW_SCROLL = $('.lemma-word-change-item[data-index="'+LAST_ELEMENT_FIRST_ROW_INDEX+'"]')

            this.paginate (DATA.current_page, () => {
                if(LAST_ELEMENT_FIRST_ROW_SCROLL.length) {
                    LAST_ELEMENT_FIRST_ROW_SCROLL = LAST_ELEMENT_FIRST_ROW_SCROLL[0].offsetTop  
                    console.log(LAST_ELEMENT_FIRST_ROW_SCROLL)
                    this.paginateScroll( this.state.from_slice, LAST_ELEMENT_FIRST_ROW_SCROLL )
                }
            })
            this.toggleReaderBookmark(true, false)
        } else {
            // Если текущая страница уже есть и ПРОШЛАЯ страница = НОВОЙ странице 
            if(!bookmark_active) {
                localStorage.removeItem(ID_PAGE_READER)
            } else {
                localStorage.setItem(ID_PAGE_READER, DATA_TO_SAVE)
            }
        }

        return CURRENT_PAGE_READER
    }

    // Toggle Reader Bookmark
    toggleReaderBookmark (value = null, save_local = true) {
        this.setState(prevState => ({
            bookmark_active: (value !== null) ? value : !prevState.bookmark_active,
            bookmark_active_index: (value === true || !prevState.bookmark_active) ? prevState.from_slice : -1
        }), () => {
            if(save_local)
                this.toggleLocalSavePage()
        })
    }

    // Toggle footer range
    toggleFooterRange (e){
        e.preventDefault();
        let footerRange = document.querySelector("#reader__range__bottom");
        let readerRangeButton = document.querySelector('#reader__range__hamburger');
        readerRangeButton.classList.toggle('hamburger--cross');
        footerRange.classList.toggle('d--none');
    }

    // Toggle Reader Modal
    toggleReaderModal (e) {
        e.preventDefault();
        let navbarHamburger = document.querySelector('#navHamburger');
        let readerModal = document.querySelector('#modal-LemmaReaderModal');
        if (readerModal.classList.contains('open')) {
            navbarHamburger.classList.add('hamburger--cross');
        } else {
            navbarHamburger.classList.remove('hamburger--cross');
        }
        
    }
    
    render() {
        let { from_slice, to_slice, default_slice_value, max_length_paginate, bookmark_active, bookmark_active_index } = this.state

        let { data, type_text_view, onDeleteFragment, is_course_page, words, onLoadInfoWord, showWords = false, header_title ='' } = this.props

        // Поиск
        data = this.searchFull(data)

        /*let COUNT_SYMB_PAG = Math.floor( data.length/default_slice_value ),
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

        $('.app-lemma-texts__item').height()

        let slice_data = data.slice(from_slice*default_slice_value, to_slice*default_slice_value)*/

        return (
            <React.Fragment>

                <nav className="navbar navbar-light d-flex justify-content-between reader__navbar">
                    <ul className="navbar-nav flex-row w--80">
                    <li className="nav-item">{header_title}</li>
                    </ul>
                    <div className="reader__navbar__bookmark">
                        <a className="navbar__bookmark" onClick={e => {
                            e.preventDefault()
                            this.toggleReaderBookmark()
                        }}>
                            <i className="material-icons navbar__bookmark__icon">{bookmark_active && bookmark_active_index === from_slice ? 'bookmark' : 'bookmark_border'}</i>
                        </a>
                    </div>
                    <a href="#modal-LemmaReaderModal" className="modal-trigger reader__navbar__hamburger" id="navHamburger" onClick={this.toggleReaderModal}><span></span><span></span><span></span></a>
                </nav>
                <div className="app-lemma-texts__item reader__container__text">
                    
                    {data.length ? data.map((item, i) => {
                        return <div key={i} className="app-lemma-text">
                            {/* <p><b>Фрагмент создан {parseDate(item.created_at)}</b></p> */}

                            {type_text_view !== 0 ? 
                                <LemmaWordChange showWords={showWords} onClickChip={data => {
                                    onLoadInfoWord(data)
                                }} words={words} type_text_view={type_text_view} is_admin={true} is_other_page={true} mark_text={this.props.search_text} lemmaTextChanged={JSON.parse(item.lemma_text_json)} onTextChange={(index, $text) => {
                                    this.props.updateLemmaTexts(index, item)
                                }} lemmaTextLast={item.lemma_text} lemmaTextChangeCallback={this.props.sendLemmaText} />
                            : <RangeTextElem text={item.lemma_text} search_text={this.props.search_text} />}

                            {!is_course_page ? <a href={item.id} onClick={e => {
                                e.preventDefault()
                                onDeleteFragment(item.id)
                            }}>Удалить фрагмент</a> : ''}
                        </div>
                    }) : ''}
                    
                    
                    {  /*
                        (data.length > default_slice_value) ? <ul className="pagination justify-content-end">
                        <li className="page-item">
                            <a onClick={e => { e.preventDefault(); this.paginate((from_slice-1<0?0:from_slice-1)) }} className="page-link" href="#" tabIndex="-1">&lt;</a>
                        </li>
                        {showPagination()}
                        <li className="page-item">
                            <a onClick={e => { e.preventDefault(); this.paginate((from_slice+1>COUNT_SYMB_PAG?from_slice:from_slice+1)) }} className="page-link" href="#">&gt;</a>
                        </li>
                    </ul> : ''*/}
                </div>
                <div className="reader__container__footer">
                    <div className="reader__container__nav">
                        <div className='reader__container__arrow reader__container__arrow__left'>
                            <a onClick={e => { e.preventDefault(); this.paginate(this.state.from_slice-1) }}>
                                <img src="/img/down-arrow-new.svg" width="20" />
                            </a>
                        </div>
                        <div className="reader__range">
                            <div className="reader__range__small" id="reader__range__small">
                                {from_slice+1} из {max_length_paginate+1}
                            </div>
                            <form className="reader__range__range" id="reader__range__bottom">
                                <input onChange={e => this.paginate(Number(e.target.value))} value={from_slice} className="bottom-range" type="range" min={0} max={max_length_paginate} /> 
                            </form>
                        </div>
                        <div className='reader__container__arrow reader__container__arrow__right'>
                            <a onClick={e => { e.preventDefault(); this.paginate(this.state.from_slice+1) }}>
                                <img src="/img/down-arrow-new.svg" width="20" />
                            </a>
                        </div>
                    </div> 
                </div>
            </React.Fragment>
        )
    }
}