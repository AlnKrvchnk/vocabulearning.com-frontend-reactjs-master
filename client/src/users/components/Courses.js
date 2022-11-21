import React from 'react'

import Loader from '../../global-components/layout/Loader'
import CoursesList from './Courses/List'

import {closeSidebar} from "../../functions";

import M from 'materialize-css'

import API from '../../config/API'
import axios from 'axios'

export default class Courses extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            isLoading: true,
            courses: []
        }

        this.LoadCourses = this.LoadCourses.bind(this);

        this.LoadCourses();
    }

    LoadCourses () {
        axios.post(`${API.host}/courses`).then(response => {
            console.log(response)
            this.setState(prevState => ({
                isLoading: !prevState.isLoading,
                courses: response.data.data,
                courses_length: response.data.data.length
            }))
        })
    }

    componentDidMount() {
        closeSidebar();
    }

    render () {
        const { isLoading, courses, courses_length } = this.state;
        const list = (this.props.list) ? this.props.list : courses
        return (
            <div className="Tsds-english__application__courses">
                {isLoading ? <Loader /> : 
                    <CoursesList hideBtn={this.props.hideBtn || false} courses_length={courses_length} courses={list} />
                }
            </div>
        )
    }
}