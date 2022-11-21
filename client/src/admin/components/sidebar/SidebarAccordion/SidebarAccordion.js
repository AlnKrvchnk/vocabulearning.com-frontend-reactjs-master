import React from 'react';
import {Link} from 'react-router-dom';
import './index.less';
import {closeSidebar} from "../../../../functions";

export default function SidebarAccordion(props) {
    const {
        routes,
        main_title,
        subItem,
        tabs
    } = props;

    function toggleMenuDown(evt, itemName) {
        evt.preventDefault()
        const menuItem = document.querySelector(`.fingman_accordion_subitem[data-item=${itemName}]`)
        const menuItemIcon = document.querySelector(`.fingman_title_item[data-toggle=${itemName}] span img`)
        menuItem.classList.toggle('fingman_accordion_open')
        if (menuItemIcon) {
            menuItemIcon.classList.toggle('fingman_reverse_arrow')
        }

    }

    function changeActiveTab(tab) {
        const tabWithoutHash = tab.substr(1);
        const tabs = document.querySelectorAll('.tab-pane');
        tabs.forEach((tab) => {
            if (tab.getAttribute('aria-labelledby') === tabWithoutHash) {
                tab.classList.add('active');
                tab.classList.add('show');
            } else {
                tab.classList.remove('active');
                tab.classList.remove('show');
            }

        })
    }

    function setLinkActive(e) {
        const sidebarItems = document.querySelectorAll('.sidebar__item')
        sidebarItems.forEach((item) => {
            item.classList.remove('active')
        })
        const link = e.target.parentNode.parentNode;
        link.classList.add('active')
    }

    return (
        <React.Fragment>
            <ul className={'fingman_accordion_item'}>
                <li className={'fingman_title_item'} data-toggle={subItem} onClick={(e) => toggleMenuDown(e, subItem)}>
                    {main_title}
                    <span className="fingman_icon">
                            <img src="/img/icons/arrow.svg" className="fingman_icon_rotate" />
                        </span>
                </li>
                <div className="fingman_accordion_subitem" data-item={props.subItem}>
                    {
                        routes.length >= 0 ?
                            routes.map((item, i) => (
                                <li className="sidebar__item sidebar-item" key={i}>
                                    {(tabs) ?
                                        <Link
                                        to={item.path}
                                        onClick={(e) => {
                                            setLinkActive(e)
                                            changeActiveTab(item.path)
                                        }
                                        }
                                        >
                                        { (item.data.material_icon) ?
                                            <span className={'nav-icon material-icons'}>
                                                {item.data.material_icon}
                                            </span>
                                            :
                                            <span className={'nav-icon'}>
                                                <img src={item.data.icon} alt={""} />
                                            </span>
                                        }
                                        <span>
                                            {item.name}
                                        </span>
                                    </Link>
                                    :
                                        <Link
                                        to={item.path}
                                        >
                                        { (item.data.material_icon) ?
                                            <span className={'nav-icon material-icons'}>
                                                {item.data.material_icon}
                                            </span>
                                            :
                                            <span className={'nav-icon'}>
                                                <img src={item.data.icon} alt={""} />
                                            </span>
                                        }
                                        <span>
                                            {item.name}
                                        </span>
                                    </Link>
                                    }

                                </li>
                            ))
                            : ''
                    }
                </div>
            </ul>
        </React.Fragment>
    )
}
