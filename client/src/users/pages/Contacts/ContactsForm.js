import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {useFormik} from 'formik'
import axios from 'axios'

const validate = values => {
    const errors = {};
    if(!values.name) {
        errors.firstName = 'Поле обязательно для заполнения'
    } else if (values.name.length < 2) {
        errors.firstName = 'Должно быть более двух символов'
    }
    if(!values.email) {
        errors.firstName = 'Поле обязательно для заполнения'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Неверный формат e-mail';
    }
    return errors;
};

const ContactsForm = () => {
     const formik = useFormik({
        initialValues: {
            email: '',
            name: '',
            comment: ''
        },
        validate,
        onSubmit: values => {
            console.log(JSON.stringify(values, null, 2))
        }
    });
    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="contacts__form__group">
                <label htmlFor="name">Как к вам обращаться *</label>
                <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                />
                {formik.errors.name ? <div className="error">{formik.errors.name}</div> : null}
            </div>
            <div className="contacts__form__group">
                <label htmlFor="email">Ваш адрес электронной почты *</label>
                <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                />
                {formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
            </div>
            <div className="contacts__form__group">
                <label htmlFor="comment">Сообщение</label>
                <textarea
                name="comment"
                onChange={formik.handleChange}
                value={formik.values.comment}
                />
            </div>
            <div className="contacts__form__group contacts__form__policy">
                <input type="checkbox" defaultChecked value="policy" />
                <p>Отправляя данные Вы подтверждаете согласие с <a href="/policy">Политикой конфиденциальности</a></p>
            </div>
            <button type="submit">Отправить</button>
        </form>
    )
}

export default ContactsForm