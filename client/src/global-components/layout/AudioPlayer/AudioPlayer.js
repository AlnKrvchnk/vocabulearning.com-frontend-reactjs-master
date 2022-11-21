import React, { Component } from 'react'
import './index.less'


export default class AudioPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isButtonClicked: false,
            infoBlock: null,
            rangeData: 0,
            currentTime: 0
        }
        this.togglePlayer = this.togglePlayer.bind(this)
        this.player = React.createRef()
    }

    togglePlayer(evt) {
        evt.preventDefault();
        const audioPlayer = this.player.current;

        //const audioPlayerThumb = evt.target.parentNode.parentNode.querySelector(`input`);

        if (audioPlayer.paused) {
            audioPlayer.play()
            audioPlayer.ontimeupdate = () => {
                //const rangeFormula = audioPlayer.currentTime / audioPlayer.duration * 5000
                const rangeFormula = audioPlayer.duration / audioPlayer.currentTime ;
                this.setState(() => ({ rangeData: rangeFormula }))
                this.setState(() => ({ currentTime: audioPlayer.currentTime }))
                //audioPlayerThumb.value = rangeFormula
            }
        } else {
            audioPlayer.pause()
        }
    }
    render() {
        const {src, name, hidden} = this.props
        return (
            <div
                className={`${hidden} audioPlayer`}
                >
                <audio
                    ref={this.player}
                    src={src}
                >
                    Ваш браузер не поддерживает использование audio элемента
                </audio>
                <div className="audioPlayer__block">
                    <a className="audioPlayer__btn" href="" onClick={(evt) => {evt.preventDefault(); this.togglePlayer(evt)}}>
                        <i className="material-icons">play_arrow</i>
                    </a>
                    <input type="range" className="audioPlayer__progress" min={0} value={this.state.currentTime * 100}/>
                </div>
            </div>
        )
    }
}
