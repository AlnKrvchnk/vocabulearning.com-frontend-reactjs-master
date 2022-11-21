import Actions from '../users/components/Routes/route-paths'
import Axios from 'axios'
import API from '../config/API'
import { getCurrentUserToken, localSave, getLocal } from '../functions'

const _ec =  {
    actions: Actions,
    getCurrentLang () {
        const saved_lang = getLocal('lang')

        if(window._defaultLangs) {
            const langs = Object.keys(window._defaultLangs).join(',').toUpperCase().split(',')
            const loc_search = location.search.toUpperCase()
    
            const lang = langs.filter(item => loc_search.indexOf('?'+item) > -1)
    
            if(lang.length) {
                const cl = lang[0].toLowerCase()
    
                localSave('lang', cl)
    
                _ec.update_prop('lang', cl)
    
                return (cl !== undefined) ? cl : 'ru' 
            } else return (saved_lang !== undefined) ? saved_lang : 'ru'
        } return (saved_lang !== undefined) ? saved_lang : 'ru'

        return 'ru'
    },
    lang: 'ru',
    curr_path: location.pathname,
    default_value: 'Value',
    // Контент страниц (lang|path)
    content: {},

    update_prop (prop, val) {
        _ec[prop] = val
    },
    // Поиск значения в контенте
    f (prop, name = 'Name', value = _ec.default_value, cb, force_load = false) {
        const cl = _ec.getCurrentLang()
        const is_user_page = location.pathname.indexOf('/admin') == -1
        
        if(location.href.indexOf('?'+cl) == -1 && is_user_page) {
            history.pushState('','', location.href + '?' + cl)
        }

        if(is_user_page) _ec.lang = cl

        //if(!force_load) _ec.loadAll()

        const $content = _ec.content[`${_ec.lang}|${_ec.curr_path}`] 

        // Если контент существует
        if($content) {
            // изменение заголовка страницы
            if($content.title) document.title = $content.title.value
        }

        if($content || force_load) {
            const current_prop = ($content) ? $content[prop] : ''
            
            if (current_prop && !force_load) {
                const val = ($content[prop].value) ? $content[prop].value : $content[prop]
                return val
            } else {
                return ''
                /*Axios.post(API.host + '/api/cms/' + _ec.lang, {
                    page_url: _ec.curr_path,
                    page_content_json: {[prop]: {
                        value: value,
                        name: name
                    }}
                }, {
                    headers: {'Authorization': getCurrentUserToken()}
                }).then(response => {
                    if(!force_load) _ec.loadAll()

                    if(cb) cb(response)
                })

                return _ec.default_value*/
            }
        } 
    },
    // загрузка контента
    loadAll (cb, update_path = true) {
        // Обновлять принудительно ПУТЬ или ЯЗЫК (автоматически)
        if(update_path) {
            _ec.curr_path = location.pathname
            _ec.lang = _ec.getCurrentLang()
        }

        Axios.get(API.host + '/api/cms/' + _ec.lang).then(response => {
            if(response.data.success) {
                _ec.content = response.data.data
            }

            if(cb) cb(response.data)
        })
    },
}

export default _ec