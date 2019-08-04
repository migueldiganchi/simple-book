import React from "react";

function PublicationListTitle(props) {
  return (
    <div className="keypad board-panel-keypad">
      <div className="text">
        <span>{props.title}</span>
        <small>{props.results} results</small>
        {props.resultsFilterTermText ? (
          <small>
            <i>{props.resultsFilterTermText}</i>
          </small>
        ) : null}
      </div>
      <a
        className={"do do-primary " + (props.disabled ? "disabled" : "")}
        onClick={props.onCreatePublication}
      >
        <i className="fas fa-plus" />
        Publication
      </a>
    </div>
  );
}

export default PublicationListTitle;
