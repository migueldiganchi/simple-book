import React from "react";

import Loading from "./components/Loading";
import Header from "./components/Header";
import Board from "./components/Board";
import Notifier from "./components/Notifier";
import BoardPanel from "./components/BoardPanel";

import PublicationManager from "./components/Publications/PublicationManager";

class App extends React.Component {
  state = {
    notification: null,
    waiting: null
  };

  notify = (message, messageType, messageTimeout, callback) => {
    this.setState({
      notification: {
        message: message,
        type: messageType ? messageType : "info"
      }
    });

    setTimeout(() => {
      this.stopNotify();
      if (callback) {
        callback();
      }
    }, messageTimeout || 3000);
  };

  notifyError = message => {
    this.notify(message, "error");
  };

  stopNotify = () => {
    this.setState({ notification: null });
  };

  wait = message => {
    this.setState({
      waiting: message,
      notification: {
        message: message
      }
    });
  };

  stopWait = () => {
    this.setState({
      waiting: null,
      notification: null
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">CrazyBook App</header>
        <Board>
          <BoardPanel>
            <PublicationManager
              waiting={this.state.waiting}
              onNotify={this.notify}
              onWait={this.wait}
              onStopWait={this.stopWait}
            />
          </BoardPanel>
        </Board>
      </div>
    );
  }
}

export default App;
