import React from 'react';

class Card extends React.Component {

  cardClickHandler(item) {
    this.props.onCoice(item)
  }

  render () {
    return (
      <div className={'card ' + (this.props.isSnowed ? 'opened' : 'closed')} onClick={this.cardClickHandler.bind(this, this.props.item)}>
        <div className="card-inner card-front">
          <img src={'/images/' + this.props.item.image} alt={this.props.item.name}/>
        </div>
        <div className="card-inner card-back">
          <img src={'/images/question.svg'} alt='question.svg' />
        </div>
      </div>
    )
  }
}

export default Card;