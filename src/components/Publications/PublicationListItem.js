import React from "react";

function PublicationListItem(props) {
  const startRemovingHandler = e => {
    e.stopPropagation();
    e.preventDefault();
    props.onStartRemoving(props.publication);
  };

  const confirmRemoving = e => {
    e.stopPropagation();
    e.preventDefault();
    props.onConfirmRemoving(props.publication);
  };

  const cancelRemoving = e => {
    e.stopPropagation();
    e.preventDefault();
    props.onCancelRemoving(props.publication);
  };

  const editHander = e => {
    e.stopPropagation();
    e.preventDefault();
    props.onEdit(props.publication);
  };

  let listItemClassName = "list-item";
  let confirmation = null;
  let keypad = null;

  if (props.isRemoving) {
    listItemClassName = "list-item removing";
    confirmation = (
      <div className="keypad confirmation fixed bg-tr">
        <h4>Are you sure?</h4>
      </div>
    );
    keypad = (
      <div>
        <div className="keypad fixed responsive responsive-desktop">
          <button type="button" className="do" onClick={cancelRemoving}>
            <i className="fas fa-ban" />
            Cancel
          </button>
          <a className="do do-danger" onClick={confirmRemoving}>
            <i className="fas fa-trash" />
            Remove
          </a>
        </div>
        <div className="keypad fixed responsive responsive-mobile">
          <button
            type="button"
            className="do do-circular"
            onClick={cancelRemoving}
          >
            <i className="fas fa-ban" />
          </button>
          <a className="do do-danger" onClick={confirmRemoving}>
            <i className="fas fa-trash" />
            Yes
          </a>
        </div>
      </div>
    );
  } else if (props.isDisabled) {
    listItemClassName = "list-item disabled";
  } else {
    keypad = (
      <div className="keypad">
        <a className="do do-circular do-danger" onClick={startRemovingHandler}>
          <i className="fas fa-trash" />
        </a>
        <a className="do do-circular do-primary" onClick={editHander}>
          <i className="fas fa-pencil-alt" />
        </a>
      </div>
    );
  }

  return (
    <div className={listItemClassName}>
      {confirmation}
      <h3>{props.publication.title}</h3>
      <p>
        <span>{props.publication.body}</span>
      </p>
      <small>{props.publication.date_time}</small>
      {keypad}
      {props.publication.scope === 1 ? (
        <i className="icon fas fa-users icon-friends" />
      ) : (
        <i className="icon fas fa-lock-open icon-public" />
      )}
    </div>
  );
}

export default PublicationListItem;
