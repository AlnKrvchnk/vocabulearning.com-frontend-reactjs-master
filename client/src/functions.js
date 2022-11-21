import M from 'materialize-css'
import API from './config/API'
import axios from 'axios'
import {v4 as uuid} from 'uuid'
import Axios from 'axios'
import React, { useState } from 'react'

import Footer from './users/components/Footer'

const TOKEN = getCurrentUserToken();
// Local Functions
const $getUser = (cb) => {
    if(TOKEN) {
        axios.get(API.host + '/api/user-check/' + TOKEN).then(response => {
            cb(response.data);
        })
    } else cb({ success: false, data: {} })
}
const DOM = (selector) => {
    return document.querySelectorAll(selector)
}

// /Local functions
export const $API = {
    getUser: $getUser,
    changeRoleUser (id, data, cb, role_action = 'role') {
        console.log(role_action)
        axios.put(API.host + '/api/user-check/' + id, {
            new_role: data,
            role_action: role_action
        }, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            cb(response.data)
        })
    },
    delUser (id = 0, cb) {
        axios.delete(API.host + '/admin/users/' + id, {
            headers: {'Authorization': TOKEN}
        }).then(response => {
            if(cb) cb(response.data)
        })
    },
    delRoleSettings (role_id = 0, cb) {
        axios.post(API.host + '/api/courses/' + role_id + '/DELETE_SETTING', {}, {
            headers: {'Authorization': TOKEN}
        }).then(response => {
            if(cb && response.data) cb(response.data)
        })
    },
    // COURSE-ACTIONS
    createWordInCourse (form, {
        course_head_id = 0,
        currentAudioBlobWord = null, currentAudioBlobPhrase = null,
        typeDownloadAudio = "",
        pollyIsTMP = null,
        id = 0,
        currentEditModule = 0,
        callback,
        tmpWord = null, tmpPhrase = null,
        currentGlav = { id: 0 }
    }) {
        const data = new FormData(form),
            TOKEN = getCurrentUserToken();

        if(currentAudioBlobWord && currentAudioBlobPhrase) {
            data.append('audio_word', currentAudioBlobWord)
            data.append('audio_phrase', currentAudioBlobPhrase)
        }

        if(typeDownloadAudio == 'record' && (!currentAudioBlobWord || !currentAudioBlobPhrase)) {
            M.toast({ html: 'Вы не записали голос с микрофона!', classes: 'red' })
            return;
        }

        if(pollyIsTMP) {
            data.append('audio_word', tmpWord)
            data.append('audio_phrase', tmpPhrase)
            data.append('is_tmp', true)
        }

        // проверяем ID главы
        if(parseInt(id) == currentGlav.course_id) {
            course_head_id = currentGlav.id
        }

        const course_id = (currentEditModule != 0) ? currentEditModule : id

        axios.post(`${API.host}/words/${course_id}/${course_head_id}`, data, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(response => {
            const responseData = response.data;

            if(responseData.success) {
                if (callback) callback(responseData)
            } else {
                M.toast({ html: `${responseData.error_message}`, classes: 'red' })
            }
        })
    }
    // /COURSE-ACTIONS
}

export function loadAllAudios () {
    setTimeout(() => {
        $('audio').each(function () {
            this.load()
        })
    }, 1500)
}

export function tappingElement (element_selector = '.tapping-scrolling') {
    let scr = $(element_selector);

    scr.mousedown(function () {
        let startX = this.scrollLeft + event.pageX,
            startY = this.scrollTop + event.pageY;

        scr.mousemove(function () {
            this.scrollLeft = startX - event.pageX;
            this.scrollTop = startY - event.pageY;
            return false
        });

    });

    $(window).mouseup(function () {
        scr.off("mousemove");
    });
}

export function renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
        const newKey = newKeys[key] || key;
        return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
}

export function getOne (selector) {
    let el = document.querySelector(selector)

    return {
        el: el,
        Element () {
            return this.el
        },
        toggle (cls) {
            this.el.classList.toggle(cls)
            return this
        },
        addClass (cls) {
            this.el.classList.add(cls)
            return this
        },
        removeClass (cls) {
            this.el.classList.remove(cls)
            return this
        }
    }
}

