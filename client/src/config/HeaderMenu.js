import L from '../config/languege'
import { getLocal } from '../functions'
import API from './API';

const isUserIsset = (getLocal('USER')) ? getLocal('USER') : false;

if(isUserIsset) window.userData = JSON.parse(getLocal('USER'));
const registerPath = {
    name: L.current.header_menu[2],
    path: '/register/',
    image: '/img/icons/icon-userplus.svg'
};

const check_domain = (location.host == API.hosts[0] || location.host == API.hosts[1] || location.host == 'localhost:3000') ? true : false;
const { hostname } = location

const HeaderMenu = [
    {
        name: L.current.header_menu[0],
        path: '/',
        image: '/img/icons/icon-home.svg',
        isValid: hostname == 'vocabulearning.com'
    },
    {
        name: L.current.header_menu[2],
        path: '/register/',
        image: '/img/icons/icon-userplus.svg',
        isValid: !isUserIsset
    },
    {
        name: (isUserIsset && window.userData.data) ? window.userData.data.login : L.current.header_menu[3],
        path: '/auth/',
        image: '/img/icons/icon-user.svg',
        isValid: true
    }
];

export default HeaderMenu;