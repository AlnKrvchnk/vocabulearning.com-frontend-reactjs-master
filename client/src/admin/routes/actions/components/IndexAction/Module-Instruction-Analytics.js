import React from 'react'
import Slider from 'react-slick'

export default function ModuleModalInstructionAnalytics () {
    return (
        <React.Fragment>
            <div className="modal-content">
                <a href="#!" className="modal-content_close">
                    <i className="material-icons">close</i>
                </a>
                <Slider fade={true} adaptive={true} arrows={true} slidesToShow={3} infinite={false}>
                    <div className="instruction_slider_item">
                        <h2 className="instruction_slider_heading">Шаг 1</h2>
                        <img src="/img/sliders/analytics-step1.png" />
                        {/* <h5>Инструкция по добавлению аналитики в курс</h5>
                        <p>При подключении аналитики, обязательно указывайте адрес:<br/>https://terminosdeterminos.com/courses/<span className="red-text">АДРЕС_ВАШЕГО_КУРСА</span></p>
                        <p><b>Подключение Яндекс.Метрики</b></p>
                        <p>Скопируйте номер счётчика и вставьте в поле "Номер счётчика Яндекс.Метрики"</p>
                        <img src="/img/screens/screen_metrika.png" width="95%" />

                        <p><b>Подключение Google Analytics</b></p>
                        <p>Скопируйте идентификатор отслеживания и вставьте в поле "Идентификатор отслеживания Google Analytics"</p>
                        <img src="/img/screens/screen_ga.png" width="85%" />

                        <p><b>После всех изменений не забудьте обновить курс нажав на кнопку "Сохранить".</b></p> */}
                    </div>
                    <div className="instruction_slider_item">
                        <h2 className="instruction_slider_heading">Шаг 2</h2>
                        <img src="/img/sliders/analytics-step2.png" />
                        {/* <h5>Инструкция по добавлению аналитики в курс</h5>
                        <p>При подключении аналитики, обязательно указывайте адрес:<br/>https://terminosdeterminos.com/courses/<span className="red-text">АДРЕС_ВАШЕГО_КУРСА</span></p>
                        <p><b>Подключение Яндекс.Метрики</b></p>
                        <p>Скопируйте номер счётчика и вставьте в поле "Номер счётчика Яндекс.Метрики"</p>
                        <img src="/img/screens/screen_metrika.png" width="95%" />

                        <p><b>Подключение Google Analytics</b></p>
                        <p>Скопируйте идентификатор отслеживания и вставьте в поле "Идентификатор отслеживания Google Analytics"</p>
                        <img src="/img/screens/screen_ga.png" width="85%" />

                        <p><b>После всех изменений не забудьте обновить курс нажав на кнопку "Сохранить".</b></p> */}
                    </div>
                    <div className="instruction_slider_item">
                        <h2 className="instruction_slider_heading">Шаг 3</h2>
                        <img src="/img/sliders/analytics-step3.png" />
                        {/* <h5>Инструкция по добавлению аналитики в курс</h5>
                        <p>При подключении аналитики, обязательно указывайте адрес:<br/>https://terminosdeterminos.com/courses/<span className="red-text">АДРЕС_ВАШЕГО_КУРСА</span></p>
                        <p><b>Подключение Яндекс.Метрики</b></p>
                        <p>Скопируйте номер счётчика и вставьте в поле "Номер счётчика Яндекс.Метрики"</p>
                        <img src="/img/screens/screen_metrika.png" width="95%" />

                        <p><b>Подключение Google Analytics</b></p>
                        <p>Скопируйте идентификатор отслеживания и вставьте в поле "Идентификатор отслеживания Google Analytics"</p>
                        <img src="/img/screens/screen_ga.png" width="85%" />

                        <p><b>После всех изменений не забудьте обновить курс нажав на кнопку "Сохранить".</b></p> */}
                    </div>
                
                </Slider>
            </div>
        </React.Fragment>
    )
}