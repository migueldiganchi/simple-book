import React from "react";
// import axios from "./../../connection/axios-app";

class MemoryCards extends React.Component {
  state = {
    cards: [
      { id: 1, kind: "a", number: "1" },
      { id: 2, kind: "a", number: "2" },
      { id: 3, kind: "a", number: "3" },
      { id: 4, kind: "a", number: "4" },
      { id: 5, kind: "a", number: "5" },
      { id: 6, kind: "a", number: "6" },
      { id: 7, kind: "a", number: "7" },
      { id: 8, kind: "a", number: "8" },
      { id: 9, kind: "a", number: "9" },
      { id: 10, kind: "a", number: "10" },
      { id: 11, kind: "b", number: "1" },
      { id: 12, kind: "b", number: "2" },
      { id: 13, kind: "b", number: "3" },
      { id: 14, kind: "b", number: "4" },
      { id: 15, kind: "b", number: "5" },
      { id: 16, kind: "b", number: "6" },
      { id: 17, kind: "b", number: "7" },
      { id: 18, kind: "b", number: "8" },
      { id: 19, kind: "b", number: "9" },
      { id: 20, kind: "b", number: "10" }
    ],
    openedCards: [],
    winnerCards: [],
    players: [
      // me
      {
        id: 1,
        name: "Miguel Diganchi",
        score: 0
      },
      {
        id: 2,
        name: "Diego Diganchi",
        score: 0
      }
    ],
    playingPosition: 0,
    playingPlayer: null,
    cardTimeout: 1500,
    playerTimeout: 9000,
    playerSecondsOut: 0,
    isBoardOpened: false,
    isBeingShuffled: false
  };

  async exchangeTurn() {
    // Restart timer if it exists
    if (window.playerClock) {
      clearInterval(window.playerClock);
    }
    // Initial values
    const players = [...this.state.players];
    let playerTimeout = this.state.playerTimeout;
    let userSecondsOut = parseInt(playerTimeout / 1000);
    let nextPosition = this.state.playingPosition + 1;
    let doExchange = false;
    // If next position doesn't exists go back to the initial player
    if (!players[nextPosition]) {
      nextPosition = 0;
    }
    // Initial settings
    setTimeout(() => { // Wait for the next tick to allow rendering (?)
      this.setState({
        playingPlayer: players[this.state.playingPosition],
        playerSecondsOut: userSecondsOut,
        playingPosition: nextPosition
      });
    }, 1);
    // Start chronometer
    window.playerClock = setInterval(() => {
      // Reduce timeout for a 1 second
      playerTimeout -= 1000;
      if (playerTimeout === 0) {
        // Timeout: Lets restart clock and do exchange
        clearInterval(window.playerClock);
        doExchange = true;
        // Show the finish of chronometer
        userSecondsOut = 0;
      } else {
        // Keep counting on: Prepare seconds to show
        userSecondsOut = parseInt(playerTimeout / 1000);
      }
      // Show seconds in the panel
      this.setState({
        playerSecondsOut: userSecondsOut
      });
      // Check if we must exchange
      if (doExchange) {
        this.exchangeTurn();
      }
    }, 1000);
  }

