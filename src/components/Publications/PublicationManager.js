import React from "react";
import axios from "./../../connection/axios-app";
import { withRouter } from "react-router-dom";

import Searcher from "./../Searcher";
import PublicationList from "./PublicationList";
import PublicationListTitle from "./PublicationListTitle";

class PublicationManager extends React.Component {
  state = {
    newPublication: null,
    publication: null,
    removingPublication: null,
    publications: [],
    termFilter: null,
    scopeFilter: null,
    scopeFilterTypes: {
      FRIENDS: 1,
      PUBLIC: 2
    }
  };

  componentDidMount() {
    this.getPublications();
  }

  goFirstPage = e => {
    e.preventDefault();
  };

  goPreviousPage = e => {
    e.preventDefault();
    console.log("@todo: publications previous page");
  };

  goNextPage = e => {
    e.preventDefault();
    console.log("@todo: publications next page");
  };

  goLastPage = e => {
    e.preventDefault();
    console.log("@todo: publications last page", e);
  };

  getPublications = (term, scope) => {
    this.props.onWait("Loading publications...");
    axios
      .get("/publications.json")
      .then(response => {
        this.props.onStopWait();
        let object = null;
        let objects = response.data;
        let publications = [];

        for (let key in objects) {
          object = objects[key];
          publications.push({
            id: key,
            ...object
          });
        }

        this.filterPublications(publications, term, scope);
      })
      .catch(error => {
        this.props.onStopWait();
      });
  };

  filterPublications(publications, term, scope) {
    let results = [...publications.reverse()];
    let currentTermFilter = null;
    let currentScopeFilter = null;

    if (term) {
      currentTermFilter = term;
      results = [
        ...results.filter(publication => {
          return publication.body.includes(term);
        })
      ];
    }

    if (scope) {
      currentScopeFilter = scope;
      results = [
        ...results.filter(publication => {
          return publication.scope === scope;
        })
      ];
    }

    this.setState({
      publications: results,
      scopeFilter: currentScopeFilter,
      termFilter: currentTermFilter
    });
  }

  createPublication = publication => {
    this.setState({
      newPublication: {
        id: null,
        body: "",
        scope: -1
      }
    });
    if (this.props.onCreatePublication) {
      this.props.onCreatePublication(publication);
    }
  };

  editPublication = publication => {
    this.setState({
      editingPublication: publication
    });
  };

  startRemoving = publication => {
    this.setState({
      removingPublication: publication
    });
  };

  removePublication = publication => {
    let url = `/publications/${publication.id}.json`;

    this.props.onWait("Removing publication...");
    axios
      .delete(url)
      .then(response => {
        this.props.onStopWait();
        this.cancelRemoving();
        this.getPublications();
        setTimeout(() => {
          this.props.onNotify("Successfuly removed", "info");
        }, 300);
      })
      .catch(error => {
        this.props.onStopWait();
        this.cancelRemoving();
        this.props.onNotify("Oops! Something went wrong :(", "error");
      });
  };

  cancelRemoving = () => {
    this.setState({
      removingPublication: null
    });
  };

  onSavePublication = () => {
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

  render() {
    let searcher = null;
    let publicationListTitle = null;
    let publicationListTitleTextScope = "All";
    let publicationListTitleTextTerm = "";
    let publicationCount = this.state.publications
      ? this.state.publications.length
      : 0;

    if (this.state.termFilter) {
      publicationListTitleTextTerm = `(searching ${this.state.termFilter})`;
    }

    if (this.state.scopeFilter) {
      switch (this.state.scopeFilter) {
        case this.state.scopeFilterTypes.FRIENDS:
          publicationListTitleTextScope = "Friends";
          break;
        case this.state.scopeFilterTypes.PUBLIC:
          publicationListTitleTextScope = "Public";
          break;
        default:
          break;
      }
    }

    searcher = (
      <div className="mb-2">
        <Searcher
          onSearch={this.getPublications}
          onClose={this.getPublications}
          disabled={this.state.newPublication || this.state.editingPublication}
        />
      </div>
    );
    publicationListTitle = (
      <PublicationListTitle
        disabled={this.state.newPublication || this.state.editingPublication}
        title={`${publicationListTitleTextScope} publications`}
        results={publicationCount}
        resultsFilterTermText={publicationListTitleTextTerm}
        publications={this.state.publications}
        onCreatePublication={this.createPublication}
      />
    );

    return (
      <div>
        {searcher}
        {publicationListTitle}
        <PublicationList
          author={this.props.author}
          newPublication={this.state.newPublication}
          editingPublication={this.state.editingPublication}
          removingPublication={this.state.removingPublication}
          publications={this.state.publications}
          disableItems={this.state.newPublication}
          onCreatePublication={this.createPublication}
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
