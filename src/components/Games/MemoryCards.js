import React from "react";
import { withRouter } from "react-router-dom";

class MemoryCards extends React.Component {
  playerClock;

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
    players: [
      // me
      {
        id: 1,
        name: "Miguel Diganchi",
        won: false,
        score: 0
      },
      {
        id: 2,
        name: "Diego Diganchi",
        won: false,
        score: 0
      }
    ],
    openedCards: [],
    winnerCards: [],
    playingPosition: 0,
    playingPlayer: null,
    cardTimeout: 1500,
    playerTimeout: 9000,
    playerSecondsOut: 0,
    isBoardOpened: false,
    isBeingShuffled: false,
    endGame: false,
    endGameMessage: null,
    confirmer: false
  };

  componentWillUnmount() {
    if (this.playerClock) {
      clearInterval(this.playerClock);
    }
  }

  turn = card => {
    // Prepare arrays
    let openedCards = [...this.state.openedCards];
    let winnerCards = [...this.state.winnerCards];
    let successMatch = false;
    let finishClock = false;
    let firstCard = null;

    // Check for cards
    if (openedCards.length === 0) {
      // Push first card: Wait for the turn timeout
      openedCards.push(card);
      setTimeout(() => {
        this.setState({
          openedCards: []
        });
      }, this.state.cardTimeout);
    } else if (openedCards.length === 1) {
      // Push second card: Check if numbers match
      openedCards.push(card);
      firstCard = openedCards[0];
      if (firstCard.number === card.number && firstCard.kind !== card.kind) {
        winnerCards.push(firstCard);
        winnerCards.push(card);
        openedCards = [];
        successMatch = true;
        // Add points to the score
        this.state.playingPlayer.score += 1;
      }

      // Check for status of winner cards
      if (winnerCards.length === this.state.cards.length) {
        finishClock = true;
      }
      this.exchangeTurn(successMatch, finishClock);
    }

    this.setState({
      openedCards: [...openedCards],
      winnerCards: [...winnerCards]
    });
  };

  exchangeTurn(successMatch, end) {
    // Restart timer if it exists
    if (this.playerClock) {
      clearInterval(this.playerClock);
    }

    // Validate Authentication
    if (!this.props.isAuthenticated()) {
      this.props.onNotify("Please authenticate", "info", 3000);
      this.props.history.push({
        pathname: "/"
      });
      return;
    }

    if (end) {
      // Finish game
      this.showResults();
      return;
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
    let message = successMatch ? "Great!" : "New Turn";
    let messageType = successMatch ? "success" : "info";
    this.props.onWait(message, messageType);

    // Wait for exchanging turn
    const timer = setTimeout(() => {
      this.props.onStopWait();

      if (successMatch) {
        // Player is the same
        this.setState({
          playerSecondsOut: userSecondsOut
        });
      } else {
        // Exchanging the player
        this.setState({
          playingPlayer: players[this.state.playingPosition],
          playerSecondsOut: userSecondsOut,
          playingPosition: nextPosition
        });
      }

      // Set player clock
      this.playerClock = setInterval(() => {
        // Reduce timeout for a 1 second
        playerTimeout -= 1000;
        if (playerTimeout > 0) {
          // Keep counting on: Prepare seconds to show
          userSecondsOut = parseInt(playerTimeout / 1000);
        } else {
          // Timeout: Lets restart clock and do exchange
          clearInterval(this.playerClock);
          doExchange = true;
          userSecondsOut = 0;
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

      clearTimeout(timer);
    }, 999);
  }

  showResults = () => {
    let resultsMessage = "Both are winners!";
    let player1 = this.state.players[0];
    let player2 = this.state.players[1];
    let winner = null;
    // Compare score
    if (player1.score === player2.score) {
      player1.won = true;
      player2.won = true;
    } else if (player1.score > player2.score) {
      player1.won = true;
      winner = player1;
    } else if (player1.score < player2.score) {
      player2.won = true;
      winner = player2;
    }
    // Check if there is a winner
    if (winner) {
      resultsMessage = winner.name + " won!";
    }
    // Finish game
    this.setState({
      endGame: true,
      endGameMessage: resultsMessage
    });
    // Notify results to the user
    this.props.onNotify(resultsMessage, "prize", 6000);
  };

  confirmCloseBoard() {
    this.props.onNotify("Game over for you?", "error", 3000);
    // Get last timer
    this.setState({
      confirmer: true
    });
    // Shut down timer
    if (this.playerClock) {
      clearInterval(this.playerClock);
    }
  }

  cancelCloseBoard() {
    this.setState({
      confirmer: false
    });

    // Continue as the winner
    this.exchangeTurn(true);
  }

  closeBoard = () => {
    this.props.onWait("Closing game...", "info");
    setTimeout(() => {
      // [Visual Effect]
      this.props.onStopWait();
      this.setState({
        openedCards: [],
        winnerCards: [],
        playingPosition: 0,
        playingPlayer: null,
        cardTimeout: 1500,
        playerTimeout: 9000,
        playerSecondsOut: 0,
        isBoardOpened: false,
        isBeingShuffled: false,
        endGame: false,
        endGameMessage: null,
        confirmer: false
      });

      this.resetPlayers();

      if (this.playerClock) {
        clearInterval(this.playerClock);
      }
    }, 999); // [/Visual Effect]
  };

  resetPlayers() {
    this.state.players.forEach(player => {
      player.score = 0;
    });
  }

  startBoard = () => {
    // Doing Shuffle
    this.setState({
      isBeingShuffled: true
    });
    // Wait
    this.props.onWait("Shuffling cards...", "info");

    setTimeout(() => {
      // Stop wait
      this.props.onStopWait();
      // Doing shuffle
      this.shuffle();
      // Activate initial player
      this.exchangeTurn();
      // Change memory state
      this.setState({
        isBoardOpened: true,
        isBeingShuffled: false
      });
    }, 666);
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

  circularHandlerControl() {
    let handlerButtonClassName = this.state.confirmer
      ? "memory-confirmer"
      : "memory-handler";

    if (this.state.confirmer) {
      return (
        <div className={handlerButtonClassName}>
          <button
            onClick={() => this.cancelCloseBoard()}
            type="button"
            className="do do-large"
          >
            <i className="fas fa-ban" />
            Mmna
          </button>
          <button
            onClick={() => this.closeBoard()}
            type="button"
            className="do do-large do-danger"
          >
            <i className="fas fa-trash" />
            Yes, close
          </button>
        </div>
      );
    } else {
      return this.state.isBoardOpened ? (
        <div className={handlerButtonClassName}>
          <button
            onClick={() => this.confirmCloseBoard()}
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
      );
    }
  }

  postResults = () => {
    if (!this.props.onGameResults) {
      return;
    }

    const players = [...this.state.players];
    this.props.onGameResults(players);
  };

  render() {
    let cardClassName = null;

    return (
      <div className="memory">
        {/* board */}
        {this.state.isBoardOpened &&
        !this.state.confirmer &&
        !this.state.endGame ? (
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
        {!this.state.endGame ? (
          <div className="memory-timer">
            {!this.state.confirmer ? (
              <b>{this.state.playerSecondsOut}</b>
            ) : (
              <div className="memory-timer_confirmer_text">
                <small>Do you want to close?</small>
              </div>
            )}
          </div>
        ) : (
          <div className="memory-timer py-3 px-4">
            <small>{this.state.endGameMessage}</small>
          </div>
        )}

        {/* players */}
        <div className="memory-players row">
          {this.state.players.map((player, i) => {
            let cardSideClassName = "memory-players_card col-6 ";
            cardSideClassName +=
              this.isActiveUser(player) && !player.won ? "active " : "";
            cardSideClassName += player.won ? "won " : "";
            cardSideClassName += !(i % 2) ? "left" : "right ";

            return (
              <div key={i} className={cardSideClassName}>
                <div className="memory-players_card_image_holder">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAq53F5miyA4D4SNJ8asuItUGge7r6ML1BcgInmFCypxLVZ_CT"
                    alt={player.name}
                  />
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
        {!this.state.endGame ? this.circularHandlerControl() : null}

        {!this.state.confirmer ? (
          <div className="memory-confirmer ml-3 clearfix">
            {/* Cancel button: Desktop */}
            <button
              type="button"
              className={
                "do responsive responsive-desktop do-large " +
                (this.state.isBoardOpened && !this.state.endGame
                  ? "disabled"
                  : "")
              }
              onClick={this.props.onCancelMemory}
            >
              <i className="fas fa-ban" />
              Cancel
            </button>
            {/* Cancel button: Mobile */}
            <button
              type="button"
              className={
                "do do-circular do-circular-large responsive responsive-mobile " +
                (this.state.isBoardOpened && !this.state.endGame
                  ? "disabled"
                  : "")
              }
              onClick={this.props.onCancelMemory}
            >
              <i className="fas fa-ban" />
            </button>

            {/* Post Button: Desktop */}
            <button
              type="button"
              className={
                "do do-primary responsive responsive-desktop do-large no-margin " +
                (!this.state.endGame ? "disabled" : "")
              }
              onClick={this.postResults}
            >
              <i className="fas fas fa-check" />
              Post
            </button>
            {/* Post Button: Mobile */}
            <button
              type="button"
              className={
                "do do-primary do-circular do-circular-large responsive responsive-mobile no-margin " +
                (!this.state.endGame ? "disabled" : "")
              }
              onClick={this.postResults}
            >
              <i className="fas fas fa-check" />
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(MemoryCards);
