import React from "react";
import { Route, withRouter } from "react-router-dom";

import Auth from "./components/Auth/Auth";

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

  constructor(props) {
    super(props);
  }

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
        message: message,
        type: "default"
      }
    });
  };

  stopWait = () => {
    this.setState({
      waiting: null,
      notification: null
    });
  };

  wall = props => {
    return (
      <PublicationManager
        waiting={this.state.waiting}
        onNotify={this.notify}
        onWait={this.wait}
        isAuthenticated={this.isAuthenticated}
        onStopWait={this.stopWait}
        {...props}
      />
    );
  };

  auth = props => {
    if (this.isAuthenticated()) {
      this.props.history.push({
        pathname: "/"
      });
      return;
    }
    return (
      <Auth
        waiting={this.state.waiting}
        onNotify={this.notify}
        onWait={this.wait}
        onStopWait={this.stopWait}
        onAuth={this.openApp}
        {...props}
      />
    );
  };

  isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const expirationDate = new Date(localStorage.getItem("expirationDate"));
    const currentDate = new Date();

    return token !== null && expirationDate > currentDate;
  };

  openApp = credentials => {
    const expirationDate = new Date(
      new Date().getTime() + credentials.expiresIn * 1000
    );
    localStorage.setItem("token", credentials.idToken);
    localStorage.setItem("expirationDate", expirationDate);
  };

  closeApp = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    this.props.history.push({
      pathname: "/"
    });
    this.notify("See you soon!");
    return;
  };

  render() {
    let glassApp =
      this.state.isAuthorManagerVisible || this.state.waiting ? (
        <div className="App-glass" onClick={this.toggleManager} />
      ) : null;

    let loadingApp = this.state.waiting ? <Loading /> : null;

    return (
      <div className="App">
        {glassApp}
        {loadingApp}
        <Header
          title="Fasobook"
          isAuthenticated={this.isAuthenticated}
          onLogout={this.closeApp}
          {...this.props}
        />
        <Board>
          <BoardPanel>
            <Route path="/" exact render={this.wall} />
            <Route path="/auth" render={this.auth} />
          </BoardPanel>
        </Board>

        <Notifier
          notification={this.state.notification}
          waiting={this.state.waiting}
        />
      </div>
    );
  }
}

export default withRouter(App);
