import React from 'react'
import Button from '../../../../../global-components/layout/Button'
import { getCurrentUserToken, Toast } from '../../../../../functions'
import Axios from 'axios';
import API from '../../../../../config/API';
import File from '../../../../../global-components/layout/Inputs';

export default class AnotationTab extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            activeTab: 'tab_1',
            currentTab: <p>{this.props.data.explanation_second}</p>,
            currentSelfAssociation: '',
            tabs: [
                {name: '1', fullname: 'Пояснение', id: 'tab_1', $key: 'explanation_word'},
                {name: '2', fullname: 'Этимология', id: 'tab_2', $key: 'etymology'},
                {name: '3', fullname: 'Ассоциация', id: 'tab_3', $key: 'association'},
                {name: '4', fullname: 'Изображение', id: 'tab_4', $key: 'association_image', customClass: 'anotation4__btn' },
                {name: '5', fullname: 'Моё примечание', id: 'tab_5', $key: 'self_association', customClass: 'anotation5__btn', checkIf: !!getCurrentUserToken() && userData.id }
            ]
        }

        this.switchTab = this.switchTab.bind(this)
        this.isClassActiveTab = this.isClassActiveTab.bind(this)
        this.registerMyAnotation = this.registerMyAnotation.bind(this)
    }

    registerMyAnotation (data, cb, is_update_action = false) {
        const TOKEN = getCurrentUserToken();
        const { id, word, course_id } = this.props.data;

        Axios.post(API.host + '/api/word-anotation-register', {
            word_id: id,
            anotation: data,
            course_id,
            user_id: userData.id,
            is_update_action
        }, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            Toast(response.data.message);
            if(cb) cb(response.data)

            this.setState(() => (
                { registerMyAnotation: data }
            ))
        })
    }

    componentDidMount () {
        setInterval(() => {
            this.switchTab(this.state.activeTab)
        }, 1500);
    }

    switchTab (tabID) {
        const {
            explanation_second,
            etymology,
            explanation_word,
            custom_user_anotation,
            id,
            association = '',
            association_image = ''
        } = this.props.data;


        this.setState(() => ({ activeTab: tabID }))
        switch(tabID) {
            case 'tab_1':
                this.setState(() => ({ currentTab: (
                    <p>{explanation_word}</p>
                ) }))
            break;

            case 'tab_2':
                this.setState(() => ({ currentTab: (
                    <p>
                        {etymology ? etymology : 'Преподаватель ещё не установил этимологию данного слова'}
                    </p>
                ) }))
            break;

            case 'tab_3':
                this.setState(() => ({ currentTab: (
                    <span className="association__img__container">
                        {association ? association : 'Преподаватель ещё не установил ассоциацию к данному слову'}
                    </span>
                ) }))
            break;

            case 'tab_4':
                this.setState(() => ({ currentTab: (
                    <span className="association__img__container">
                         {association_image ? <img className="app-tabs__body__associationimage" src={association_image} width={143} height={90}/> : ''}
                         {/*<File type={'image'} validExts={/(\.png|\.jpg|\.jpeg)/g}/>*/}
                    </span>
                ) }))
            break;

            // сase 'tab_4':
            //     this.setState(() => ({ currentTab: (
            //         <span className="association__img__container">
            //                 {association_image ? <img className="app-tabs__body__associationimage" src={association_image} width={143} height={90}/> : <File type={'image'} title={'Загрузить ассоциацию'} />}
            //         </span>
            //     ) }))
            // break;

            case 'tab_5':
                let userAnotation = '';
                let anotationButtonValue = 'Сохранить';
                if (custom_user_anotation[id]) {
                    userAnotation = custom_user_anotation[id].anotation;
                    anotationButtonValue = 'Обновить';
                }

                this.setState(() => ({ currentTab: (
                    /*TODO - чтобы при вводе текста кнопка меняла цвет*/
                    <React.Fragment>
                        <form action="" className="anotation4__form" onSubmit={e => {
                            e.preventDefault()
                            let val = e.target.my_explanation.value;
                            this.registerMyAnotation(val, null, (userAnotation !== ''))
                        }} method="POST">
                            <textarea name="my_explanation" onBlur={event => {
                                let val = event.target.value
                                this.setState(() => ({ currentSelfAssociation: val }))
                            }} maxLength={250} required className="materialize-textarea anotation4__textarea" defaultValue={this.state.currentSelfAssociation ? this.state.currentSelfAssociation : userAnotation} placeholder="Введите свой текст..."></textarea>
                            <Button customClass='anotation4__btn' color="transparent" submit title={anotationButtonValue} />
                        </form>
                    </React.Fragment>
                ) }))
            break;
        }
    }

    isClassActiveTab (cls) {
        if(this.state.activeTab == cls) {
            return 'active';
        }
        return '';
    }

    render() {
        return (
            <div className="app-tabs">
                <div className="app-tabs__row">
                    {
                        this.state.tabs.map((tab, i) => {
                            if(tab.checkIf || tab.checkIf == undefined) {
                                let prop_data = this.props.data[tab.$key]

                                if(prop_data) {
                                    if(prop_data.length <= 2 && tab.$key !== 'explanation_second' && tab.$key !== 'self_association')
                                        return '';
                                } else {
                                    if(tab.$key !== 'self_association') {
                                        return ''
                                    }
                                }

                                let tabText = (tab.id === this.state.activeTab) ? tab.fullname : i+1

                                return <button className={`app-tabs__item ${this.isClassActiveTab(tab.id)}`} key={i} onClick={e => this.switchTab(tab.id) }>{tabText}</button>
                            }
                        })
                    }
                </div>
                <div className="app-tabs__body">
                    {this.state.currentTab}
                </div>
            </div>
        )
    }
}
