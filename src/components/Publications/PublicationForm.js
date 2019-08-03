import React, { Component } from 'react';
import axios from 'axios';

class PublicationForm extends Component {

  constructor(props) {
    super(props);
    // load authors is case there is not an author specified
    this.loadAuthors();
  }

  state = {
    title: '',
    body: '',
    date_time: '',
    authorId: null,
    authors: []
  };

  componentDidMount() {
    this.setState({
      id: this.props.publication.id,
      title: this.props.publication.title,
      body: this.props.publication.body,
      authorId: this.props.author ? 
        this.props.author.id : 
        this.props.publication.author_id,
      date_time: '2012-12-12 00:00:00',
      titleClassName: 'field',
      bodyClassName: 'field',
      dateTimeClassName: 'field',
      authorClassName: 'field',
    });
  };

  onSubmitPublication = (e) => {
    e.preventDefault();
    let publication = {
      id: this.props.publication.id,
      title: this.state.title,
      body: this.state.body,
      author_id: this.state.authorId
    };
    if (!this.validate(publication)) {
      return;
    }

    this.savePublication(publication);

    if (this.props.onSave) {
      this.props.onSave(publication);
    } 
  };

  savePublication = (publication) => {
    let isNewPublication = !publication.id;
    let method = isNewPublication ? axios.post : axios.put;
    let url = isNewPublication 
      ? '/api/publication'
      : '/api/publication/' + publication.id;
    let loadingMessage = isNewPublication ? 
      'Creating publication...' : 
      'Saving publication...';
    
    // go server to save publication
    this.props.onWait(loadingMessage);
    method(url, publication)
      .then((response) => {
        this.props.onStopWait();
        setTimeout(() => {
          let messageType = response.data.status 
            ? (isNewPublication ? 'success' : 'info') 
            : 'error';
          let message = response.data.message;
          this.props.onNotify(message, messageType);

          if (this.props.onSave) {
            this.props.onSave(publication);
          }
        }, 300);
      })
      .catch(error => {
        console.log('error.response?', error.response);
        this.props.onNotify(error.response.message, 'error');
      });
  };

  validate = (publication) => {
    let error = false;
    
    if (publication.title === '') {
      error = true;
      this.setState({ titleClassName: 'field error' });
    } else {
      this.setState({ titleClassName: 'field' });
    }

    if (publication.body === '') {
      error = true;
      this.setState({ bodyClassName: 'field error' })
    } else {
      this.setState({ bodyClassName: 'field' });
    }

    if (publication.date_time === '') {
      error = true;
      this.setState({ dateTimeClassName: 'field error' });
    } else {
      this.setState({ dateTimeClassName: 'field' });
    }

    if (!this.state.authorId || this.state.authorId < 1) {
      error = true;
      this.setState({ authorClassName: 'field error' });
    } else {
      this.setState({ authorClassName: 'field' });
    }
    
    if (error) {
      this.props.onNotify('Ups, check your information please', 'error');
    }

    return !error;
  };

  typingTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  typingBody = (e) => {
    this.setState({ body: e.target.value });
  };

  typingDateTime = (e) => {
    this.setState({ date_time: e.target.value });
  };

  changingAuthor = (e) => {
    console.log('changingAuthor: e', e.target.value);
    this.setState({authorId: e.target.value});
  };

  loadAuthors = () => {
    axios.get('/api/authors')
      .then(response => {
        const authors = response.data.authors;
        this.setState({ authors: authors });
      })
      .catch(error => {
        this.props.onNotify('There was a problem loading errors', error);
      });
  };

  getAuthorSelectorControl = () => {
    let disabled = false;
    let authorId = "";
    
    if (this.props.author) {
      disabled = true;
      authorId = this.props.author.id;
    } else if (this.props.publication.author_id) {
      authorId = this.props.publication.author_id;
    }

    return (
      <div className={this.state.authorClassName}>
        <select 
          disabled={disabled} 
          value={authorId} 
          onChange={this.changingAuthor}>
          <option value={0}>Select an author...</option>
          {this.state.authors.map((author) => {
            return (
              <option 
                key={author.id} 
                value={author.id}>
                {author.name}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  render() {
    let formTitle = <h4>{this.props.publication.id ? 'Editing' : 'New'} Publication</h4>
    let authorControl = this.getAuthorSelectorControl();

    return (
      <div className="form-container">
        {formTitle}
        <form action="/publications"
          method="post"
          className="form"
          onSubmit={this.onSubmitPublication}>
          <div className="form-body">
            <div className={this.state.titleClassName}>
              <input type="text"
                autoFocus
                onChange={this.typingTitle}
                placeholder="Title"
                value={this.state.title} />
            </div>
            <div className={this.state.bodyClassName}>
              <textarea type="text"
                rows="3"
                onChange={this.typingBody}
                placeholder="Publication body"
                value={this.state.body}></textarea>
            </div>
            <div className={this.state.dateTimeClassName}>
              <input type="text"
                onChange={this.typingDateTime}
                placeholder="Date and time of publication"
                value={this.state.date_time} />
            </div>
            {authorControl}
          </div>

          <div className="keypad">
            <button type="button"
              className="do"
              onClick={this.props.onCancel}>
              <i className="fas fa-ban" />
              Cancel
              </button>
            <button type="submit"
              className="do do-primary">
              <i className="fas fa-hdd" />
              Save
              </button>
          </div>
        </form>
      </div>
    );
  }
}

export default PublicationForm;