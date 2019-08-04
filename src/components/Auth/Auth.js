import React from "react";
import { withRouter } from "react-router-dom";

import axiosAuth from "./../../connection/axios-auth";

class Auth extends React.Component {
  emailInput;

  state = {
    email: "",
    password: "",
    emailClassName: "field",
    passwordClassName: "field",
    waiting: null
  };

  isValid = () => {
    let error = false;

    if (this.state.email === "") {
      error = true;
      this.setState({ emailClassName: "field error" });
    } else {
      this.setState({ emailClassName: "field" });
    }

    if (this.state.password === "") {
      error = true;
      this.setState({ passwordClassName: "field error" });
    } else {
      this.setState({ passwordClassName: "field" });
    }

    return !error;
  };

  onGoAuth = e => {
    e.preventDefault();

    this.props.onWait("Checking for credentials...");
    setTimeout(() => {
      axiosAuth
        .post("/verifyPassword?key=AIzaSyAXRS3ijUJ0HhgC12cSeqe41WnDEcoN6-w", {
          email: this.state.email,
          password: this.state.password,
          returnSecureToken: true
        })
        .then(response => {
          this.props.onStopWait();
          const credentials = response.data;
          console.log("@todo:persist token", credentials);
          this.props.onNotify("Welcome to Crazybook!");
          this.props.history.push({
            pathname: "/"
          });
        })
        .catch(error => {
          console.info("error", error);
          setTimeout(() => {
            this.props.onNotify("Oops! Something went wrong :(", "error");
          }, 99);
          this.props.onStopWait();
        });
    }, 3000);
  };

  typingEmail = e => {
    this.setState({ email: e.target.value });
  };

  typingPassword = e => {
    this.setState({ password: e.target.value });
  };

  onClear = () => {
    this.setState({
      email: "",
      password: ""
    });
    this.emailInput.focus();
  };

  render() {
    let formTitle = (
      <h4 className="mb-4">
        <b>Authentication</b>
      </h4>
    );

    return (
      <div className="auth">
        {formTitle}
        <form
          action="/auth"
          method="post"
          className="form"
          onSubmit={this.onGoAuth}
        >
          <div className="form-body">
            <div className={this.state.emailClassName}>
              {/* email */}
              <input
                type="text"
                autoFocus
                onChange={this.typingEmail}
                ref={input => {
                  this.emailInput = input;
                }}
                placeholder="Email"
                value={this.state.email}
              />
            </div>
            {/* password */}
            <div className={this.state.passwordClassName}>
              <input
                type="password"
                onChange={this.typingPassword}
                placeholder="Password"
                value={this.state.password}
              />
            </div>

            <div className="keypad">
              <button
                type="button"
                className="do do-circular"
                disabled={this.state.email === "" && this.state.password === ""}
                onClick={this.onClear}
              >
                <i className="fas fa-trash" />
              </button>
              <button
                type="submit"
                className="do do-primary"
                disabled={this.state.email === "" || this.state.password === ""}
              >
                <i className="fas fa-arrow-right" />
                Connect
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Auth);
