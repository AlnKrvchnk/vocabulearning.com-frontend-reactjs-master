import React from 'react'

import RoutePaths from '../../../users/components/Routes/route-paths'

import axios from 'axios'
import API from '../../../config/API'

import Loader from '../../../global-components/layout/Loader'

import { getCurrentUserToken, Toast } from '../../../functions'
import { Row, Col } from '../../../global-components/layout/Bootstrap'
import Button from '../../../global-components/layout/Button'
import SelectSearch from '../../../global-components/layout/SelectSearch'

export default class CMSAction extends React.Component {
    constructor () {
        super()

        this.state = {
            langueges: defaultLangueges,
            pages: RoutePaths,
            content: {} 
        }

        this.pageView = this.pageView.bind(this)
        this.updateField = this.updateField.bind(this)
        this.loadEmptyPage = this.loadEmptyPage.bind(this)
    }

    loadEmptyPage () {
        __e.f('title', 'Заголовок', 'title', data => {
            if(data.data.success) {
                Toast(data.data.error_message, 'green')
            }
        }, true)
    }

    pageView (e) {
        e.preventDefault()

        // Очищаем контентную часть
        this.setState(() => ({ content: {} }))
        
        const lang = e.target.lang.value
        const path = e.target.page.value

        __e.update_prop('curr_path', path)
        __e.update_prop('lang', lang)

        //this.loadEmptyPage() - если убрать, то свойство title будет обнуляться

        __e.loadAll(data => {
            const curr_content = data.data[lang + '|' + path]

            if(data.success && curr_content) return this.setState(() => ({
                content: curr_content
            }))

            this.loadEmptyPage()
        }, false)
    }

    updateField (e, full_name) {
        const name = e.target.name
        const val = e.target.value

        __e.f(name, full_name, val, data => {
            if(data.data.success) {
                Toast(data.data.error_message, 'green')
            }
        }, true)
    }
    
    render() {
        const { langueges, pages, content } = this.state
        const values_content = (content) ? Object.entries(content) : []

        if (self.__user_role < 2) return <h2>У вас нет прав на данный раздел!</h2>

        return (
            <div className="Tsds__page Tsds__page--settings" id="settings-page">
                <h1>CMS</h1>

                <Col col='m12'>
                    <form onSubmit={this.pageView}>
                        <SelectSearch 
                            placeholder={'Выберите язык'} 
                            name={'lang'}
                            value={''}
                            required={1}
                            dataOnMap={langueges}
                            onMapItems={(item, i) => {
                                return <option key={i} value={item.value}>{item.title} - {item.value}</option>
                            }}
                        />

                        <SelectSearch 
                            placeholder={'Выберите страницу'} 
                            name={'page'}
                            value={''}
                            required={1}
                            dataOnMap={pages}
                            onMapItems={(item, i) => {
                                return <option key={i} value={item.path}>Страница "{item.page_name}" - {item.path}</option>
                            }}
                        />
                        <Button submit title={'Показать контент'} />
                    </form>
                </Col>
                <Col col='m12'>
                    {values_content.length ? <form>
                        <table className="table table-bordered bg-white">
                            <thead className="thead-light2">
                                <tr>
                                    <th className="resizable">Контент поля страницы</th>
                                    <th className="resizable">Поле для редактирования</th>
                                </tr>
                            </thead>
                            <tbody>
                                {values_content.map((item, i) => {
                                    if(item[0] && item[1]) {
                                        return <tr key={i}>
                                            <td>{item[1].value}</td>
                                            <td>
                                                <p>{item[1].name}</p>
                                                <textarea onBlur={e => this.updateField(e, item[1].name)} className="materialize-textarea" defaultValue={item[1].value} name={item[0]} placeholder={'Значение...'} />
                                            </td>
                                        </tr>
                                    }
                                })}
                            </tbody>
                        </table>
                    </form> : ''}
                </Col> 
            </div>  
        )   
    }
}