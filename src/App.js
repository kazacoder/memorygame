import "./styles/globals.css";
import "./App.css";
import './components/Card.css'
import config from "./config";
import React from "react";
import Card from "./components/Card";
import Popup from 'reactjs-popup';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      cards: [], clicks: 0, isPopupOpened: false,
      seconds: 0, interval: null, bestTime: null, bestClicks: null
    };
  }

  componentDidMount() {
    this.startGame()
    const bestResult = localStorage.getItem('result')
    if (bestResult) {
      const bestResultObject = JSON.parse(bestResult)
      this.setState({
        bestTime: bestResultObject.time,
        bestClicks: bestResultObject.clicks,
      })
    }
  }

  startGame() {
    this.setState({
      cards: this.prepareCards(),
      clicks: 0,
      isPopupOpened: false,
      seconds: 0,
    });

  }

  prepareCards() {
    let id = 1
    return [...config.cards, ...config.cards]
      .sort(() => Math.random() - 0.5)
      .map(item => {
        return {...item, id: id++, isOpened: false, isCompleted: false};
      });
  }

  choiceCardHandler(openedItem) {

    if (openedItem.isCompleted || this.state.cards.filter(item => item.isOpened).length >= 2) {
      return;
    }

    this.setState({
      cards: this.state.cards.map(item => {
        return item.id === openedItem.id ? {...item, isOpened: true} : item;
      }),
    }, () => {
      this.processChoosingCards();
    });

    if (!(openedItem.isCompleted || openedItem.isOpened)) {
      this.setState({clicks: this.state.clicks + 1}, () => {
        if (this.state.clicks === 1) {
          this.setState({
            interval: window.setInterval(() => {
              this.setState({seconds: this.state.seconds + 1});
            }, 1000)
          })
        }
      });

    }
  }

  processChoosingCards() {
    const openedCards = this.state.cards.filter(item => item.isOpened);
    if (openedCards.length === 2) {
      if (openedCards[0].name === openedCards[1].name) {
        this.setState({
          cards: this.state.cards.map(item => {
            if (item.id === openedCards[0].id || item.id === openedCards[1].id) {
              item.isCompleted = true;
            }
            item.isOpened = false;
            return item
          })
        }, () => {
          this.checkForAllCompleted()
        });
      } else {
        setTimeout(() => {
          this.setState({
            cards: this.state.cards.map(item => {
              item.isOpened = false;
              return item
            })
          });
        }, 1000)
      }
    }
  }

  checkForAllCompleted() {
    if (this.state.cards.every(item => item.isCompleted)) {
      this.setState({
        isPopupOpened: true,
      });
      clearInterval(this.state.interval);

      if (this.state.bestClicks === null || this.state.bestClicks > this.state.clicks) {
        this.setState({
          bestTime: this.state.seconds,
          bestClicks: this.state.clicks,
        });
        localStorage.setItem('result', JSON.stringify({clicks: this.state.clicks, time: this.state.seconds}));
      }
    }
  }

  closePopup() {
    this.setState({isPopupOpened: false});
    this.startGame()
  }

  render() {

    return (
      <div className="App">
        <header className="header">Memory game</header>
        <div className="game">
          <div className="score">
            <span>Нажатий: {this.state.clicks} </span>
            <span>Время: {this.state.seconds}</span>
          </div>
          <div className="cards">
            {
              this.state.cards.map((item) => (
                <Card item={item} key={item.id} isSnowed={item.isOpened || item.isCompleted}
                      onCoice={this.choiceCardHandler.bind(this)}/>
              ))
            }
          </div>
        </div>

        <Popup open={this.state.isPopupOpened} closeOnDocumentClick onClose={this.closePopup.bind(this)}>
          <div className="modal">
            <span className="close" onClick={this.closePopup.bind(this)}>
              &times;
            </span>
            Игра завершена! Ваш результат: {this.state.clicks} кликов, время {this.state.seconds} секунд! <br/><br/>
            Лучший результат: {this.state.bestClicks} кликов, время {this.state.bestTime} секунд.
          </div>
        </Popup>

      </div>
    )
  }

}

export default App;
