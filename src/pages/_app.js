import "@/styles/globals.css";
import "@/styles/_app.css";
import '../components/Card.css'
import config from "../config";
import React, { useEffect } from "react";
import Card from "@/components/Card";
import Popup from 'reactjs-popup';

class App extends React.Component {

  constructor() {
    super();
    this.state = {cards: [], clicks: 0, isPopupOpened: true, popup: ''};

  }

  componentDidMount() {
    this.setState({
      cards: this.prepareCards(),
      popup: <Popup open={this.state.isPopupOpened} closeOnDocumentClick onClose={this.closePopup.bind(this)} modal>
          <div className="modal">
            <span className="close" onClick={this.closePopup.bind(this)}>
              &times;
            </span>
            Игра завершена! Ваш результат: {this.state.clicks} кликов!
          </div>
        </Popup>
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
      isPopupOpened: true
    }, () => {
      console.log(this.state.cards)
      console.log(this.state.isPopupOpened)
      this.processChoosingCards();
    });

    this.setState({clicks: this.state.clicks + 1});
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
      this.setState({isPopupOpened: true});
    }
  }

  closePopup() {
    this.setState({isPopupOpened: false});
  }

  render() {

    return (
      <div className="App">
        <header className="header">Memory game</header>
        <div className="game">
          <div className="score">
            Нажатий: {this.state.clicks}
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

        {this.state.popup}

        <Popup open={this.state.isPopupOpened} closeOnDocumentClick onClose={this.closePopup.bind(this)} modal>
          <div className="modal">
            <span className="close" onClick={this.closePopup.bind(this)}>
              &times;
            </span>
            Игра завершена! Ваш результат: {this.state.clicks} кликов!
          </div>
        </Popup>

      </div>
    )
  }

}

export default App;
