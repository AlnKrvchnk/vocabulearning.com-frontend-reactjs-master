import React from 'react'
import { Link } from 'react-router-dom';

export default function ModulesItem (props) {
    const {
        description,
        name,
        id,
        index,
        url,
        author
    } = props;

    let module_id = `module-update-${index}`

    return (
        <div className="Tsds__modules__item course__item">
            <div className="card" data-module-id={id}>
                <div className="card-header">
                    <span>{name}</span>
                </div>
                <div className="tab-content">
                    <div className="tab-pane fade show active">
                        {description}
                    </div>
                    <p><strong>Автор:</strong> {author}</p>
                </div>
                <div className="card-body course">
                    <ul className="nav nav-pills nav-fill flex-wrap nav-info mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item card-body__nav__item">
                            <a
                                href={'/courses/' + url + '#basic-tab'}
                                target="_blank"
                                id="module-open"
                                className="Tsds__modules__btn"
                                >
                                    <span className="material-icons align-text-top mr-1 md-18">open_in_new</span>
                                    Открыть
                            </a>
                        </li>
                        <li className="nav-item card-body__nav__item">
                            <Link
                                to={'/admin/courses/' + id}
                                id="module-edit"
                                className="Tsds__modules__btn"
                                >
                                    <span className="material-icons align-text-top mr-1 md-18">edit</span>
                                    Редактировать
                            </Link>
                        </li>
                    </ul>

                </div>
            </div>
        </div>
    )
}
