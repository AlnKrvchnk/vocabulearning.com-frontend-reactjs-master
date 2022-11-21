import React from 'react'
import {} from './VModal.less'

const getModalId = id => 'modal-' + id

const classes = {
    close: 'VModal-placeholder--hide',
    hidden: 'VModal-placeholder--hidden',
    placeholder: 'VModal-placeholder'
}

export const VModal = ({ id, children }) => {
    const modalId = getModalId(id),
        _modal = $('#' + modalId + ' > .VModal')

    return <>
        <div id={modalId} className={[classes.placeholder, classes.hidden, classes.close].join(' ')}>
            <div className="VModal">
                <img onClick={() => { VModalAction({ id, type: 'CLOSE' }) }} src={'/img/modal_close_btn.svg'} width={20} className="VModal__close" />

                {children}
            </div>
        </div>
    </>
} 

export const VModalAction = ({ id = '', type = '' }) => {
    if(!self.jQuery || !self.$) 
        return console.warn('jQuery must be required. Component VModal.js')

    const modalId = getModalId(id),
        _modalPlaceholder = $('#' + modalId)

    if(_modalPlaceholder.length) {
        switch(type.toUpperCase()) {
            case 'CLOSE':
                _modalPlaceholder.addClass(classes.close)

                setTimeout(() => {
                    _modalPlaceholder.addClass(classes.hidden)
                }, 1500)
            break;

            case 'OPEN':
                _modalPlaceholder.removeClass(classes.hidden)

                setTimeout(() => {
                    _modalPlaceholder.removeClass(classes.close)
                }, 100)
            break;
        }
    }
}