import React from "react";
import { Link } from "react-router-dom";

function Toolbar(props) {
  if (props.isAuthorManagerVisible) {
    return null;
  }

  return (
    <div className="App-toolbar active">
      <div className="keypad keypad-left">
        <Link to="/" className="do do-circular do-primary">
          <i className="fas fa-home" />
        </Link>
      </div>
      <br />
      {props.showControls ? (
        <div className="keypad keypad-right">
          <a
            className="do do-circular do-danger"
            onClick={props.onStartRemoving}
          >
            <i className="fas fa-eraser" />
          </a>
          <a className="do do-circular do-secondary" onClick={props.onEdit}>
            <i className="fas fa-pencil-alt" />
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default Toolbar;
