import React from 'react'

import CourseItem from './Item'

export default function CoursesList (props) {
    const { courses, hideBtn, courses_length = 0 } = props;
    

    return (
        <React.Fragment>
            {/* <p className={"pt-0 mt-0"}>Курсов: {courses.length} (найдено), {courses_length} (общее число курсов) шт.</p> */}
            <div className="row course-list--small">
                {
                    (courses.length) ?
                        courses.map((course, i) => {
                            return <CourseItem 
                                cw={course.count_words} 
                                price={course.price} 
                                key={i} hideBtn={hideBtn} 
                                id={course.id} 
                                title={course.name} 
                                descr={course.description} 
                                url={course.url} 
                                image={course.preview}
                                author={course.author}
                                lang={course.langueges}
                                lang_terms={course.languege_termins}
                                theme={course.theme}
                            />
                        }) :
                    <p className="col s12">Курсы не найдены</p>
                }
            </div>
        </React.Fragment>
    )
}