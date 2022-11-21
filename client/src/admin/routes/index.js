import React from 'react';

import IndexAction from './actions/IndexAction';
import UsersAction from './actions/UsersAction';
import CoursesStatisticAction from './actions/CoursesStatisticAction';
import SettingsAction from './actions/SettingsAction';
import TestsAction from './actions/TestsAction';
import SingleCourseAction from './actions/SingleCourseAction'

export function IndexPage () {
    return <IndexAction />
}

export function UsersPage () {
    return <UsersAction />
}

export function CoursesStatisticPage () {
    return <CoursesStatisticAction />
}

export function SettingsPage () {
    return <SettingsAction />
}

export function TestsPage () {
    return <TestsAction />
}

export function SingleCourse ({ match }) {
    const { id } = match.params
    return <SingleCourseAction course_id={id} />
}