import $ from 'jquery'

window.jQuery = $;
window.$ = $;
window.jquery = $;

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
}

self.sound = (src, onEnd) => {
    let audio = new Audio();
        audio.src = src;
        audio.volume = 0.6;
    
    audio.play();

    audio.addEventListener('ended', () => {
        if(onEnd) onEnd();
    })

    audio.addEventListener('error', error => {
        if(onEnd) onEnd()
    })
}

self.enterPressed = false;

self.onEventSub = (callback, target) => {
    if(typeof callback === "function") {
        callback(target);
    }
}

self.firstEnterUpdate = false
document.addEventListener('keypress', e => {
    if(!self.firstEnterUpdate) {
        setTimeout(() => {
            if(e.code == "Enter") {
                self.enterPressed = true;
                self.onEventSub(self.triggersEnter, e.target);
            }
        }, 200)
    }
    if(e.code == "Enter") {
        self.enterPressed = true;
        self.onEventSub(self.triggersEnter, e.target);
    } else {
        self.enterPressed = false;
    }
})


