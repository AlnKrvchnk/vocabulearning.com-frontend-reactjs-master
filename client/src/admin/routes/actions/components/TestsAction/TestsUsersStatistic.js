import React from 'react'
import { getCurrentUserToken, uniqueArrObj, openModal} from '../../../../../functions'
import Axios from 'axios'
import API from '../../../../../config/API'
import Button from '../../../../../global-components/layout/Button'

const TOKEN = getCurrentUserToken()
export default class TestsUsersStatistic extends React.Component  {
    constructor (props) {
        super (props)
        
        this.state = {
            
        }

        this.showResult = this.showResult.bind(this)
        this.showAllResults = this.showAllResults.bind(this)
    }

    showResult (result, type_data = 'REACT') {
        const result_obj = JSON.parse(result.results)
        let data_return = ''
        if(type_data == 'REACT') {
            data_return = <p>
                <h6>Тест №ID {result.id}</h6><br/>
                Дата начала: {result_obj.date_start}<br/>
                Дата окончания: {result_obj.date_end}<br/>
                Верные ответы: {result_obj.valid_answers}<br/>
                Неверные ответы: {result_obj.invalid_answers}<br/>
                Курс пройден (%): на {result_obj.test_has_finished}
            </p>
        } else if (type_data == 'HTML') {
            data_return = `<p>
                <h6>Тест №ID ${result.id}</h6><br/>
                Дата начала: ${result_obj.date_start}<br/>
                Дата окончания: ${result_obj.date_end}<br/>
                Верные ответы: ${result_obj.valid_answers}<br/>
                Неверные ответы: ${result_obj.invalid_answers}<br/>
                Курс пройден (%): на ${result_obj.test_has_finished}
            </p>
            `
        }

        return data_return
    }

    showAllResults (results, user_id, user_login) {
        let full_html = `<h3>Пользователь - ${user_login}</h3>`

        results.filter(item => item.user_id == user_id).forEach(item => {
            full_html += this.showResult(item, 'HTML')
        })

        openModal('statistic-user-test',300, full_html)
    }

    render() {
        let { test_results, r_cls } = this.props
        let default_results = test_results

        test_results = uniqueArrObj(test_results, 'user_info');

        return (
            <div className={r_cls + '__create col-md-12'}>
                <h4>Результаты учеников</h4>
                
                <table className="table table-bordered bg-white">
                    <thead>
                        <tr>
                            <th>Пользователь</th>
                            <th>Последний результат</th>
                        </tr>
                    </thead>
                    <tbody>
                        {test_results.length ? test_results.map((result, i) => {
                            console.log(default_results)
                            return <tr key={i}>
                                <td>{result.user_info}</td>
                                <td>
                                    {this.showResult(result)}
                                    <Button title={'Показать все результаты'} onChange={() => this.showAllResults(default_results, result.user_id, result.user_info)} />
                                </td>
                            </tr>
                        }) : ''}
                    </tbody>
                </table>
            </div>
        )
    }
}