export default {
    host: 'https://vocabulearning.com',
    hosts: [
        'vocabulearning.com',
        'terminosdeterminos.com'
    ],
    categories_courses: [
        {value:'Курсы', title:'Курсы'},
        {value:'Фильмы', title:'Фильмы'},
        {value:'Сериалы', title:'Сериалы'},
        {value:'Учебники, научные издания', title:'Учебники, научные издания'},
        {value:'Художественная литература', title:'Художественная литература'},
        {value:'Песни', title:'Песни'},
    ],
    type_sounds: {
        list: {
            'download': 'Загружен файл',
            'polly': 'Озвучено роботом',
            'record':  'Записано голосом',
            'default': 'Шаблонное аудио'
        },
        getTypeSound (prop) {
            if(prop !== '')
                return this.list[prop]
            
            return this.list['default']
        }
    }
};