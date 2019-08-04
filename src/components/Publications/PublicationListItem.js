import React from "react";

function PublicationListItem(props) {
  const startRemovingHandler = e => {
    e.preventDefault();
    props.onStartRemoving(props.publication);
    e.stopPropagation();
  };

  const confirmRemoving = e => {
    e.preventDefault();
    props.onConfirmRemoving(props.publication);
    e.stopPropagation();
  };

  const cancelRemoving = e => {
    e.preventDefault();
    props.onCancelRemoving(props.publication);
    e.stopPropagation();
  };

  const editHander = e => {
    e.preventDefault();
    props.onEdit(props.publication);
    e.stopPropagation();
  };

  let listItemClassName = "list-item";
  let confirmation = null;
  let keypad = null;

  if (props.isRemoving) {
    listItemClassName = "list-item removing";
    confirmation = (
      <div className="keypad confirmation fixed">
        <h4>Removing: Are you sure?</h4>
      </div>
    );
    keypad = (
      <div className="keypad fixed">
        <button type="button" className="do" onClick={cancelRemoving}>
          <i className="fas fa-ban" />
          Cancel
        </button>
        <a className="do do-warning" onClick={confirmRemoving}>
          <i className="fas fa-eraser" />
          Remove
        </a>
      </div>
    );
  } else if (props.isDisabled) {
    listItemClassName = "list-item disabled";
  } else {
    keypad = (
      <div className="keypad">
        <a className="do do-circular do-danger" onClick={startRemovingHandler}>
          <i className="fas fa-eraser" />
        </a>
        <a className="do do-circular do-primary" onClick={editHander}>
          <i className="fas fa-pencil-alt" />
        </a>
      </div>
    );
  }

  return (
    <div
      className={listItemClassName}
      onClick={() => props.onOpen(props.publication)}
    >
      {confirmation}
      <h3>{props.publication.title}</h3>
      <p>
        <span>{props.publication.body}</span>
      </p>
      <small>{props.publication.date_time}</small>
      {keypad}
      {props.publication.scope === 1 ? (
        <i className="icon fas fa-user-lock" />
      ) : (
        <i className="icon fas fa-fire" />
      )}
    </div>
  );
}

export default PublicationListItem;
