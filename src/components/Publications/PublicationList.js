import React from "react";

import PublicationListItem from "./PublicationListItem";
import PublicationForm from "./PublicationForm";
import MemoryGame from "./../Games/MemoryCards";

function PublicationList(props) {
  const renderList = () => {
    if (props.publications && props.publications.length > 0) {
      return props.publications.map(publication => {
        return isEditing(publication) ? (
          <PublicationForm
            key={publication.id}
            publication={props.editingPublication}
            onCancel={props.onCancel}
            onNotify={props.onNotify}
            onSave={props.onSave}
            author={props.author}
            onWait={props.onWait}
            onStopWait={props.onStopWait}
          />
        ) : (
          <PublicationListItem
            key={publication.id}
            publication={publication}
            isAuthenticated={props.isAuthenticated}
            isRemoving={isRemoving(publication)}
            isDisabled={isDisabled(publication)}
            onEdit={props.onEdit}
            onStartRemoving={props.onStartRemoving}
            onConfirmRemoving={props.onConfirmRemoving}
            onCancelRemoving={props.onCancelRemoving}
            onOpen={goPublication}
          />
        );
      });
    } else if (!(props.disableItems || props.isEditing || props.isRemoving)) {
      return (
        <div className="pa-5 mt-5">
          <div className="mt-5 pt-5 text-muted">
            <b>Nothing here</b>
          </div>
        </div>
      );
    }
  };

  const isEditing = publication => {
    return (
      props.editingPublication && props.editingPublication.id === publication.id
    );
  };

  const isRemoving = publication => {
    return (
      props.removingPublication &&
      props.removingPublication.id === publication.id
    );
  };

  const isDisabled = publication => {
    return (
      props.disableItems ||
      (props.editingPublication &&
        props.editingPublication.id !== publication.id) ||
      (props.removingPublication &&
        props.removingPublication.id !== publication.id)
    );
  };

  const goPublication = publication => {
    props.history.push({
      pathname: "/publication/" + publication.id
    });
  };

  let newForm = null;
  let newGame = null;

  if (props.newPublication) {
    newForm = (
      <PublicationForm
        publication={props.newPublication}
        onCancel={props.onCancel}
        onSave={props.onSave}
        onNotify={props.onNotify}
        author={props.author}
        onWait={props.onWait}
        onStopWait={props.onStopWait}
      />
    );
  }

  if (props.newGame) {
    newGame = <MemoryGame 
      game={props.newGame}
      onWait={props.onWait}
      onNotify={props.onNotify}
      onStopWait={props.onStopWait}      
      onCancelMemory={props.onCancelMemory}/>;
  }

  return (
    <div className="list-container">
      {props.isAuthenticated() ? newForm : null}
      {props.isAuthenticated() ? newGame : null}
      <div className="publication-list">{renderList()}</div>
    </div>
  );
}

export default PublicationList;
