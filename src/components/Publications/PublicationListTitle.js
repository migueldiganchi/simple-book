import React from 'react';

function PublicationListTitle (props) {
  return (
    <div className="keypad board-panel-keypad">
      <div className="text">
        <span>{props.title}</span>
        <small>{props.results} results</small>
      </div>
      <a className="do do-success"
        onClick={props.onCreatePublication}>
        <i className="fas fa-plus" />
        Publication
      </a>
    </div>
  );
}

export default PublicationListTitle;