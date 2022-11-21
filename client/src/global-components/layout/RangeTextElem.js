import React from 'react'

export default function RangeTextElem ({text = '', search_text = ''}) {
    if(typeof text !== "string") return ''

    text = text.split(' ')

    return (
        <p>
            {
                text.map((item, i) => {
                    if(item.toUpperCase() == search_text.toUpperCase() && search_text.length >= 2)
                        return <b key={i} className="lemma-m-text__b"> {item} </b>
                    
                    return ` ${item} `
                })
            }
        </p>
    )
}