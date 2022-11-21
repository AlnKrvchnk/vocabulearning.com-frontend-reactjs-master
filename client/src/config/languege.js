const Lang = {
    default: 'Русский',
    list: {
        'Русский': {
            profile: 'Профиль',
            logo: '/public/img/sidebar-logo.svg',
            title: 'Vocabulearning',
            header_menu: [
                'Главная', 'Курсы', 'Регистрация', 'Авторизация'
            ],

            pages: {
                auth: {
                    title: 'Авторизация'
                },

                profile: {
                    title: 'Личный кабинет'
                },

                register: {
                    title: 'Регистрация'
                },

                courses: {
                    title: 'Курсы'
                },

                index: {
                    startLearningButton: 'Начать обучение',
                    filterForm: {
                        course: 'Выберите курс',
                        author: 'Выберите автора',
                        lang: 'Выберите язык',
                        submit: 'Применить'
                    }
                }
            }
        },

        'English': {
            profile: 'Profile',
            logo: '/public/img/sidebar-logo.svg',
            title: 'Learning english with me!',
            header_menu: [
                'Home', 'Courses', 'Register', 'Auth'
            ],

            pages: {
                auth: {
                    title: 'Sign in'
                },

                profile: {
                    title: 'Your profile'
                },

                register: {
                    title: 'Register'
                },

                courses: {
                    title: 'Courses'
                },
                
                index: {
                    startLearningButton: 'Start Learning',
                    filterForm: {
                        course: 'Select course',
                        author: 'Select author',
                        lang: 'Select language',
                        submit: 'Search'
                    }
                }
            }
        }
    },

    get current () {
        const localLang = localStorage.getItem('lang');

        if(localLang) {
            if(Lang.list[localLang]) {
                return Lang.list[localLang];
            }
        }

        return Lang.list[Lang.default];
    }
}

export default Lang;