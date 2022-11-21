import React from 'react'
import './index.less'
import {v4 as uuid} from "uuid";

export default function ChangeLanguage(props) {
    let l = self._defaultLangs

    if (!l) return 'Языки не были загружены'

    return (
        <React.Fragment>
            <div className="modal__language">
                <h2>Язык интерфейса</h2>
                <div className="modal__language__selector">
                    {Object.keys(l).map((lang, i) => {
                        return <div className="modal__language__row" key={uuid()}>
                            <a href={'/?' + lang}>{l[lang]}</a>
                        </div>
                    })}
                </div>
            </div>
        </React.Fragment>
    )
}