import React, { Component } from 'react'
import './Prices.less'

export default class Prices extends Component {
    render(){
        function handleFaqClick(e) {
            e.preventDefault();
            const faqDescrContainer = e.target.nextSibling;
            const faqLink = e.target;
            const faqIcon = e.target.querySelector('i');
            faqLink.classList.toggle('clickedLink')
            faqDescrContainer.classList.toggle('changeHeight');
            faqIcon.classList.toggle('fa-plus');
            faqIcon.classList.toggle('fa-minus');
        }
        return (
            <div className={'prices'}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mt-5 mb-5 mt-5">
                            <p>На платформе Вокабулернинг Вы можете создавать собственные интерактивные обучающие курсы для изучения иностранных или национальных языков.</p>
                            <p>Курсы на Вокабулернинге помогут Вашим ученикам в изучении, улучшении, развитии словарного запаса. Методики, которые используются в Вокабулернинг, созданы в соответствии с последними научными исследованиями о том, как именно люди запоминают информацию.</p>
                            <p>Именно поэтому ваш собственный курс, созданный на Вокабулернг-платформе, станет идеальным дополнением к любому курсу или школе изучения языков. </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mt-5 mb-5">
                            <h2>Без абонентской платы</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mt-5 mb-5 d-flex align-items-start justify-content-between flex-wrap">
                            <div className="prices__item__big">
                                <div className={"prices__item__heading"}>
                                    <h3>Тариф 40-35</h3>
                                </div>
                                <div className={"prices__item__info"}>
                                    <ul className="prices__item__list">
                                        <li>40 % с каждой продажи</li>
                                        <li>500 р. в месяц до 500 пользователей в месяц</li>
                                        <li><strong>0 р. в месяц свыше 500 пользователей + 35 % с каждой продажи</strong></li>
                                        <li><strong>оплата через платформу Вокабулернинг</strong></li>
                                    </ul>
                                    <div className={"prices__item__smallText"}>
                                        <p>В этом случае у вас нет необходимости создавать свое ООО или ИП.</p>
                                        <p>Мы заключаем договор между вами как физическим лицом и автором курса.</p>
                                        <p>Все платежи проходят через платформу и налог на прибыль оплачивает платформа</p>
                                    </div>
                                </div>
                            </div>
                            <div className="prices__item__big">
                                <div className={"prices__item__heading"}>
                                    <h3 >Тариф 30-25</h3>
                                </div>
                                <div className={"prices__item__info"}>
                                    <ul className="prices__item__list">
                                        <li>30 % с каждой продажи</li>
                                        <li>500 р. в месяц до 500 пользователей в месяц</li>
                                        <li><strong>0 р. в месяц свыше 500 пользователей + 25 % с каждой продажи</strong></li>
                                        <li><strong>оплата через платформу Вокабулернинг</strong></li>
                                    </ul>
                                    <div className={"prices__item__smallText"}>
                                        <p>Данный тариф подойдет для самозанятых и ИП. Оплата происходит на ваши расчетные счета.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <h2>C абонентской платой</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 d-flex align-items-center justify-content-between flex-wrap">
                            <div className="prices__item__small">
                                <div className="prices__item__small__heading">
                                    <h3>Стандартный</h3>
                                </div>
                                <div className="prices__item__small__text">
                                    <p>3000 рублей / месяц</p>
                                    <p>до 5000 пользователей</p>
                                </div>
                            </div>
                            <div className="prices__item__small">
                                <div className="prices__item__small__heading">
                                    <h3>Выгодный</h3>
                                </div>
                                <div className="prices__item__small__text">
                                    <p>2500 рублей / месяц</p>
                                    <p>до 5000 пользователей</p>
                                    <p>+ лендинг в подарок</p>
                                </div>
                            </div>
                            <div className="prices__item__small">
                                <div className="prices__item__small__heading">
                                    <h3>Премиум</h3>
                                </div>
                                <div className="prices__item__small__text">
                                    <p>3000 рублей / месяц</p>
                                    <p>до 5000 пользователей</p>
                                    <p>+ лендинг в подарок</p>
                                    <p>+ таргетинг для одной соцсети</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Часто задаваемые вопросы</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 prices__faq">
                            <div className="prices__faq__item">
                                <a href="" onClick={handleFaqClick} className="prices__faq__item__link">Можно ли разместить курс на собственном домене? <i className="fas fa-plus"></i></a>
                                <div className="prices__faq__descr">
                                    <p>Да. Вы можете подключить курс, созданный Вами на вокабулернинге, к вашему домену второго уровня. Например www.mylanguagecourse.ru</p>
                                </div>
                            </div>
                            <div className="prices__faq__item">
                                <a href="" onClick={handleFaqClick} className="prices__faq__item__link">Могу ли я создавать курсы национальных языков? <i className="fas fa-plus"></i></a>
                                <div className="prices__faq__descr">
                                    <p>Да. Вы можете создавать современные интерактивные курсы на сервисе Вокабулернинг для любых языков.</p>
                                </div>
                            </div>
                            <div className="prices__faq__item">
                                <a href="" onClick={handleFaqClick} className="prices__faq__item__link">Какие алфавиты можно использовать? <i className="fas fa-plus"></i></a>
                                <div className="prices__faq__descr">
                                    <p>Практически любые</p>
                                </div>
                            </div>
                            <div className="prices__faq__item">
                                <a href="" onClick={handleFaqClick} className="prices__faq__item__link">Можно ли нескольким людям одновременно администрировать курс? <i className="fas fa-plus"></i></a>
                                <div className="prices__faq__descr">
                                    <p>Да.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}