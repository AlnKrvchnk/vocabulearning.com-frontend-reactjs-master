import React from 'react'

export default function ModuleCreateModalInstruction () {
    return (
        <React.Fragment>
            <div className="modal-content">
                <h5>Инструкция к добавлению занятия</h5>
                <p><b>* Все поля обязательны</b></p>

                <p>Для того чтобы создать занятие, нужно:</p>
                <ol>
                    <li>Ввести фразу или предложение (фраза которая будет выделена должна отделяться пробелами)</li>
                    <li>Выделить нужную Вам фразу <span className="red-text">слева направо</span> (выделение не должно затрагивать уже выделенное слово)</li>
                    <li>Заполнить поля (пояснения, морф.признак, тип загрузки)</li>
                </ol>
                <p><b>При повторном вводе фразы / предложения - выделенные слова удаляются.</b></p>
            </div>
            <div className="modal-footer">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat">Закрыть</a>
            </div>
        </React.Fragment>
    )
}