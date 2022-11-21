import React from 'react';

import {BrowserRouter as Router, Link} from 'react-router-dom';
import RoutesList from '../../routes/config';
import SidebarItem from './sidebar-item';
import SidebarAccordion from "./SidebarAccordion/SidebarAccordion";

import AuthChecker from '../../../users/components/AuthChecker/AuthChecker';

import M from 'materialize-css';
import {closeSidebar, openSidebar} from "../../../functions";

const SidebarConfig = {
    // cls: 'Tsds__sidebar',
    cls: 'sidebar',
    material_icon: 'public',
    get itemClass () {
        return `${this.cls}__item sidebar-item`
    },

    get activeClass () {
        return `${this.cls}--active`
    }
}

export default class Sidebar extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            activeClass: '',
            statisticRoutes: [],
            editRoutes: [],
            helpRoutes: []
        }

        this.toggleActiveClass = this.toggleActiveClass.bind(this)
        this.returnStatisticRoutes = this.returnStatisticRoutes.bind(this)
        this.returnEditRoutes = this.returnEditRoutes.bind(this)
        this.returnHelpRoutes = this.returnHelpRoutes.bind(this)
        this.toggleSidebarNavigation = this.toggleSidebarNavigation.bind(this)
    }

    toggleActiveClass () {
        if(!this.state.activeClass) {
            this.setState(() => ({
                activeClass: SidebarConfig.activeClass
            }))
        } else {
            this.setState(() => ({
                activeClass: ''
            }))
        }

        this.updateSelects();
    }

    // TODO - проверка на админа

    returnStatisticRoutes (routes) {
        for(let i = 0; i < routes.length; i++) {
            if(routes[i].category === 'statistic') {
                const route = routes[i];
                this.setState(prevState => ({
                    statisticRoutes: [...prevState.statisticRoutes, route]
                }))
            }
        }
    }

    returnEditRoutes (routes) {
        for(let i=0; i < routes.length; i++) {
            if(routes[i].category === 'editcourse') {
                const route = routes[i];
                this.setState(prevState => ({
                    editRoutes: [...prevState.editRoutes, route]
                }))
            }
        }
    }

    returnHelpRoutes (routes) {
        for(let i=0; i < routes.length; i++) {
            if(routes[i].category === 'help') {
                const route = routes[i];
                this.setState(prevState => ({
                    helpRoutes: [...prevState.helpRoutes, route]
                }))
            }
        }
    }

    updateSelects () {
        setTimeout(() => {
            M.FormSelect.init( document.querySelectorAll('select') )

            window.modals = {};
            let modals = M.Modal.init( document.querySelectorAll('.modal') );
            modals.forEach(modal => {
                window.modals[modal.id] = modal
            })
        })
    }

    toggleSidebarNavigation (e) {
        const sidebar = document.querySelector('.sidebar')
        closeSidebar()
    }

    checkCourseRoute () {
        console.log(`Location`, location);
    }

    componentDidMount() {
        this.returnStatisticRoutes(RoutesList)
        this.returnEditRoutes(RoutesList)
        this.returnHelpRoutes(RoutesList)
    }

    render () {

        return (
            <aside className={`${SidebarConfig.cls} ${this.state.activeClass}`}>
                <nav className="navigation">
                    <AuthChecker token={this.props.token} isAdmin={true}/>
                    <div className={SidebarConfig.itemClass}>
                        <ul>
                            <li>
                                <Link to="/admin">
                                    <span className="nav-icon">
                                        <img src="/img/icons/icon-dashboard.svg" className="sidebar_icon_img" alt=""/>
                                    </span>
                                    <span>Главная</span>
                                </Link>
                            </li>
                            <li>
                                <a href="https://vocabulearning.com/">
                                    <span className="nav-icon">
                                        <img src="/img/icons/icon-deshacer.svg" className="sidebar_icon_img"/>
                                    </span>
                                    <span>На страницу курсов</span>
                                </a>
                            </li>
                            <li>
                                <Link to="/">
                                    <span className="nav-icon material-icons">chat</span>
                                    <span>Чат с учениками</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'#modal-create-module'} className={'modal-trigger fingman_color_item'}>
                                    <span className={'nav-icon material-icons'}>add</span>
                                    Добавить курс
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {
                        <SidebarAccordion
                            routes={this.state.statisticRoutes}
                            main_title={'Статистика'}
                            subItem={'accordion_subitem_1'}
                            tabs={false}
                        />
                    }
                    {
                        <SidebarAccordion
                            routes={this.state.editRoutes}
                            main_title={'Редактирование курса'}
                            subItem={'accordion_subitem_2'}
                            tabs={true}
                        />
                    }
                    {
                        <SidebarAccordion
                            routes={this.state.helpRoutes}
                            main_title={'Помощь'}
                            subItem={'accordion_subitem_3'}
                            tabs={true}
                        />
                    }
                    {
                        // RoutesList.map(
                        //     ($route, i) => {
                        //         // Проверка прав доступа к конкретному Route
                        //         if (!(self.__user_role >= $route.role_user)) return '';
                        //
                        //         return ($route.path !== '/admin' ? <SidebarItem
                        //             key={i}
                        //             updateSelects={this.updateSelects}
                        //             icon={$route.data.icon || ''}
                        //             material_icon={$route.data.material_icon}
                        //             path={$route.path}
                        //             title={$route.name}
                        //             elementClass={SidebarConfig.itemClass}
                        //         /> : '')
                        //     }
                        // )
                    }
                </nav>
                <div className="sidebarToggler">
                    <a className="sidebar__toggleArrow" href={""} onClick={(e) => {
                        e.preventDefault();
                        const sidebar = document.querySelector(`.sidebar`);
                        if (sidebar.classList.contains(`sidebar_w100`)) {
                            console.log(`Opening...`);
                            openSidebar()
                        } else {
                            console.log(`Closing...`);
                            closeSidebar()
                        }
                    }}>
                        <i className="material-icons">chevron_left</i>
                    </a>
                </div>
            </aside>
        )
    }
}