function getCookies () {
    var cookies = document.cookie.split(';');
    var cookieData = {};

    for(var cook = 0; cook < cookies.length; cook++) {
        var splData = cookies[cook].split('=');

        cookieData[splData[0]] = splData[1];
    }

    return cookieData;
}

function setCookie(name,value) {
    var days = 1;

    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

export function getPercentNumber (percent, summ) {
    return {
        value: summ*percent/100,
        percent
    }
}

export function random (min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export function randomNumbers (len = 10) {
    let hash = '';

    for(let i = 0; i < len; i++) {
        hash += String.fromCharCode(random(48, 57));
    }

    return hash;
}

export function localSave (name, data) {
    localStorage.setItem(name, data);
    sessionStorage.setItem(name, data);
    setCookie(name, data);
}

export function getLocal (name) {
    const ls = localStorage.getItem(name);
    const ss = sessionStorage.getItem(name);
    const cook = getCookie(name);

    if(ls) return ls;
    if(ss) return ss;
    if(cook) return cook;
}

export function Toast (msg, color = 'green', displayLength = 4000) {
    M.toast({ html: msg, classes: color, displayLength })
}

// Действия пользователя в приложении (ВХОД/ВЫХОД)
export function $doUser (action = 'EXIT', data = '/') {
    switch(action.toUpperCase()) {
        // ACTION-авторизация
        case 'AUTH':
            localSave('USER', JSON.stringify(data));
            window.userData = data;
        break;

        // ACTION-выход из сессии с редиректом на страницу DATA
        case 'EXIT':
            window.userData = null;
            localDelete('USER');
            location.href = data;
        break;
    }
}

// Получение токена или иного параметра от DATA-информации пользователя
window.is_user_checked = false;
export function getCurrentUserToken (returned = 'token') {
    let data = getLocal('USER');
    if(data !== undefined) {
        // Полученые данные пользователя из STORAGE
        data = JSON.parse( data );

        // Проверка на блокировку пользователя
        if(!window.is_user_checked && TOKEN) {
            window.is_user_checked = true
            axios.get(API.host + '/api/user-check/' + TOKEN).then(response => {
                const data_blocked = response.data
                if(data_blocked.data.blocked) $doUser()
            })
        }

        // Проверка токена на валидность. Если не валиден - редирект на авторизацию
        if(data.token && returned == 'token') {
            // Проверка на ЕДИНУЮ проверку токена
            if(!self.token_has_checked) {
                self.token_has_checked = true

                // Проверка пользователя по токену (функция есть у $API объекта)
                Axios.get(API.host + '/api/user-check/' + data.token).then(response => {
                    if(!response.data.success) {
                        $doUser('EXIT', '/auth')
                    }
                })
            }
        }

        if(returned !== null) {
            return data[returned]
        } else return data
    }

    return '';
}

export function showInpEdit (default_val_inp = '', cb, title = 'Редактирование элемента') {
    const id_inp = uuid()

    openModal (id_inp, 0, `
        <h4>${title}</h4>
        <textarea class="materialize-textarea" id="i_${id_inp}"></textarea>
    `, inst => {
        const inp = $('#i_' + id_inp)

        inp.val(default_val_inp)
        inp.on('blur', function () {
            if(cb) cb(inp.val())

            inp.remove()
            inst.close()
            $('#' + id_inp).remove()
        })
    })
}

export function dynamicSort(property, activityIndexes) {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    let propValues = (activityIndexes) ? [-1,1] : [1,-1]

    return function (a,b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var split_data = property.split('.')

        if(split_data.length == 2) {
            var a_actives = a[split_data[0]].filter(_data => _data[split_data[1]] == !!sortOrder)
            var b_actives = b[split_data[0]].filter(_data => _data[split_data[1]] == !!sortOrder)

            var result = (a_actives.length < b_actives.length) ? propValues[0] : (a_actives.length > b_actives.length) ? propValues[1] : 0;
            return result * sortOrder;
        }

        var result = (a[property] < b[property]) ? propValues[0] : (a[property] > b[property]) ? propValues[1] : 0;
        return result * sortOrder;
    }
}

// COMPONENT

export function showComponent(component, action) {
    if(action) {
        switch(component) {
            case 'footer':
                return <Footer />
            break;
            
            default:
                return null
        }
    }
}

// LOADER
export function showLoader (txtData = 'Загружаю информацию...') {
    if(window.jQuery) {
        $('body').append('<div class="total_loader_application global-loader"><?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="64px" height="64px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" /><g><path d="M64 0L40.08 21.9a10.98 10.98 0 0 0-5.05 8.75C34.37 44.85 64 60.63 64 60.63V0z" fill="#dac1da" fill-opacity="0.29"/><path d="M128 64l-21.88-23.9a10.97 10.97 0 0 0-8.75-5.05C83.17 34.4 67.4 64 67.4 64H128z" fill="#ceadce" fill-opacity="0.38"/><path d="M63.7 69.73a110.97 110.97 0 0 1-5.04-20.54c-1.16-8.7.68-14.17.68-14.17h38.03s-4.3-.86-14.47 10.1c-3.06 3.3-19.2 24.58-19.2 24.58z" fill="#e0cce0" fill-opacity="0.24"/><path d="M64 128l23.9-21.88a10.97 10.97 0 0 0 5.05-8.75C93.6 83.17 64 67.4 64 67.4V128z" fill="#a56aa5" fill-opacity="0.69"/><path d="M58.27 63.7a110.97 110.97 0 0 1 20.54-5.04c8.7-1.16 14.17.68 14.17.68v38.03s.86-4.3-10.1-14.47c-3.3-3.06-24.58-19.2-24.58-19.2z" fill="#ab74ab" fill-opacity="0.65"/><path d="M0 64l21.88 23.9a10.97 10.97 0 0 0 8.75 5.05C44.83 93.6 60.6 64 60.6 64H0z" fill="#b482b4" fill-opacity="0.58"/><path d="M64.3 58.27a110.97 110.97 0 0 1 5.04 20.54c1.16 8.7-.68 14.17-.68 14.17H30.63s4.3.86 14.47-10.1c3.06-3.3 19.2-24.58 19.2-24.58z" fill="#c39cc3" fill-opacity="0.46"/><path d="M69.73 64.34a111.02 111.02 0 0 1-20.55 5.05c-8.7 1.14-14.15-.7-14.15-.7V30.65s-.86 4.3 10.1 14.5c3.3 3.05 24.6 19.2 24.6 19.2z" fill="#ecdfec" fill-opacity="0.15"/><circle cx="64" cy="64" r="2.03"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="-360 64 64" dur="2700ms" repeatCount="indefinite"></animateTransform></g></svg><p class="total_loader_application__txt">'+txtData+'</p></div>')
    }
}

export function hideLoader (txtData = 'Успешно!') {
    if(window.jQuery) {
        $('.total_loader_application__txt').text(txtData)
        $('.total_loader_application').addClass('hidden')
        setTimeout(() => {
            $('.total_loader_application').remove()
        }, 500)
    }
}
// /LOADER

/**
 * Копирование в буфер обмена
 */
function fallbackCopyTextToClipboard(text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text, cb) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        cb();
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
        cb();
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

window.copyTextToClipboard = copyTextToClipboard;

/**
 * Парсинг валидной даты
 */
export function parseDate (text) {
    text = text + ""
    let findDateFirstYear = text.match(/[0-9][0-9][0-9][0-9](\-|\.)[0-9][0-9](\-|\.)[0-9][0-9]/g)
    let findDateLastYear = text.match(/[0-9][0-9](\-|\.)[0-9][0-9](\-|\.)[0-9][0-9][0-9][0-9]/g)
    let findDate = null
    let replDate = txt => txt.replace(/-/g,'.')

    if(findDateFirstYear) findDate = replDate(findDateFirstYear[0]).split('.').reverse().join('.')
    if(findDateLastYear) findDate = replDate(findDateLastYear[0])

    if(findDate !== null) {
        return findDate.trim()
    }

    return text
}

export function getFullDate (time_and_date = false) {
    let _date = new Date().toString()

    if(time_and_date) {
        _date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    }

    return _date
}

function toDateDefault (txt) {
    return txt.replace(/\./g, '-').split('-').reverse().join('-')
}

export function dateIF (date1, expr = '===', date2) {
    date1 = new Date( toDateDefault(date1) )
    date2 = new Date( toDateDefault(date2) )

    let dt1 = date1.getTime(),
        dt2 = date2.getTime()

    if(!isNaN(dt1) && !isNaN(dt2)) {
        return eval(dt1 + ' ' + expr + ' ' + dt2)
    }

    return false
}

export function localDelete (name) {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
    eraseCookie(name);
}

export function clearForm (form) {
    let findInputs = Object.values(form)
    findInputs.forEach(input => {
        if(input.tagName) {
            if(input.tagName.match(/INPUT|SELECT/g) !== null) {
                input.value = '';
            }
        }
    })
}

export function updateSelects () {
    setTimeout(function () {
        M.FormSelect.init(DOM('select'));
    }, 500);
}

export function formObject (form) {
    if(!form) return;

    const values = Object.values(form);
    let newValues = {};

    values.forEach(inp => {
        if(inp.name !== undefined && inp.name !== "") {
            newValues[inp.name] = inp.value;
        }
    });

    return newValues;
}

export function $liveSession (path = location.pathname, func, time = 1000) {
    let leave_page_func = event => {
        func (false)
        //return false
    }

    const watcher = () => {
        const
            fact_path = location.pathname,
            path_valid = (fact_path == path)

        // start callback function
        func (path_valid)

        // clear current session
        if(!path_valid) {
            clearTimeout(watcher)
            window.onbeforeunload = null
            window.onunload = null

        } else {
            // start interval
            setTimeout(watcher, time)
        }
    }

    if(window.onbeforeunload !== undefined) {
        window.onbeforeunload = leave_page_func
    } else if(window.onunload !== undefined) {
        window.onunload = leave_page_func
    }

    watcher()
}

export function openModal (id, time = 0, data = '', onOpen = null) {

    setTimeout(() => {
        const elem = document.getElementById(id);
        if(elem) {
            const instance = M.Modal.init(elem);
            instance.open();
        } else {
            $('body').append(`
                <div id="${id}" class="modal">
                    <div class="modal-content">
                        ${data.trim()}
                    </div>
                    <div class="modal-footer">
                        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Закрыть</a>
                    </div>
                </div>
            `)

            const instance = M.Modal.init(document.getElementById(id))
            instance.open()

            if(onOpen) onOpen(instance)

            instance.options.onCloseEnd = el => $(el).remove()


        }
    }, time)
}

export const readURL = (input, cb) => {
    if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            cb && cb(e.target.result)
            $('#image').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

export function closeModal (id, onClose = null, time = 0) {
    setTimeout(() => {
        const elem = $(`#${id} + .modal-overlay, #${id} ~ .modal-overlay`)

        console.log(elem, id)

        if(elem.length) {
            elem.trigger('click')

            if(onClose) onClose(instance)
        }
    }, time)
}

export function setRootContainerBackground (color) {
    let rootApp = document.getElementById('root-application');
    rootApp.style.backgroundColor = color;
    setTimeout(() => {
        rootApp.removeAttribute('style');
    }, 1000);
}

export function uniqueArrObj (arr, prop) {
    return [...new Map(arr.map(item => [item[prop], item])).values()]
}

export function fetchLangueges (cb, v = 'title') {
    axios.get(`${API.host}/api/langueges`).then(response => {
        const dataLangueges = response.data;
        if(dataLangueges.success) {
            const dataOnResponse = [...dataLangueges.data].map(item => {
                return {
                    [v]: item.languege,
                    value: item.value
                }
            });

            (cb) ? cb(dataOnResponse) : '';
        }
    })
}

export function updateChips () {
    M.Chips.init( DOM('.chips') )
}

// Get Current user ID (in user pages)
export function getUserId () {
    if(window.userData) {
        return window.userData.id;
    }

    return 0;
}

export function redirect (new_url) {
    return location.href = new_url
}

// Get form from js object
export function createFormHTML (object) {
    let form = document.createElement('form')

    for (let i in object) {
        let inp = document.createElement('input')
            inp.value = object[i]
            inp.name = i;
            inp.type = "text";

        form.append( inp )
    }

    return form
}

// Get selected words from course
export function parseSelectingFunc ({ word = '', index = 0, maxWords = 300, inputVal = '', selectedWords = [] }, callback) {
    let newSelWords = selectedWords;
    newSelWords.push({ index, word })

    newSelWords.sort(function(a, b){
        if(a.index < b.index) { return -1; }
        if(a.index > b.index) { return 1; }
        return 0;
    })
    let phr = inputVal.split(' ');
    newSelWords.forEach(item => {
        phr[item.index] = '{*}';
    })

    if(newSelWords.length <= maxWords) {
        if(callback) callback({
            selectedWords: newSelWords,
            inputVal: phr.join(' '),
            currentCountWords: newSelWords.length
        })
    } else {
        Toast('Вы выделили максимальное количество слов!', 'red')
    }
}

// Получить всю фразу не смотря на то что текущее слово активное
export function getFullPhraseLesson (word, phrase) {
    let word_split = word.trim().split(','),
        phrase_split = phrase.trim().split('{*}')
        console.log(`word_split`, word_split)
        console.log(`phrase_split`, phrase_split)
    let search_index = 0
    phrase_split = phrase_split.map(item => {
        console.log(`item`, item)
        if(item == "") {
            word_split[search_index].trim()
            search_index++
            return
        }

        return item.trim()
    })
    return phrase_split.join(' ').trim()
}

/* Alexandra 25/06/2021: Полная фраза подсказки */
export function getFullPhrase (word, phrase) {
    const symbolToReplace = `{*}`;
    
    let fullPhrase = phrase.replace(symbolToReplace, word);
    console.log(`fullPhrase`, fullPhrase)
    return fullPhrase
}
/* Toggle Sidebar icons */

function toggleSidebarIcons(sidebar, check) {
    const sidebarElement = sidebar;
    const sidebarSubItem1 = sidebarElement.querySelector('li[data-toggle=accordion_subitem_1]');
    const sidebarSubItem2 = sidebarElement.querySelector('li[data-toggle=accordion_subitem_2]');
    const sidebarSubItem3 = sidebarElement.querySelector('li[data-toggle=accordion_subitem_3]');
    if (check) {
        sidebarSubItem1.innerHTML="<img src='/img/icons/icon-stats-dashed.svg' />";
        sidebarSubItem2.innerHTML="<img src='/img/icons/icon-edit-dashed.svg' />";
        sidebarSubItem3.innerHTML="<img src='/img/icons/icon-help-dashed.svg' />";
    } else {
        sidebarSubItem1.innerHTML="Статистика<span class='fingman_icon'><img src='/img/icons/arrow.svg' class='fingman_icon_rotate'></span>";
        sidebarSubItem2.innerHTML="Редактирование курса<span class='fingman_icon'><img src='/img/icons/arrow.svg' class='fingman_icon_rotate'></span>";
        sidebarSubItem3.innerHTML="Помощь<span class='fingman_icon'><img src='/img/icons/arrow.svg' class='fingman_icon_rotate'></span>";
    }
}

// Close sidebar
export function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const userSidebar = document.querySelector('.user_profile_mobile_menu');

    if (sidebar) {
        sidebar.classList.add(`sidebar_w100`);
        const sidebarToggler = sidebar.querySelector('.sidebar__toggleArrow');
        if (sidebarToggler) {
            sidebarToggler.classList.add('transform_180');
            toggleSidebarIcons(sidebar, true);
        }

        const body = document.querySelector('body');
        if (body.style.overflow === 'hidden') {
            body.style.overflow = 'initial';
        }
    }

    if (userSidebar) {
        if(userSidebar.classList.contains('user_profile_mobile_menu_open')) {
            userSidebar.classList.remove('user_profile_mobile_menu_open')
        }
    }
}

// Open Sidebar
export function openSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggler = sidebar.querySelector('.sidebar__toggleArrow');
    sidebar.classList.remove('sidebar_w100');
    sidebarToggler.classList.remove('transform_180');
    toggleSidebarIcons(sidebar, false);
}

// Clear the input

export function clearInput(input) {
    if (input) {
        const formInput = document.querySelector(input);
        console.log(`Form input`, formInput);
        if (formInput) {
            formInput.value = '';
        }

    }

}
