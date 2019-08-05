import React from "react";

function PublicationListTitle(props) {
  return (
    <div className="keypad board-panel-keypad text-center">
      <div className={props.featured ? "text text-featured" : "text"}>
        <span>{props.title}</span>
        {props.results ? <small>{props.results} results</small> : null}
        {props.resultsFilterTermText ? (
          <small>
            (<b className="text-featured">{props.resultsFilterTermText}</b>)
          </small>
        ) : null}
      </div>
      {props.isAuthenticated() ? (
        <div
          className={
            "adder-container keypad my-3 " +
            (props.disabled ? " responsive responsive-desktop" : "")
          }
        >
          <a
            disabled={props.disabled}
            className={"do do-primary"}
            onClick={props.onCreatePublication}
          >
            <i className="fas fa-plus" />
            Publication
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default PublicationListTitle;
