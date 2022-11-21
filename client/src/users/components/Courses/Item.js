import React from 'react'
import { Link } from 'react-router-dom'

import L from '../../../config/languege'

import Button from '../../../global-components/layout/Button'

export default function CourseItem ({ author, theme, lang_terms, lang, cw, image, title, descr, price, id, hideBtn, url}) {
    let $lang = 'Неизвестный';

    if(_defaultLangs[lang]) {
        $lang = _defaultLangs[lang];
    }

    let $author = author.split('-');
    let $valid_authors = [];
    $author = $author.forEach($a => {
        let splAuthor = $a.trim().split('/');
        if(splAuthor.length >= 2) {
            $valid_authors.push({
                name: splAuthor[0],
                regal: splAuthor[1],
                job: (splAuthor[2]) ? splAuthor[2] : 'Работа не указана'
            });
        } 
    });


    function moreButtonClick (e){
        // для обработки клика по кнопке "подробнее"
        e.preventDefault();
        const element = e.target;
        const parent = element.parentNode.parentNode;
        const revealElement = parent.querySelector('.card-reveal');
        if(revealElement.style.display === 'block') {
            revealElement.style.display = 'none';
            revealElement.style.height = '0px';
        } else {
            revealElement.style.display = 'block';
            revealElement.style.height = 'auto';
        }
    }

    function showTitle(title) {
        if (title.length > 35) {
            return <span title={title}>{title.substr(0, 25)} ...</span>
        } else {
            return <span>{title}</span>
        }
    }
    return (
        <div className="col">
            <div className="card course-item Tsds-english__course">
                <div className="card-image waves-effect waves-block waves-light">
                    {image ? <img className="activator" src={image} /> : <div className="card-defaultImage"><p>No photo available</p></div>}
                </div>
                <div className="card-content">
                    {/* <span className="card-content__theme">{theme}</span> */}
                    <p className="card-title card-content__title activator">{showTitle(title)}</p>
                    <span className="card-content__language">Язык курса: <span className="card-content__language__name">{window._defaultLangs[lang_terms]}</span></span>
                    <span className="card-content__language">Термины: <span className="card-content__language__name">{$lang}</span></span>
                    <div className="card-content__more">
                        <a href="" className="card-content__more__button" onClick={moreButtonClick}>Подробнее</a>
                    </div>
                    <hr className="card-horizontal-divider"/>
                    <div className="card-content__price__block">
                        <span className="card-content__price">{price} р.</span>
                    </div>
                    <div className="card-reveal" style={{display: 'none', height: '0px'}}>
                        <div className="card-reveal__item">
                            <div className="card-reveal__item__left">
                                <p className="card-reveal__item__text">Количество слов</p>
                            </div>
                            <div className="card-reveal__item__right">
                                <p className="card-reveal__item__info">{cw}</p>
                            </div>
                        </div>
                        <div className="card-reveal__item">
                            <div className="card-reveal__item__left">
                                <p className="card-reveal__item__text">Преподаватель</p>
                            </div>
                            <div className="card-reveal__item__right card-reveal__item__teachers">
                                {$valid_authors.length ? $valid_authors.map((_author, i) => {
                                    return <div key={i} className="card-reveal__item__teacher">
                                        <p className="card-reveal__item__info">{_author.name}</p>
                                        <p className="card-reveal__item__text">{_author.regal}, {_author.job}</p>
                                    </div>
                                }) : 'Автор не найден'}
                            </div>
                        </div>
                        <div className="card-reveal__item">
                            <a href="" className="card-reveal__item__link">Отзывы</a>
                        </div>
                    </div>
                    {(hideBtn) ? '' : <Link to={'/courses/' + url} className="card__start__button">
                    {L.current.pages.index.startLearningButton}
                        {/* <a href="" className="card__start__button">{L.current.pages.index.startLearningButton}</a> */}
                    </Link>}
                </div>

            </div>
        </div>
    )
}