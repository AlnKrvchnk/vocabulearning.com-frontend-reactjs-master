import React from 'react'

import Button from '../../../../../global-components/layout/Button'
import Input from '../../../../../global-components/layout/Input'

export default class SearchCourseForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            activeSnippets: {}
        }

        this.parseClickSnippet = this.parseClickSnippet.bind(this)
    }

    parseClickSnippet (data, index) {
        let inp = this.my_form.search_data
            inp.value = data;
        inp.focus()
        this.setState(() => ({ activeSnippets: {} }))
        this.props.onSearchCourse(inp.value, this.my_form)
    }

    render() {
        const { onSearchCourse, courses_tooltips } = this.props
        return (
            <form action="" ref={f => this.my_form = f} onSubmit={e => {
                e.preventDefault()
                onSearchCourse(e.target.search_data.value, e.target)
            }}>
                <div className="form-group statistic__search__name">
                    <div className="col-md-6 col-sm-12 col-xs-12 statistic__search__name__input__wrapper">
                        <Input  onChange={(e, target) => {
                            courses_tooltips.forEach(item => {
                                const i_name = item.name;
                                const value_split = e.split(' ');

                                value_split.forEach(val => {
                                    let newValName = false;
                                    if(item.name.toUpperCase().match(eval('/'+val.toUpperCase()+'/g')) !== null) {
                                        newValName = true
                                    }

                                    this.setState(prevState => ({
                                        activeSnippets: {
                                            ...prevState.activeSnippets,
                                            [i_name]: newValName
                                        }
                                    }))
                                })
                            })
                        }} name={'search_data'} label={'Поиск по названию курса'} />
                    </div>
                    <div className="col-md-6 col-xs-12 col-sm-12">
                        <Button submit customClass={'shadow--none'} title={'Получить статистику курса'} />
                    </div>
                </div>
                <div className="form-group">
                <div className="col s12 m8 input-snippets">
                    {Object.keys(this.state.activeSnippets).map((item, i) => {
                        if(this.state.activeSnippets[item]) {
                            return <a href="" onClick={e => {
                                e.preventDefault()
                                this.parseClickSnippet(item, i)
                            }} key={i}>{item}</a>
                        }
                    })}
                </div>

                </div>
            </form> 
        )
    }
}