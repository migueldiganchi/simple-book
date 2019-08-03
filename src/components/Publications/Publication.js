import React from 'react';
import { Link } from 'react-router-dom';

import Toolbar from './../../components/Toolbar';
import PublicationForm from './PublicationForm';
import axios from 'axios';

class Publication extends React.Component {
  state = {
    editingPublication: null,
    removingPublication: null,
    publication: null,
    author: null
  };

  componentDidMount() {
    let id = this.props.match.params.id;
    this.getPublication(id);
  };

  getAuthor = (authorId) => {
    axios.get('/api/author/' + authorId)
      .then(response => {
        let author = response.data.author;
        this.setState({author: author});
      })
      .catch(error => {
        this.props.onNotify(error.response.data.message, 'error');
      })
  };

  getPublication = (id) => {
    axios.get('/api/publication/' + id)
      .then(response => {
        let publication = response.data.publication;
        console.log('response', publication);
        this.setState({publication: publication});
        if (publication.author_id) {
          this.getAuthor(publication.author_id);
        }
        this.props.onNotify('You are in publication nº ' + publication.id, 'success');
      })
      .catch(error => {
        this.props.onNotify(error.response.data.message, 'error');
      });
  };

  editPublication = () => {
    this.setState({ editingPublication: this.state.publication });
  };

  startRemoving = () => {
    this.setState({ removingPublication: this.state.publication });
  };

  cancelRemoving = () => {
    this.setState({ removingPublication: null });
  };

  confirmRemoving = () => {
    console.log('@todo: do effective removing');
    setTimeout(() => {
      this.props.onNotify('Publication removed successfully', '', 3000, () => {
        this.props.history.push({ pathname: '/' });
      });
    }, 3000);
  };

  getPublicationInfo = () => {
    if (!this.state.publication) {
      return;
    }

    let infoBlockClassName = this.state.removingPublication ?
      'info-block removing' :
      'info-block';

    let publicationBodyText = this.state.removingPublication ?
      <div className="confirmer">
        <h4>Removing: Are you sure?</h4>
      </div> : null;

    let publicationBody = (
      <div>
        <h2>{this.state.publication.title}</h2>
        <p>{this.state.publication.body}</p>
        <p>{this.state.publication.date_time}</p>
      </div>
    );

    let publicationBodyActions = this.state.removingPublication ?
      <div className="confirmer">
        <div className="keypad">
          <a className="do"
            disabled={this.state.waiting}
            onClick={this.cancelRemoving}>
            <i className="fas fa-ban" />
            Cancel
          </a>
          <a className="do do-warning"
            disabled={this.state.waiting}
            onClick={this.confirmRemoving}>
            <i className="fas fa-eraser" />
            {this.state.waiting ? 'Removing...' : 'Remove'}
          </a>
        </div>
      </div> : null;

    return <div className={infoBlockClassName}>
      {/* Confirmer text */}
      {publicationBodyText}
      {/* Publication body information */}
      {publicationBody}
      {/* Publication body confirmer actions */}
      {publicationBodyActions}
    </div>;
  };

  cancelPublicationForm = () => {
    this.setState({ editingPublication: null });
  };

  onSavePublication = (publication) => {
    console.log('Saved publication', publication);
    this.cancelPublicationForm();
    this.getPublication(publication.id);
  };

  render() {
    return (
      <div className="App-publication">
        {this.state.editingPublication ?
          <PublicationForm
            publication={this.state.editingPublication}
            onWait={this.props.onWait}
            onStopWait={this.props.onStopWait}
            onSave={this.onSavePublication}
            onCancel={this.cancelPublicationForm}
            onNotify={this.props.onNotify}
          /> :
          this.getPublicationInfo()}
        {this.state.author ?
          <div className="publication-author">
            by <Link to={'/author/' + this.state.author.id}>
              {this.state.author.name}
            </Link>
          </div> : null}
        <Toolbar
          isAuthorManagerVisible={this.props.isAuthorManagerVisible}
          showControls={!this.state.editingPublication && !this.state.removingPublication}
          onEdit={this.editPublication}
          onStartRemoving={this.startRemoving} />
      </div>
    )
  }
}

export default Publication;