import React from "react";
import axios from "./../../connection/axios-app";
import { withRouter } from "react-router-dom";

import Searcher from "./../Searcher";
import PublicationList from "./PublicationList";
import PublicationListTitle from "./PublicationListTitle";

import Presentation from "./../Presentation";

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
    if (!this.props.isAuthenticated()) {
      return;
    }
    this.getPublications(this.state.termFilter, this.state.scopeFilter);
  }

  goFirstPage = e => {
    e.preventDefault();
  };

  goPreviousPage = e => {
    e.preventDefault();
  };

  goNextPage = e => {
    e.preventDefault();
  };

  goLastPage = e => {
    e.preventDefault();
  };

  getPublications = (term, scope) => {
    this.props.onWait("Loading publications...");
    setTimeout(() => {
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
    }, 1100);
  };

  filterPublications(publications, term, scope) {
    let results = [...publications.reverse()];
    let currentTermFilter = null;
    let currentScopeFilter = null;

    if (term) {
      currentTermFilter = term;
      results = [
        ...results.filter(publication => {
          return publication.body.toLowerCase().includes(term.toLowerCase());
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
    if (!this.props.isAuthenticated()) {
      this.props.onNotify("Please authenticate", "info");
      return;
    }

    this.setState({
      newPublication: {
        id: null,
        body: "",
        scope: null
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
      .then(() => {
        this.props.onStopWait();
        this.cancelRemoving();
        this.getPublications(this.state.termFilter, this.state.scopeFilter);
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
    this.getPublications(this.state.termFilter, this.state.scopeFilter);
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

  clearScopeFilter = () => {
    this.setState({
      scopeFilter: null
    });
    setTimeout(() => {
      this.getPublications(this.state.termFilter, null);
    }, 33);
  };

  clearTermFilter = () => {
    this.setState({
      termFilter: null
    });
    setTimeout(() => {
      this.getPublications(null, this.state.scopeFilter);
    }, 33);
  };

  render() {
    let searcher = null;
    let workingTitle = null;
    let publicationListTitle = null;
    let publicationListTitleTextScope = "All publications";
    let publicationListTitleTextTerm = "";
    let publicationCount = this.state.publications
      ? this.state.publications.length
      : 0;

    if (this.state.termFilter) {
      publicationListTitleTextTerm = `${this.state.termFilter}`;
    }

    if (this.state.scopeFilter) {
      switch (this.state.scopeFilter) {
        case this.state.scopeFilterTypes.FRIENDS:
          publicationListTitleTextScope = "Only friends";
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
          appliedTerm={this.state.termFilter}
          disabled={
            this.state.removingPublication ||
            this.state.newPublication ||
            this.state.editingPublication
          }
          onSearch={this.getPublications}
          onClearScope={this.clearScopeFilter}
          onClearTerm={this.clearTermFilter}
        />
      </div>
    );

    if (this.state.removingPublication) {
      workingTitle = "Removing publication";
    } else if (this.state.editingPublication) {
      workingTitle = "Editing publication";
    } else if (this.state.newPublication) {
      workingTitle = "New publication";
    }

    publicationListTitle = workingTitle ? (
      <PublicationListTitle
        isAuthenticated={this.props.isAuthenticated}
        featured={true}
        disabled={true}
        title={workingTitle}
      />
    ) : (
      <PublicationListTitle
        disabled={
          this.state.removingPublication ||
          this.state.newPublication ||
          this.state.editingPublication
        }
        isAuthenticated={this.props.isAuthenticated}
        title={publicationListTitleTextScope}
        results={publicationCount}
        resultsFilterTermText={publicationListTitleTextTerm}
        publications={this.state.publications}
        onCreatePublication={this.createPublication}
      />
    );

    return (
      <div className="pb-4">
        {!this.props.isAuthenticated() ? <Presentation /> : null}
        {searcher}
        {publicationListTitle}
        <PublicationList
          author={this.props.author}
          newPublication={this.state.newPublication}
          isAuthenticated={this.props.isAuthenticated}
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
