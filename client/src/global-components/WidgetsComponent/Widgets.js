import React from 'react'
import {} from './index.less'

export default function PulseCircle ({action = undefined}) {
    if(action !== undefined) {
        return <span className={'online'}></span>
    } else return <span className={'online online--red'}></span>
}