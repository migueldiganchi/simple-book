import React from "react";

import PublicationListItem from "./PublicationListItem";
import PublicationForm from "./PublicationForm";

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
          <div className="mt-5 pt-5">
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

  return (
    <div className="list-container">
      {newForm}
      <div className="publication-list">{renderList()}</div>
    </div>
  );
}

export default PublicationList;
