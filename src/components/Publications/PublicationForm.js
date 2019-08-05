import React, { Component } from "react";
import axios from "./../../connection/axios-app";

import Validation from "./../Validation";

class PublicationForm extends Component {
  state = {
    body: "",
    scope: null,
    bodyValidationErrors: [],
    scopeTypes: {
      FRIENDS: 1,
      PUBLIC: 2
    }
  };

  componentDidMount() {
    this.setState({
      id: this.props.publication.id,
      body: this.props.publication.body,
      scope:
        this.props.publication && this.props.publication.scope
          ? this.props.publication.scope
          : this.state.scopeTypes.FRIENDS,
      bodyClassName: "field"
    });
  }

  onSubmitPublication = e => {
    e.preventDefault();
    let publication = {
      id: this.props.publication.id,
      body: this.state.body,
      scope: this.state.scope
    };
    if (!this.isValid(publication)) {
      return;
    }

    this.savePublication(publication);

    if (this.props.onSave) {
      this.props.onSave(publication);
    }
  };

  savePublication = publication => {
    let isNewPublication = !publication.id;
    let method = isNewPublication ? axios.post : axios.put;
    let url = isNewPublication
      ? "/publications.json"
      : `/publications/${publication.id}.json`;
    let loadingMessage = isNewPublication
      ? "Creating publication..."
      : "Saving publication...";

    // go server to save publication
    this.props.onWait(loadingMessage);
    method(url, publication)
      .then(() => {
        this.props.onStopWait();
        setTimeout(() => {
          let message =
            "Successfuly " + (isNewPublication ? "created" : "updated");
          if (this.props.onSave) {
            this.props.onSave(publication);
            setTimeout(() => {
              this.props.onNotify(message, "info");
            }, 333);
          }
        }, 300);
      })
      .catch(error => {
        this.props.onNotify("Oops! Something went wrong", "error");
      });
  };

  isValid = publication => {
    let error = false;
    let bodyErrors = [];

    if (publication.body === "") {
      bodyErrors.push({
        message: "Body is required"
      });
      this.setState({ bodyClassName: "field error" });
    } else if (publication.body.length < 6) {
      bodyErrors.push({
        message: "Too short (min: 6)"
      });
      this.setState({ bodyClassName: "field error" });
    } else {
      this.setState({ bodyClassName: "field" });
    }

    this.setState({
      bodyValidationErrors: bodyErrors
    });

    error = bodyErrors.length > 0;

    if (error) {
      this.props.onNotify("Oops", "error");
    }

    return !error;
  };

  typingBody = e => {
    this.setState({ body: e.target.value });
  };

  onEnterPress = e => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      this.onSubmitPublication(e);
    }
  };

  setScope = scope => {
    this.setState({
      scope: scope
    });
  };

  render() {
    let formTitle = (
      <h4 className="mb-4">
        <b>{this.props.publication.id ? "Editing" : "New"} Publication</b>
      </h4>
    );

    let switcherFriendsClassName =
      "do " +
      (this.state.scope === this.state.scopeTypes.FRIENDS
        ? "do-warning"
        : "do-secondary");
    let switcherPublicClassName =
      "do " +
      (this.state.scope === this.state.scopeTypes.PUBLIC
        ? "do-warning"
        : "do-secondary");

    return (
      <div className="form-container">
        {/* {formTitle} */}
        <form
          action="/publications"
          method="post"
          className="form"
          onSubmit={this.onSubmitPublication}
        >
          <div className="form-body">
            <div className={this.state.bodyClassName}>
              <textarea
                type="text"
                rows="2"
                autoFocus
                onKeyDown={this.onEnterPress}
                onChange={this.typingBody}
                placeholder="Publication body"
                value={this.state.body}
              />
            </div>
            <Validation validationList={this.state.bodyValidationErrors} />
          </div>

          <div className="clearfix">
            <div className="keypad keypad-inline-block responsive responsive-desktop float-left">
              <button
                type="button"
                className={switcherFriendsClassName}
                onClick={() => {
                  this.setScope(this.state.scopeTypes.FRIENDS);
                }}
              >
                <i className="fas fa-users icon-friends" />
                Only friends
              </button>
              <button
                type="button"
                className={switcherPublicClassName}
                onClick={() => {
                  this.setScope(this.state.scopeTypes.PUBLIC);
                }}
              >
                <i className="fas fa-lock-open icon-public" />
                Public
              </button>
            </div>

            <div className="keypad keypad-inline-block responsive responsive-mobile float-left">
              <button
                type="button"
                className={switcherFriendsClassName + " do-circular"}
                onClick={() => {
                  this.setScope(this.state.scopeTypes.FRIENDS);
                }}
              >
                <i className="fas fa-users icon-friends" />
              </button>
              <button
                type="button"
                className={switcherPublicClassName + " do-circular"}
                onClick={() => {
                  this.setScope(this.state.scopeTypes.PUBLIC);
                }}
              >
                <i className="fas fa-lock-open icon-public" />
              </button>
            </div>

            <div className="keypad keypad-inline-block responsive responsive-desktop float-right">
              <button
                type="button"
                className="do"
                onClick={this.props.onCancel}
              >
                <i className="fas fa-ban" />
                Cancel
              </button>
              <button type="submit" className="do do-primary">
                <i className="fas fas fa-check" />
                {this.props.publication.id ? "Update" : "Post"}
              </button>
            </div>
            <div className="keypad keypad-inline-block responsive responsive-mobile float-right">
              <button
                type="button"
                className="do do-circular"
                onClick={this.props.onCancel}
              >
                <i className="fas fa-ban" />
              </button>
              <button type="submit" className="do do-circular do-primary">
                <i className="fas fas fa-check" />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default PublicationForm;
