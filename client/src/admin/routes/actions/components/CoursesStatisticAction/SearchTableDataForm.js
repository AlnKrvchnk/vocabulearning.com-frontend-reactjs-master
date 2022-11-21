import React from 'react'
import Input from '../../../../../global-components/layout/Input'

export default function SearchTableDataForm ({ onSearchData }) {
    return (
        <div className="row Tsds__page--courses-statistic__search">
            <form action="" className="row d-flex statistic__search__form">
                <Input col={8} name={'search'} label={'Поиск по таблице...'} onChange={(val, target) => {
                    onSearchData(val.trim())
                }} />
            </form> 
        </div>
    )
}