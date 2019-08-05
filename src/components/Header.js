import React from "react";
import { withRouter, NavLink, matchPath } from "react-router-dom";

class Header extends React.Component {
  state = {
    closeConfirmation: false
  };

  proposeLogout = () => {
    this.setState({
      closeConfirmation: true
    });
  };

  declineLogout = () => {
    this.setState({
      closeConfirmation: false
    });
  };

  doLogout = () => {
    this.setState({
      closeConfirmation: false
    });
    this.props.onLogout();
  };

  render() {
    const isAuthActive = !!matchPath(this.props.location.pathname, "/auth");
    const isHomeActive = !!matchPath(this.props.location.pathname, {
      path: "/",
      exact: true
    });

    return (
      <header
        className={
          "App-header " +
          (this.state.closeConfirmation ? "confirming-close" : "")
        }
      >
        <div className="App-title m-0 clearfix">
          {!this.props.isAuthenticated() ? (
            [
              <NavLink
                key="login-desktop"
                to="/auth"
                activeClassName="active"
                className={
                  "do do-primary float-left responsive responsive-desktop " +
                  (isAuthActive ? "disabled" : "")
                }
              >
                <i className="fas fa-plug" />
                Enter
              </NavLink>,
              <NavLink
                key="login-mobile"
                to="/auth"
                activeClassName="active"
                className={
                  "do do-primary do-circular float-left responsive responsive-mobile " +
                  (isAuthActive ? "disabled" : "")
                }
              >
                <i className="fas fa-key" />
              </NavLink>
            ]
          ) : !this.state.closeConfirmation ? (
            [
              <a
                onClick={this.proposeLogout}
                key="logout-desktop"
                className="do do-danger float-left responsive responsive-desktop "
              >
                <i className="fas fa-power-off" />
                Go out
              </a>,
              <a
                onClick={this.proposeLogout}
                key="logout-mobile"
                className="do do-danger do-circular float-left responsive responsive-mobile "
              >
                <i className="fas fa-power-off" />
              </a>
            ]
          ) : (
            <div className="App-closer-confirmer">
              <a
                onClick={this.declineLogout}
                key="confirm-logout-mobile"
                className="do do-secondary do-circular float-left responsive responsive-mobile "
              >
                <i className="fas fa-undo-alt" />
              </a>
              <a
                onClick={this.declineLogout}
                key="confirm-logout-desktop"
                className="do do-secondary float-left responsive responsive-desktop"
              >
                <i className="fas fa-undo-alt" />
                Back
              </a>
              <a
                onClick={this.doLogout}
                key="confirm-logout"
                className="do do-primary float-left"
              >
                <i className="fas fa-power-off" />
                Yes
                <span className="responsive responsive-desktop">
                  , close it
                </span>
              </a>
            </div>
          )}
          <h5 className="App-title-text mt-1">
            {this.state.closeConfirmation ? (
              <b>Are you sure?</b>
            ) : (
              <NavLink
                to="/"
                activeClassName={isHomeActive ? "" : "text-underline"}
              >
                <span>{this.props.title}</span>
              </NavLink>
            )}
          </h5>
          <NavLink
            to="/"
            className={
              "do do-primary float-right responsive responsive-desktop " +
              (isHomeActive ? "disabled" : "")
            }
          >
            <i className="fas fa-home" />
            Home
          </NavLink>
          <NavLink
            to="/"
            className={
              "do do-primary do-circular float-right responsive responsive-mobile " +
              (isHomeActive ? "disabled" : "")
            }
          >
            <i className="fas fa-home" />
          </NavLink>
        </div>
        <div>{this.props.children}</div>
      </header>
    );
  }
}

export default withRouter(Header);
