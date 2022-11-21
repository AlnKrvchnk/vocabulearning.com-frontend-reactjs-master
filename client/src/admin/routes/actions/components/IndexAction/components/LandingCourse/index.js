import React from 'react'
import API from '../../../../../../../config/API'
import Button from '../../../../../../../global-components/layout/Button'
import { File } from '../../../../../../../global-components/layout/Inputs'
import TextInput from '../../../../../../../global-components/TextInput'
import TeachersCourse from '../TeachersCourse'
import ToolTip from "../../../../../../../global-components/layout/ToolTip/ToolTip";

export default class LandingCourse extends React.Component {
    constructor (props) {
        super(props)
    }

    render() {
        const { land_preview, land_for_who = '', land_descr = '', changeInput, defaultColorSave } = this.props.data
        const link_land = '/land/' + this.props.course_id

        return (
            <div className="course-landing">
                <div className="course-edit__name">
                    <div className="course-name">
                        <div className="course-edit__single">
                            <div className="module-modal-name">
                                <div className="module-modal__name">
                                    <label htmlFor="name">Название курса</label>
                                    <p>{this.props.data.name}</p>
                                </div>
                                <div className="module-modal__page">
                                    <label htmlFor="">Страница</label>
                                    <p>Описание курса</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p>Перейти на лендинг <a href={link_land} target={'_blank'}>{link_land}</a></p>

                <div className="course-landing__row">
                    <div className="course-landing__photo">
                        <p>Шапка лэндинга - Формат изображений: png/jpg/jpeg/svg</p>
                        <label htmlFor="land_preview" className={'land_preview'}>
                            <div className="module-modal-preview__container mr-5 mt-2" style={{
                                backgroundImage: 'url('+API.host + land_preview+')'
                            }}></div>
                            <File elem_id={'land_preview'} type={'image'} onChange={changeInput} name={'land_preview'} />
                        </label>
                    </div>
                    <div className="course-landing__info">
                        <div className="course-landing__info__block">
                            <label htmlFor="land_for_who">Для кого курс?</label>
                            <TextInput type={'textarea'} onChange={changeInput} name={'land_for_who'} val={land_for_who} />
                        </div>
                        <div className="course-landing__info__block">
                            <label htmlFor="land_descr">Как и о чем, особенности, фишки?</label>
                            <TextInput type={'textarea'} onChange={changeInput} name={'land_descr'} val={land_descr} />
                        </div>
                    </div>
                </div>

                <div className="course__landing__authors">
                    <TeachersCourse course_id={this.props.course_id} />
                </div>

                <hr className="fingman__divider"/>
                <button type={"submit"} className={'btn-new btn-createlanding'}>
                    <i className="material-icons mr-3">add</i>
                    Создать лендинг
                </button>
            </div>
        )
    }
}
