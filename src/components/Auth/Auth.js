import React from "react";

class Auth extends React.Component {
  emailInput;

  state = {
    email: "",
    password: "",
    emailClassName: "field",
    passwordClassName: "field",
    isRememberButtonActive: false
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
    console.log("going submit?");
    alert("submition!");
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

  toggleRememberState = () => {
    this.setState({
      isRememberButtonActive: !this.state.isRememberButtonActive
    });
  };

  render() {
    let formTitle = (
      <h4 className="mb-4">
        <b>Authentication</b>
      </h4>
    );
    let rememberButtonClassName = this.state.isRememberButtonActive
      ? "do do-primary"
      : "do do-secondary";

    return (
      <div class="auth">
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
                <i className="fas fa-eraser" />
              </button>
              <button
                type="button"
                onClick={this.toggleRememberState}
                className={rememberButtonClassName}
              >
                <i className="fas fa-bookmark" />
                Remember me
              </button>
              <button type="submit" className="do do-primary">
                <i className="fas fa-key" />
                Go
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Auth;
