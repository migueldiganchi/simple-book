import React from "react";

function PublicationListTitle(props) {
  return (
    <div className="keypad board-panel-keypad text-center mt-2 mb-4">
      <div className={props.featured ? "text text-featured" : "text"}>
        <span>{props.title}</span>
        {props.results ? <small>{props.results} results</small> : null}
        {props.resultsFilterTermText ? (
          <small>
            (<b className="text-featured">{props.resultsFilterTermText}</b>)
          </small>
        ) : null}
      </div>
      {props.isAuthenticated() && !props.disabled ? (
        <div
          className={
            "adder-container keypad my-3 " +
            (props.disabled ? " " : "")
          }
        >
          <a
            disabled={props.disabled}
            className={"do do-primary no-margin"}
            onClick={props.onCreatePublication}
          >
            <i className="fas fa-keyboard" />
            Publication
          </a>
          {/* <a
            disabled={props.disabled}
            className={"do do-primary do-circular responsive responsive-mobile no-margin"}
            onClick={props.onCreatePublication}
          >
            <i className="fas fa-keyboard" />
          </a> */}

          {/* <a
            disabled={props.disabled}
            className={"do do-primary responsive responsive-desktop no-margin"}
            onClick={props.onCreateGame}
          >
            <i className="fas fa-trophy" />
            Game
          </a> */}

          {/* <a
            disabled={props.disabled}
            className={"do do-circular do-primary responsive responsive-mobile no-margin "}
            onClick={props.onCreateGame}
          >
            <i className="fas fa-trophy" />
          </a> */}
        </div>
      ) : null}
    </div>
  );
}

export default PublicationListTitle;
