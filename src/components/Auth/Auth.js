import React from "react";
import { withRouter } from "react-router-dom";

import axiosAuth from "./../../connection/axios-auth";

import Validation from "../Validation";

class Auth extends React.Component {
  emailInput;

  state = {
    email: "",
    password: "",
    emailClassName: "field",
    passwordClassName: "field",
    waiting: null,
    emailValidationErrors: [],
    passwordValidationErrors: []
  };

  isValid = () => {
    let error = false;
    let emailErrors = [];
    let passwordErrors = [];

    if (this.state.email === "") {
      emailErrors.push({
        message: "Email is required"
      });
      this.setState({ emailClassName: "field error" });
    } else if (!this.isValidEmailFormat(this.state.email)) {
      emailErrors.push({
        message: "Bad email format"
      });
      this.setState({ emailClassName: "field error" });
    } else {
      this.setState({ emailClassName: "field" });
    }

    if (this.state.password === "") {
      passwordErrors.push({
        message: "Password is required"
      });
      this.setState({ passwordClassName: "field error" });
    } else if (this.state.password.length < 6) {
      passwordErrors.push({
        message: "Too short (min: 6)"
      });
      this.setState({ passwordClassName: "field error" });
    } else {
      this.setState({ passwordClassName: "field" });
    }

    this.setState({
      emailValidationErrors: emailErrors,
      passwordValidationErrors: passwordErrors
    });

    error = emailErrors.length > 0 || passwordErrors.length > 0;

    if (error) {
      this.props.onNotify("Oops", "error");
    }

    return !error;
  };

  isValidEmailFormat = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  onGoAuth = e => {
    e.preventDefault();
    if (!this.isValid()) {
      return null;
    }

    this.props.onWait("Checking for credentials...");
    // setTimeout(() => {
    axiosAuth
      .post("/verifyPassword?key=AIzaSyAXRS3ijUJ0HhgC12cSeqe41WnDEcoN6-w", {
        email: this.state.email,
        password: this.state.password,
        returnSecureToken: true
      })
      .then(response => {
        this.props.onStopWait();
        const credentials = response.data;
        this.storeCredentials(credentials);
        this.props.onNotify("Welcome to Fasobook!");
        this.props.history.push({
          pathname: "/"
        });
      })
      .catch(error => {
        setTimeout(() => {
          this.props.onNotify("Bad credentials", "error");
        }, 99);
        this.props.onStopWait();
      });
    // }, 3000);
  };

  storeCredentials = credentials => {
    this.props.onAuth(credentials);
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
      password: "",
      emailClassName: "field",
      passwordClassName: "field",
      emailValidationErrors: [],
      passwordValidationErrors: []
    });
    this.emailInput.focus();
  };

  render() {
    let formTitle = (
      <div>
        <h4 className="mb-4">
          <b>Authentication</b>
        </h4>
      </div>
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
            <div>
              <div
                className={
                  "text text-left px-2 " +
                  (this.state.emailValidationErrors.length > 0 ? "error" : "")
                }
              >
                <label>Email</label>
              </div>
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
              <Validation validationList={this.state.emailValidationErrors} />

              {/* password */}
              <div
                className={
                  "text text-left px-2 " +
                  (this.state.passwordValidationErrors.length > 0
                    ? "error"
                    : "")
                }
              >
                <label>Password</label>
              </div>
              <div className={this.state.passwordClassName}>
                <input
                  type="password"
                  onChange={this.typingPassword}
                  placeholder="Password"
                  value={this.state.password}
                />
              </div>

              <Validation
                validationList={this.state.passwordValidationErrors}
              />
            </div>

            <div className="keypad">
              <button
                type="button"
                className="do do-circular"
                onClick={this.onClear}
              >
                <i className="fas fa-eraser" />
              </button>
              <button type="submit" className="do do-primary">
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