  delay(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  closeBoard = () => {
    this.setState({
      isBoardOpened: false,
      isBeingShuffled: false,
      playingPosition: 0,
      playingPlayer: null
    });
  };

  startBoard = () => {
    // Doing Shuffle
    this.setState({
      isBeingShuffled: true
    });
    // Wait
    this.props.onWait("Shuffling cards...");

    setTimeout(() => {
      // Stop wait
      this.props.onStopWait();
      // Doing shuffle
      this.shuffle();
      // @todo: Activate initial player
      this.exchangeTurn();
      // Change memory state
      this.setState({
        isBoardOpened: true,
        isBeingShuffled: false
      });
    }, 666);
  };

  turn = card => {
    let openedCards = [...this.state.openedCards];
    let winnerCards = [...this.state.winnerCards];

    if (openedCards.length === 0) {
      openedCards.push(card);
      setTimeout(() => {
        this.setState({
          openedCards: []
        });
      }, this.state.cardTimeout);
    } else if (openedCards.length === 1) {
      openedCards.push(card);
      let prevCard = openedCards[0];
      let currentPlayer = this.state.playingPlayer;
      if (prevCard.number === card.number) {
        winnerCards.push(prevCard);
        winnerCards.push(card);
        openedCards = [];
        setTimeout(() => {
          currentPlayer.score += 1;
          this.setState({
            playingPlayer: currentPlayer
          });
        }, this.state.cardTimeout);
      } else {
        setTimeout(() => {
          this.exchangeTurn();
        }, this.state.cardTimeout);
      }
    }

    this.setState({
      openedCards: [...openedCards],
      winnerCards: [...winnerCards]
    });
  };

  shuffle = () => {
    const cards = [...this.state.cards];
    let i = cards.length;
    let j = 0;
    let switcher = null;

    while (i-- > 0) {
      j = Math.floor(Math.random() * (i + 1));
      switcher = cards[j];
      cards[j] = cards[i];
      cards[i] = switcher;
    }

    this.setState({
      cards: cards
    });
  };

  isCardOpened = card => {
    let foundCard = this.state.openedCards.find(openedCard => {
      return openedCard.id === card.id;
    });

    return foundCard !== undefined;
  };

  isActiveUser = user => {
    if (!this.state.playingPlayer) {
      return false;
    }
    return this.state.playingPlayer.id === user.id;
  };

  isInWinnerBoard = card => {
    let winnerCard = this.state.winnerCards.find(thisCard => {
      return thisCard.id === card.id;
    });

    return winnerCard !== undefined;
  };

  render() {
    let cardClassName = null;
    let handlerButtonClassName = "memory-handler";

    return (
      <div className="memory">
        {/* board */}
        {this.state.isBoardOpened ? (
          <div className="memory-board row">
            {this.state.cards.map((card, i) => {
              cardClassName = "memory-board_card_wrapper";
              cardClassName += card.kind === "a" ? " dark" : " light";
              cardClassName +=
                this.isCardOpened(card) || this.isInWinnerBoard(card)
                  ? ""
                  : " back";

              return (
                <div
                  key={i}
                  onClick={() => this.turn(card)}
                  className="memory-board_card col-3"
                >
                  <div className={cardClassName}>
                    <h3>{card.number}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* timer */}
        <div className="memory-timer">
          <b>{this.state.playerSecondsOut}</b>
        </div>

        {/* players */}
        <div className="memory-players row">
          {this.state.players.map((player, i) => {
            let cardSideClassName = "memory-players_card col-6 ";
            cardSideClassName += this.isActiveUser(player) ? "active " : "";
            cardSideClassName += !(i % 2) ? "left" : "right";

            return (
              <div key={i} className={cardSideClassName}>
                <div className="memory-players_card_image_holder">
                  <img src="" alt="" />
                </div>
                <h4 className="memory-playsers_card_name">{player.name}</h4>
                <div className="memory-playsers_card_details mt-3">
                  <h2 className="score">{player.score}</h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* Circular handler */}
        {this.state.isBoardOpened ? (
          <div className={handlerButtonClassName}>
            <button
              onClick={this.closeBoard}
              type="button"
              className="do do-circular do-primary do-circular-large"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        ) : (
          <div className={handlerButtonClassName}>
            <button
              onClick={this.startBoard}
              type="button"
              className="do do-circular do-primary do-circular-large"
            >
              <i className="fas fa-play" />
            </button>
          </div>
        )}

        <div className="memory-buttons clearfix">
          <div className="keypad keypad-inline-block responsive responsive-desktop float-left">
            <button type="button" className="do do-circular do-secondary">
              <i className="fas fa-users icon-friends" />
            </button>
          </div>

          <div className="keypad keypad-inline-block responsive responsive-desktop float-right">
            <button
              type="button"
              className="do do-secondary"
              onClick={this.props.onCancelMemory}
            >
              <i className="fas fa-users icon-friends" />
              Cancel
            </button>
            <button type="button" className="do do-primary">
              <i className="fas fas fa-check" />
              Post
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default MemoryCards;
