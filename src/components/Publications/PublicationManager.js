import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import PublicationList from './PublicationList';
import PublicationListTitle from './PublicationListTitle';

class PublicationManager extends React.Component {

  state = {
    newPublication: null,
    publication: null,
    removingPublication: null,
    publications: []
  };

  componentDidMount (term) {
    this.getPublications();
  };

  goFirstPage = (e) => {
    e.preventDefault();
  };

  goPreviousPage = (e) => {
    e.preventDefault();
    console.log('@todo: publications previous page');
  };

  goNextPage = (e) => {
    e.preventDefault();
    console.log('@todo: publications next page');
  };

  goLastPage = (e) => {
    e.preventDefault();
    console.log('@todo: publications last page', e);
  };

  getPublications = () => {
    this.props.onWait(true);
    let url = '/api/publications';
    if (this.props.author) {
      url = '/api/author/' + this.props.author.id + '/publications';
    };
    axios.get(url)
      .then(response => {
        this.props.onStopWait();
        this.setState({
          publications: response.data.publications
        });
      })
      .catch(error => {
        this.props.onStopWait();
        console.error('Application error: ', error);
      });
  };

  createPublication = (publication) => {
    console.log('creating publication', publication);
    this.setState({
      newPublication: {
        id: null,
        title: '',
        body: ''
      }
    });
    if (this.props.onCreatePublication) {
      this.props.onCreatePublication();
    }
  };

  editPublication = (publication) => {
    console.log('editing publication', publication);
    this.setState({
      editingPublication: publication
    });
  };

  startRemoving = (publication) => {
    console.log('removing publication', publication);
    this.setState({
      removingPublication: publication
    });
  };

  removePublication = (publication) => {
    let url = '/api/publication/' + publication.id;

    this.props.onWait("Removing publication...");
    axios.delete(url)
      .then(response => {
        this.props.onStopWait();
        this.cancelRemoving();
        this.getPublications();
        setTimeout(() => {
          let messageType = response.data.status ? 'info' : 'error';
          this.props.onNotify(response.data.message, messageType);
        }, 300);
      })
      .catch( error => {
        this.props.onStopWait();
        this.cancelRemoving();
        this.props.onNotify(error.response.data.message, 'error');
      });
  };

  cancelRemoving = () => {
    this.setState({
      removingPublication: null
    });
  };

  onSavePublication = (publication) => {
    console.log('Saved publication', publication);
    this.getPublications();
    this.cancelPublicationForm();
  };

  cancelPublicationForm = () => {
    this.setState({
      newPublication: null,
      editingPublication: null
    });
    if (this.props.onCancelPublicationForm) {
      this.props.onCancelPublicationForm();
    }
  };

  orderPublications = (field, orientation) => {
    console.log('field?', field);
    console.log('orientation?', orientation);
  };

  render () {
    // let searcher = null;
    let publicationListTitle = null;
    let publicationCount = this.state.publications ? this.state.publications.length : 0;
    
    if (!this.state.newPublication && !this.state.editingPublication) {
      // searcher = <Searcher 
      //   onSearch={this.getPublications}
      //   onOrder={this.orderPublications}
      //   />;
      publicationListTitle = (
        <PublicationListTitle 
          title="Publications"
          results={publicationCount}
          publications={this.state.publications}
          onCreatePublication={this.createPublication} />
      );
    }

    return (
      <div>
        {/* {searcher} */}
        {publicationListTitle}
        <PublicationList
          author={this.props.author}
          newPublication={this.state.newPublication}
          editingPublication={this.state.editingPublication}
          removingPublication={this.state.removingPublication}
          publications={this.state.publications}
          disableItems={this.state.newPublication}
          onNotify={this.props.onNotify}
          onFirst={this.goFirstPage}
          onPrevious={this.goPreviousPage}
          onNext={this.goNextPage}
          onLast={this.goLastPage}
          onSave={this.onSavePublication}
          onCancel={this.cancelPublicationForm}
          onEdit={this.editPublication}
          onStartRemoving={this.startRemoving}
          onConfirmRemoving={this.removePublication}
          onCancelRemoving={this.cancelRemoving}
          onWait={this.props.onWait}
          onStopWait={this.props.onStopWait}
          />
      </div>
    );
  }
}

export default withRouter(PublicationManager);