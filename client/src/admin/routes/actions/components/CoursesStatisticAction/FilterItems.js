import React from 'react'
import { parseDate } from '../../../../../functions';

/**
 * type - diap (если значение в диапазоне и в items есть значения valTo и valFrom)
 * Если указан type = diap, то значение 'text' не обязательно
 */
export default function FilterItems ({ items, data, customClass = '' }) {
    return (
        items.map((item, i) => {
            return <div className={`m-item ${customClass}`} key={i}>
                {data.type == 'diap' ? parseDate(item.valFrom) + ' - ' + parseDate(item.valTo) : item[data.text]}
                <img src="/img/icons/cancel.svg" onClick={() => {
                    // Удаляем текущий фильтр
                    data.hasClick(i, item)
                }} width="10" />
            </div>
        })
    )
}