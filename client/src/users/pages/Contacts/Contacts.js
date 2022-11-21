import React, { Component } from 'react'
import ContactsForm from './ContactsForm'
import './Contacts.less'

export default class Contacts extends Component {
    render() {
        return (
            <div className="contacts__page">
                <div className="contacts__page__left">
                    <div className="contacts__form">
                        <ContactsForm />
                    </div>
                </div>
                <div className="contacts__page__right">
                    <div>
                        <h3>Нужна помошь?</h3>
                        <hr />
                        <p>
                            <span className="material-icons">local_phone</span>
                            <a href="tel:+74993501224">+7 (499) 350-12-24</a>
                        </p>
                        <p>
                            <span className="material-icons">email</span>
                            <a href="mailto:info@vocabulearning.com">info@vocabulearning.com</a>
                        </p>
                    </div>
                    <div>
                        <h3>Реквизиты</h3>
                        <hr />
                        <p>ООО &laquo;Белталода&raquo;</p>
                        <p>
                            <span className="material-icons">done</span> 
                            <strong>ИНН</strong> 7708362018  
                        </p>
                        <p>
                            <span className="material-icons">done</span> 
                            <strong>ОКПО</strong> 03437016
                        </p>
                        <p>
                            <span className="material-icons">done</span> 
                            <strong>ОГРН</strong> 1197746624350
                        </p>
                        <p>
                            <span className="material-icons">done</span> 
                            <strong>КПП</strong> 770801001
                        </p>
                    </div>
                    <div>
                        <h3>Юридический адрес</h3>
                        <hr />
                        <p>ООО &laquo;Белталода&raquo;</p>
                        <p>
                            <span className="material-icons">pin_drop</span> 107140, г. Москва, ул КРАСНОПРУДНАЯ, ДОМ 7-9, Э 1/ПОМ IV/К 3/ОФ 5
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
