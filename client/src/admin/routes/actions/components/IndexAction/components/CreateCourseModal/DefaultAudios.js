import React from 'react'

export default function DefaultAudios () {
    const 
        def_success = 'https://vocabulearning.com/templates/success.mp3',
        def_wrong = 'https://vocabulearning.com/templates/wrong.mp3'
    return (
        <article>
            <input type="hidden" name="def_audio_success" defaultValue={def_success} />
            <input type="hidden" name="def_audio_wrong" defaultValue={def_wrong} />

            <p>Верный ввод</p>
            <audio className="recorder-audio__current" src={def_success} controls={true}></audio>

            <p>Неверный ввод</p>
            <audio className="recorder-audio__current" src={def_wrong} controls={true}></audio>
        </article>
    )
}