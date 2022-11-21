import { IndexPage, UsersPage, SettingsPage, CoursesStatisticPage, TestsPage, SingleCourse, EditCourse } from './index'
import CMSAction from './actions/CMSAction';

const RoutesList = [
    {
        path: '/admin',
        exact: true,
        page: IndexPage,
        name: 'Дашборд',
        role_user: 1,

        data: {
            material_icon: 'dashboard'
        }
    },
    {
        path: '/admin/courses-statistics',
        exact: false,
        page: CoursesStatisticPage,
        category: 'statistic',
        name: 'Информация по курсам',
        role_user: 1,
        data: {
            icon: '/img/icons/icon_course_information.svg'
        }
    },
    {
        path: '/admin/users/',
        exact: false,
        page: UsersPage,
        name: 'Пользователи',
        role_user: 2,
        category: 'statistic',
        data: {
            icon: '/img/icons/icon_users.svg',
            material_icon: 'people'
        }
    },
    {
        path: '/admin/settings',
        exact: false,
        page: SettingsPage,
        name: 'Настройки',
        role_user: 2,
        category: 'statistic',

        data: {
            icon: '/img/icons/setting-lines.svg'
        }
    },
    {
        path: '/admin/cms',
        exact: false,
        page: CMSAction,
        name: 'CMS',
        role_user: 2,
        category: 'statistic',

        data: {
            icon: '/img/icons/cms.svg'
        }
    },
    // COURSE
    {
        path: '/admin/courses/:id',
        exact: false,
        page: SingleCourse,
    },
    //
    {
        path: '#basic-tab',
        name: 'Основное',
        category: 'editcourse',
        exact: false,
        data: {
            icon: '/img/icons/icon-edit-basic.svg'
        },
    },
    {
        path: '#land-tab',
        name: 'Описание курса',
        category: 'editcourse',
        data: {
            icon: '/img/icons/icon-edit-description.svg'
        }
    },
    {
        path: '#phrases-tab',
        name: 'Главы и фразы',
        category: 'editcourse',
        data: {
            icon: '/img/icons/icon-edit-glavs.svg'
        }
    },
    {
        path: '#technic-tab',
        name: 'Технические настройки',
        category: 'editcourse',
        data: {
            icon: '/img/icons/icon-edit-settings.svg'
        }
    },
    {
        path: '#lemma-tab',
        name: 'Деление',
        category: 'editcourse',
        data: {
            icon: '/img/icons/icon-edit-delenie.svg'
        }
    },
    {
        path: '#textslemma-tab',
        name: 'Тексты с разбиения',
        category: 'editcourse',
        data: {
            icon: '/img/icons/icon-edit-texts.svg'
        }
    },
    {
        path: '#tests-tab',
        exact: false,
        page: TestsPage,
        name: 'Тесты',
        role_user: 1,
        category: 'editcourse',
        data: {
            icon: '/img/icons/tests.svg'
        }
    },
    {
        path: '#subtitles-tab',
        name: 'Субтитры',
        category: 'editcourse',
        data: {
            icon: '/img/icons/subtitles.svg'
        }
    },
    {
        path: '/support',
        name: 'Техническая поддержка',
        category: 'help',
        data: {
            icon: '/img/icons/icon-help-support.svg'
        }
    },
    {
        path: '/faq',
        name: 'Стандартные вопросы / ответы',
        category: 'help',
        data: {
            icon: '/img/icons/icon-help-faq.svg'
        }
    }
];

export default RoutesList;
