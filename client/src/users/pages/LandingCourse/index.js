import React from 'react'
import {Row} from "../../../global-components/layout/Bootstrap";
import API from "../../../config/API";
import TeachersCourse from '../../../admin/routes/actions/components/IndexAction/components/TeachersCourse';
import './LandingCourse.less';

export default class LandingCoursePage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            name,
            author,
            description,
            languege_termins,
            langueges,
            category_name,
            price,
            land_preview,
            url,
            land_descr,
            land_for_who,
            words,
            id
        } = this.props.course

        if(!this.props.course) return;

        return (
            <div className="landing-desktop">
                <div className="landing-desktop__head">
                    {/* <img src={API.host + land_preview} width={'100%'} /> */}
                    <h1>{name}</h1>
                </div>
                <div className="landing-desktop__who">
                    <div className="landing-desktop__text">
                        <h2>Для кого курс?</h2>
                        <p>{land_for_who}</p>
                    </div>
                </div>
                <div className="landing-desktop__what">
                    <div className="landing-desktop__text">
                        <h2>Особенности, фишки</h2>
                        <p>{land_descr}</p>
                    </div>
                </div>
                <div className="landing-desktop__info">
                    <div className="landing-desktop__info__item">
                        <div className="landing-desktop__info__icon">
                            <img src="../img/icons/icon-learn-mouse-left.svg" alt=""/>
                            <p>Язык, который изучаем</p>
                        </div>
                        <p className="landing-desktop__info--black">{languege_termins}</p>
                    </div>
                    <div className="landing-desktop__info__item">
                        <div className="landing-desktop__info__icon">
                            <img src="../img/icons/icon-learn-mouse-right.svg" alt=""/>
                            <p>Язык, на котором учим</p>
                        </div>
                        <p className="landing-desktop__info--black">{langueges}</p>
                    </div>
                    <div className="landing-desktop__info__item">
                        <div className="landing-desktop__info__icon">
                            <img src="../img/icons/icon-learn-courses.svg" alt=""/>
                            <p>Категория курса</p>
                        </div>
                        <p className="landing-desktop__info--black">{category_name}</p>
                    </div>
                    <div className="landing-desktop__info__item">
                        <div className="landing-desktop__info__icon">
                            <img src="../img/icons/icon-learn-languages.svg" alt=""/>
                            <p>Слов в курсе, шт</p>
                        </div>
                        <p className="landing-desktop__info--black">{words.length}</p>
                    </div>
                </div>
                <div className="landing-desktop__teachers">
                    <h2>Авторы курса</h2>
                    <div className="landing-desktop__teacher">
                        <div className="landing-desktop__teacher__photo">
                            
                        </div>
                        <div className="landing-desktop__teacher__info">
                            <p className="landing-desktop__teacher__label">Автор курса</p>
                            <h2>{author}</h2>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus assumenda quia autem aperiam, vitae fugiat ad unde eaque quos dolorum perferendis corporis qui necessitatibus debitis accusamus, totam, natus tempora in!</p>
                        </div>
                    
                    </div>
                    
                </div>
                <div className="landing-desktop__price">
                    <h2>Стоимость курса</h2>
                    <div className="landing-desktop__prices">
                        <div className="landing-desktop__prices__block landing-desktop__prices__block--month">
                            <p className="landing-desktop__prices__label">Тариф 1 месяц</p>
                            <img src="../img/icons/icon-price-green.svg" alt=""/>
                            <div className="landing-desktop__prices__price">
                                <p className="landing-desktop__prices__price--big">{price}</p>
                                <small>руб./месяц</small>
                                <hr/>
                                <p>1200</p>
                                <small>руб. / полгода</small>
                            </div>
                            <a href="" className="btn btn-new">Оплатить</a>
                        </div>
                        <div className="landing-desktop__prices__block landing-desktop__prices__block--half">
                            <p className="landing-desktop__prices__label">Тариф полугодовой</p>
                            <img src="../img/icons/icon-price-blue.svg" alt=""/>
                            <div className="landing-desktop__prices__price">
                                <p className="landing-desktop__prices__price--big">{price}</p>
                                <small>руб./месяц</small>
                                <hr/>
                                <p>1200</p>
                                <small>руб. / полгода</small>
                            </div>
                            <a href="" className="btn btn-new">Оплатить</a>
                        </div>
                        <div className="landing-desktop__prices__block landing-desktop__prices__block--year">
                            <p className="landing-desktop__prices__label">Тариф 1 год</p>
                            <img src="../img/icons/icon-price-yellow.svg" alt=""/>
                            <div className="landing-desktop__prices__price">
                                <p className="landing-desktop__prices__price--big">{price}</p>
                                <small>руб./месяц</small>
                                <hr/>
                                <p>1200</p>
                                <small>руб. / полгода</small>
                            </div>
                            <a href="" className="btn btn-new">Оплатить</a>
                        </div>
                    </div>
                </div>
                <div className="landing-desktop__cta">
                    <a href={'/courses/' + url}>Перейти на страницу обучения</a>
                </div>                
            </div>
        )
    }
}