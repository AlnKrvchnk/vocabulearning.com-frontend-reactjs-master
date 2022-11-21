import React from 'react'
import { $doUser } from '../../functions'

import {
    IndexAction,
    RegisterAction,
    CoursesAction,
    AuthorizationAction,
    SingleCourseAction,
    PasswordResetAction,
    ContactsAction,
    PricesAction, LandingCourseAction
} from './Routes/route-actions'
import { useParams } from 'react-router-dom';

export function Index () {
        return <IndexAction />
}

export function Register () {
        return <RegisterAction />
}

export function Courses () {
        return <CoursesAction />
}

export function Contacts () {
        return <ContactsAction />
}

export function Prices () {
        return <PricesAction />
}

export function Authorization () {
        return <AuthorizationAction />
}

export function Logout () {
        return $doUser('EXIT', '/auth')
}

export function SingleCourse () {
        const params = useParams()
        return <SingleCourseAction head_id={params.head_id} url={params.url} />
}

export function LandingCourse () {
        const params = useParams()
        return <LandingCourseAction id={params.id} />
}

export function PasswordReset () {
        const params = useParams()
        return <PasswordResetAction param={params.param} data={params.data} />;
}