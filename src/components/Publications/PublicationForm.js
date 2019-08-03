import React, { Component } from "react";
import axios from "axios";

class PublicationForm extends Component {
  state = {
    body: "",
    scope: -1,
    scopeTypes: {
      FRIENDS: 0,
      PUBLIC: 1
    }
  };

  componentDidMount() {
    this.setState({
      id: this.props.publication.id,
      body: this.props.publication.body,
      bodyClassName: "field",
      scope: this.state.scopeTypes.FRIENDS
    });
  }

  onSubmitPublication = e => {
    e.preventDefault();
    let publication = {
      id: this.props.publication.id,
      body: this.state.body
    };
    if (!this.validate(publication)) {
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
      ? "/api/publication"
      : "/api/publication/" + publication.id;
    let loadingMessage = isNewPublication
      ? "Creating publication..."
      : "Saving publication...";

    // go server to save publication
    this.props.onWait(loadingMessage);
    method(url, publication)
      .then(response => {
        this.props.onStopWait();
        setTimeout(() => {
          let messageType = response.data.status
            ? isNewPublication
              ? "success"
              : "info"
            : "error";
          let message = response.data.message;
          this.props.onNotify(message, messageType);

          if (this.props.onSave) {
            this.props.onSave(publication);
          }
        }, 300);
      })
      .catch(error => {
        this.props.onNotify(error.response.message, "error");
      });
  };

  validate = publication => {
    let error = false;

    if (publication.body === "") {
      error = true;
      this.setState({ bodyClassName: "field error" });
    } else {
      this.setState({ bodyClassName: "field" });
    }

    if (error) {
      this.props.onNotify("Ups, check your information please", "error");
    }

    return !error;
  };

  typingBody = e => {
    this.setState({ body: e.target.value });
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
        {formTitle}
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
                rows="3"
                autoFocus
                onChange={this.typingBody}
                placeholder="Publication body"
                value={this.state.body}
              />
            </div>
          </div>

          <div className="keypad">
            <button
              type="button"
              className="do do-circular"
              onClick={this.props.onCancel}
            >
              <i className="fas fa-trash" />
            </button>
            <div className="responsive responsive-desktop">
              <button
                type="button"
                className={switcherFriendsClassName}
                onClick={() => {
                  this.setScope(this.state.scopeTypes.FRIENDS);
                }}
              >
                <i className="fas fa-user-friends" />
                Only friends
              </button>
              <button
                type="button"
                className={switcherPublicClassName}
                onClick={() => {
                  this.setScope(this.state.scopeTypes.PUBLIC);
                }}
              >
                <i className="fas fa-fire" />
                Public
              </button>
              <button type="submit" className="do do-primary">
                <i className="fas fa-seedling" />
                Publish
              </button>
            </div>
            <div className="responsive responsive-mobile">
              <button
                type="button"
                className={switcherFriendsClassName}
                onClick={() => {
                  this.setScope(this.state.scopeTypes.FRIENDS);
                }}
              >
                <i className="fas fa-user-friends" />
              </button>
              <button
                type="button"
                className={switcherPublicClassName}
                onClick={() => {
                  this.setScope(this.state.scopeTypes.PUBLIC);
                }}
              >
                <i className="fas fa-fire" />
              </button>
              <button type="submit" className="do do-circular do-primary">
                <i className="fas fa-seedling" />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default PublicationForm;
