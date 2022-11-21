import React from 'react'
import { setRootContainerBackground, randomNumbers } from '../../../../functions'

export default class LessonTooltipInput extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            tooltipActive: false,
            randomWord: [],
            validArrayWords: [],
            startIndex: 0,
            activeClass: ''
        }

        this.activateTooltip = this.activateTooltip.bind(this)
        this.randomLetter = this.randomLetter.bind(this)
        this.checkChar = this.checkChar.bind(this)
        this.isAwesome = this.isAwesome.bind(this)
    }

    randomLetter (arr) {
        const sf = this;
        function getRandArr () {
            arr.sort(() => {
                return Math.random() - 0.5;
            })

            /*
            TODO: при включении отрубает почему-то вариант обучения "Слово-перевод"
            if(sf.props.word.trim() == sf.getLetters(arr).trim()) {
                return getRandArr();
            }*/

            return arr;
        }

        return getRandArr();
    }

    getLetters (arr) {
        let letters = '';
        arr.forEach(item => {
            letters += item.char;
        })

        return letters;
    }

    activateTooltip () {
        // || this.props.tooltipActive (чтобы функционал автоматом включался)
        if(!this.state.tooltipActive) {
            let newWord = this.props.word.trim().split('').map((item, i) => {
                return {
                   char: item,
                   index: i,
                   doubleIndexes: {}
                }
            });

            newWord.forEach((item, i) => {
                let findOtherItems = newWord.filter(itemSearch => {
                    return itemSearch.char.toUpperCase() === item.char.toUpperCase() && itemSearch.index !== item.index
                }).map(itemMap => {
                    return itemMap.index;
                })

                if(findOtherItems.length) {
                    let objectIndexes = {};
                    findOtherItems.forEach(item => objectIndexes[item] = true)
                    
                    newWord[i].doubleIndexes = objectIndexes
                }
            })
    
            let randomArray = this.randomLetter(newWord);

            this.setState(() => ({
                tooltipActive: true,
                validArrayWords: newWord,
                randomWord: randomArray,
                currentWord: this.props.word.trim()
            }))
        } else {
            this.setState(() => ({
                tooltipActive: false,
                activeClass: '',
                startIndex: 0
            }))
        }
    }

    // ПРОВЕРКА БУКВЫ НА ПРАВИЛЬНОСТЬ ИНДЕКСА
    checkChar (data, indexMap, target) {
        const { index, char } = data
        const SI = this.state.startIndex;

        if(SI === index || data.doubleIndexes[SI]) {
            let spliceArr = this.state.randomWord.splice(indexMap,1)

            this.state.randomWord.insert(SI, data)
            this.setState(prevState => ({
                randomWord: prevState.randomWord
            }))

            setTimeout(() => {
                $(`span[data-char="${data.char}"][data-index="${data.index}"]`).css({
                    'color': '#43d281'
                })
            }, 200);

            this.state.startIndex++;
            this.setState(() => ({ startIndex: this.state.startIndex }))
        } else {
            setRootContainerBackground('#ff0a0a2e')
            return
        }

        // ЕСЛИ ВСЕ СЛОВА СОВПАДАЮТ С ИЗНАЧАЛЬНЫМ СЛОВОМ, ТО ОНО ВВЕДЕНО ВЕРНО
        let arrInLetters = this.getLetters(this.state.randomWord).toUpperCase()
        if(arrInLetters == this.props.word.toUpperCase()) {
            this.isAwesome(data, indexMap, this.props.word, target)
        }
    }

    // ЗАМЕЧАТЕЛЬНО! СЛОВО ПОДОБРАНО ВЕРНО
    isAwesome (data, indexMap, word, target) {
        const { wInputId, wordData } = this.props
        $('.w').addClass('disabled');
        let elementInput = document.getElementById(wInputId)
        // СТАВИМ СЛОВО ЗЕЛЁНЫМ НА 2 СЕКУНДЫ
        this.setState(() => ({
            activeClass: 'awesome'
        }), () => {
            setTimeout(() => {
                this.setState(() => ({
                    activeClass: '',
                    startIndex: 0,
                    tooltipActive: false
                }));
                $('.w').removeClass('disabled');

                if(this.props.tooltipActive) 
                    this.activateTooltip()

            }, 3000)
        })

        // ТРИГЕРИМ ИНПУТ
        elementInput.value = word
        $(elementInput).val(word)
        wordData.triggerWord({
            val: word,
            index: wordData.index,
            target: elementInput
        }, true)
        // КЛИКАЕМ ПО КНОПКЕ ДАЛЕЕ (для того чтобы активировать процесс проверки слов)
    }

    componentDidMount () {
        // Если по умолчанию подсказка активна
        if(this.props.tooltipActive) {
            this.activateTooltip()
        }
    }

    componentWillReceiveProps (props) {
        if(props.word !== this.state.currentWord && props.tooltipActive) {
            this.activateTooltip()
            return
        }

        if(!this.state.tooltipActive && props.tooltipActive) { 
            this.activateTooltip()
        } else if (!props.tooltipActive && this.state.tooltipActive) {
            this.activateTooltip()
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.state.tooltipActive &&<span className={`Tsds-english__lesson__input-container__tooltip ${this.state.activeClass}`}>{
                    this.state.randomWord.map((item, i) => {
                        return <span key={i} onClick={e => {
                            e.preventDefault()
                            this.checkChar(item,i, e.target)
                        }} className="w" data-index={item.index} data-char={item.char}>{item.char}</span>
                    })
                }</span> }
                <span className="word-tooltip Tsds-english__lesson__input-container__tooltipbtn" onClick={() => {
                    this.activateTooltip()
                    // Тригерим onClickToolTip (из пропсов)
                    // this.props.onClickTooltip && this.props.onClickTooltip(this.state.tooltipActive)
                }}></span>
            </React.Fragment>
        )
    }
}