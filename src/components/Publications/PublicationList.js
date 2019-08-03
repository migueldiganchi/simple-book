import React from 'react';

import PublicationListItem from './PublicationListItem';
import PublicationForm from './PublicationForm';
import Paginator from './../Paginator';

function PublicationList (props) {
  
  const renderList = () => {
    if (props.publications) {
      return props.publications.map((publication) => {
        return isEditing(publication) ? 
          <PublicationForm 
            key={publication.id}
            publication={props.editingPublication}
            onCancel={props.onCancel}
            onNotify={props.onNotify}
            onSave={props.onSave}
            author={props.author}
            onWait={props.onWait}
            onStopWait={props.onStopWait}
            /> : 
          <PublicationListItem 
            key={publication.id}
            publication={publication}
            isRemoving={isRemoving(publication)}
            isDisabled={isDisabled(publication)}
            onEdit={props.onEdit}
            onStartRemoving={props.onStartRemoving}
            onConfirmRemoving={props.onConfirmRemoving}
            onCancelRemoving={props.onCancelRemoving}
            onOpen={goPublication} />
      })
    } else {
      return null;
    }
  };
  
  const isEditing = (publication) => {
    return props.editingPublication && 
      props.editingPublication.id === publication.id;
  };

  const isRemoving = (publication) => {
    return props.removingPublication && 
      props.removingPublication.id === publication.id
  };

  const isDisabled = (publication) => {
    return props.disableItems || 
     (props.editingPublication && props.editingPublication.id !== publication.id) || 
     (props.removingPublication && props.removingPublication.id !== publication.id)
  };

  const goPublication = (publication) => {
    console.log('go publication?', publication);
    console.log(props);
    props.history.push({
      pathname: '/publication/' + publication.id
    });
  };

  let newForm = null;
  let paginator = null;

  if (props.newPublication) {
    newForm = <PublicationForm 
      publication={props.newPublication}
      onCancel={props.onCancel}
      onSave={props.onSave}
      onNotify={props.onNotify}
      author={props.author}
      onWait={props.onWait}
      onStopWait={props.onStopWait}
      />
  }

  if (!props.newPublication && !props.editingPublication) {
    paginator = <Paginator 
      onFirst={props.onFirst}
      onPrevious={props.onPrevious}
      onNext={props.onNext}
      onLast={props.onLast} 
      />
  }

  return (
    <div className="list-container">
      {newForm}
      <div className="publication-list">
        {/* {props.publications.map((publication) => {
          return isEditing(publication) ? 
            <PublicationForm 
              key={publication.id}
              publication={props.editingPublication}
              onCancel={props.onCancel}
              onNotify={props.onNotify}
              onSave={props.onSave}
              author={props.author}
              onWait={props.onWait}
              onStopWait={props.onStopWait}
              /> : 
            <PublicationListItem 
              key={publication.id}
              publication={publication}
              isRemoving={isRemoving(publication)}
              isDisabled={isDisabled(publication)}
              onEdit={props.onEdit}
              onStartRemoving={props.onStartRemoving}
              onConfirmRemoving={props.onConfirmRemoving}
              onCancelRemoving={props.onCancelRemoving}
              onOpen={goPublication} />
        })} */}
        { renderList() }
      </div>
      {paginator}
    </div>
  );
};

export default PublicationList;