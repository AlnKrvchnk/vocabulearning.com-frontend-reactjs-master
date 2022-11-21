import React from 'react'

export function Row ({ children, cls = '' }) {
    return (
        <div className={`row ${cls}`}>{children}</div>
    )
}

export function Col ({ children, cls = '', col = 's12' }) {
    return (
        <div className={`col ${cls} ${col}`}>{children}</div>
    )
}