import React from 'react'
import axios from 'axios'
import API from '../../../../../../../config/API'
import { getCurrentUserToken, clearInput } from '../../../../../../../functions'
import Input from '../../../../../../../global-components/layout/Input'
import { File } from '../../../../../../../global-components/layout/Inputs'
import Button from '../../../../../../../global-components/layout/Button'

export default class TeachersCourse extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            teachers: [],
            type_show_user_role: (self.userData) ? userData.role : 0
        }

        this.showTeachers = this.showTeachers.bind(this)
        this.deleteTeacher = this.deleteTeacher.bind(this)
        this.addTeacher = this.addTeacher.bind(this)
        this.updateTeacher = this.updateTeacher.bind(this)
        this.showTeacher = this.showTeacher.bind(this)
    }

    showTeacher (teacher, index) {
        const { type_show_user_role } = this.state
        let teacher_data = ''

        if (type_show_user_role >= 1) {
            teacher_data=  (
                <React.Fragment>
                    <form id={'update-teacher-form-'+teacher.id} encType={'multipart/form-data'} className={'update-teacher'}>
                        <a href="" className={'update-teacher__close'} onClick={e => {e.preventDefault(); this.deleteTeacher(teacher.id)}}>
                            <i className="material-icons">close</i>
                        </a>
                        <div className="update-teacher__row update-teacher__row--start">
                            <div className="update-teacher__left">
                                <Input name={'author_name'} val={teacher.name} label={'Автор(ы) курса'} />
                                <Input type={'textarea'} name={'author_descr'} val={teacher.descr} label={'Биография'} />
                            </div>
                            <div className="update-teacher__right">
                                <div className="update-teacher__photo">
                                    <img alt={teacher.name ? teacher.name : ''} src={teacher.photo ? API.host + teacher.photo : '/img/upload-img-preview.jpg'} />
                                </div>
                                <label htmlFor={'author_photo' + teacher.id} className="btn-new update-teacher__photo__btn">
                                    <img src="/img/icons/upload-icon-arrow--white.svg" alt="" className="mr-3" />
                                    Загрузить
                                    <input type="file" name="author_photo" id={'author_photo' + teacher.id} />
                                </label>
                                <Button onChange={() => this.updateTeacher(teacher.id)} title={'Обновить информацию'} color={'#B4D2B6'} customClass={'btn-new btn-update-info'}/>
                            </div>
                        </div>
                        <hr className="fingman__divider"/>
                    </form>
                </React.Fragment>
            )
        } else {
            teacher_data = (
                <React.Fragment>
                    <div className="update-teacher">
                        <div className="update-teacher__row--triple">
                            <div className="update-teacher__col">
                                <img src={API.host + teacher.photo} />
                            </div>
                            <div className="update-teacher__col">
                                <h4>{teacher.name}</h4>
                            </div>
                            <div className="update-teacher__col">
                                <p>{teacher.descr}</p>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }

        return teacher_data
    }

    showTeachers () {
        const { course_id } = this.props

        if(course_id) {
            axios.get(API.host + '/api/teachers/' + course_id).then(response => {
                const {data} = response

                if(data.data && data.success) {
                    this.setState(() => ({ teachers: data.data }))
                }
            })
        }
    }

    deleteTeacher (teacher_id = 0) {
        const { course_id } = this.props

        if(course_id && confirm('Действительно хотите удалить?')) {
            const TOKEN = getCurrentUserToken()

            axios.delete(API.host + '/api/teachers/' + course_id + '/' + teacher_id, {
                headers: {'Authorization': TOKEN}
            }).then(response => {
                const {data} = response

                if(data.success) {
                   this.showTeachers()
                }
            })
        }
    }

    updateTeacher (teacher_id) {
        const { course_id } = this.props

        const _form = document.getElementById('update-teacher-form-' + teacher_id)

        const $FormData = new FormData(_form)

        if(_form.author_photo.files.length) {
            $FormData.append('author_photo', _form.author_photo.files[0])
        }

        if(course_id && teacher_id) {
            const TOKEN = getCurrentUserToken()

            axios.put(API.host + '/api/teachers/' + course_id + '/' + teacher_id, $FormData, {
                headers: {'Authorization': TOKEN}
            }).then(response => {
                const { data } = response

                if(data.success) {
                    this.showTeachers()
                }
            })
        }
    }

    addTeacher (e) {
        e.preventDefault()

        const form = e.target;

        const { course_id } = this.props
        const _form = e.target, $FormData = new FormData(_form)

        if(_form.author_photo.files.length) {
            $FormData.append('author_photo', _form.author_photo.files[0])
        }

        if(course_id) {
            const TOKEN = getCurrentUserToken()

            axios.post(API.host + '/api/teachers/' + course_id, $FormData, {
                headers: {'Authorization': TOKEN}
            }).then(response => {
                const { data } = response
                _form.reset()           

                if(data.success) {
                    this.showTeachers()
                }
            })
        }
    }

    toggleForm (selector) {
        const form = document.querySelector(selector);
        form.classList.contains(`hidden`) ? form.classList.remove(`hidden`) : form.classList.add(`hidden`)
    }


    componentDidMount () {
        this.showTeachers()
    }

    render() {
        const { teachers, type_show_user_role } = this.state

        return (
            <div className="teachers-course">

                {teachers.length ? teachers.map((teacher, i) => {
                    return <div key={i}>{this.showTeacher(teacher, i)}</div>
                }): ''}

                {type_show_user_role >= 1 ? <form onSubmit={this.addTeacher} className={'teachers-course__load hidden'}>
                    <div className="update-teacher__row update-teacher__row--start">
                        <div className="update-teacher__left">
                            <div className="input-field">
                                <Input name={'author_name'} isRequire={true} label={'Автор(ы) курса'} />
                            </div>
                           <div className="input-field">
                               <Input type={'textarea'} name={'author_descr'} isRequire={true} label={'Биография автора'} />
                           </div>
                        </div>
                        <div className="update-teacher__right">
                            <div className="modal__tooltip">
                                <p>Фото автора</p>
                            </div>
                            <label htmlFor={'author_photo_load'} className={'author_photo_load'}>
                                <input type="file" name="author_photo" required={false} id="author_photo_load" />
                            </label>
                        </div>
                    </div>
                    <div className="teachers-course--single">
                        <Button submit title={'Сохранить'} customClass={'btn-new btn-new--grey'} />
                    </div>
                </form> : ''}

                <button className="btn-new btn-addauthor mt-5" onClick={(evt) => {evt.preventDefault(); this.toggleForm(`.teachers-course__load`)}}>
                    <i className="material-icons mr-2">add_circle_outline</i>
                    Добавить автора</button>
            </div>
        )
    }

}
