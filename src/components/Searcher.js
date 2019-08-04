import React from "react";

class Searcher extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  state = {
    isActive: false,
    isScopeFilterActive: false,
    term: "",
    scopeFilter: null,
    scopeFilterTypes: {
      FRIENDS: 1,
      PUBLIC: 2
    }
  };
  suggestSearching = () => {
    this.setState({
      isActive: true
    });
  };

  finishSuggestion = () => {
    console.log("finishing focus");
    this.setState({
      isActive: false
    });
  };

  goSearch = e => {
    e.preventDefault();
    this.props.onSearch(this.state.term);
  };

  onTyping = e => {
    this.setState({
      term: e.target.value
    });
  };

  toggleScopeFilter = () => {
    this.setState({ isScopeFilterActive: !this.state.isScopeFilterActive });
    if (this.state.isScopeFilterActive) {
      // clear scope filter
      this.setState({ scopeFilter: null });
      if (!this.props.onClearScope) {
        return;
      }
      this.props.onClearScope();
    }
  };

  setScopeFilter = scope => {
    this.setState({
      scopeFilter: scope
    });

    if (!this.props.onSearch) {
      return;
    }
    this.props.onSearch(this.state.term, scope);
  };

  getFilterContainer = () => {
    let disabledClassName = this.props.disabled ? " disabled" : "";
    let friendsClassName =
      this.state.scopeFilter === this.state.scopeFilterTypes.FRIENDS
        ? "do do-warning"
        : "do do-secondary";
    let publicClassName =
      this.state.scopeFilter === this.state.scopeFilterTypes.PUBLIC
        ? "do do-warning"
        : "do do-secondary";

    return (
      <div className="order-info">
        <div className="keypad keypad-inline-block keypad-bottom-radius keypad-secondary">
          <a
            className={friendsClassName + disabledClassName}
            onClick={() => {
              this.setScopeFilter(this.state.scopeFilterTypes.FRIENDS);
            }}
          >
            <i className="fas fa-lock icon-friends" />
            Friends
          </a>
          <a
            className={publicClassName + disabledClassName}
            onClick={() => {
              this.setScopeFilter(this.state.scopeFilterTypes.PUBLIC);
            }}
          >
            <i className="fas fa-unlock icon-public" />
            Public
          </a>
        </div>
      </div>
    );
  };

  clearTerm = () => {
    this.setState({
      term: ""
    });
    this.textInput.current.focus();
    if (!this.props.onClearTerm) {
      return;
    }
    this.props.onClearTerm();
  };

  isAppliedTerm = () => {
    return this.state.term === this.props.appliedTerm;
  };

  render() {
    let placeholderText = !this.state.isActive ? "Search publications" : "";
    let searcherClassName = this.state.isActive
      ? "App-searcher active"
      : "App-searcher";

    if (this.state.isScopeFilterActive || this.isAppliedTerm()) {
      searcherClassName += " searching";
    }

    let disabledClassName = this.props.disabled ? " disabled" : "";

    let filterScopeTogglerClassName = this.state.isScopeFilterActive
      ? "filter-toggler do do-flat do-circular do-primary do-none"
      : "filter-toggler do do-flat do-circular do-none";

    let filterContainer = this.state.isScopeFilterActive
      ? this.getFilterContainer()
      : null;

    return (
      <div>
        <div className={searcherClassName + disabledClassName}>
          <form action="/searcher" method="get" onSubmit={this.goSearch}>
            <input
              ref={this.textInput}
              onFocus={this.suggestSearching}
              onBlur={this.finishSuggestion}
              onChange={this.onTyping}
              disabled={this.props.disabled}
              value={this.state.term}
              type="text"
              placeholder={placeholderText}
            />
            {this.isAppliedTerm() ? (
              <button
                type="reset"
                onClick={this.clearTerm}
                className={
                  "do do-primary do-flat do-circular do-none" + disabledClassName
                }
              >
                <i className="fas fa-times" />
              </button>
            ) : (
              <button
                type="submit"
                className={"do do-flat do-circular do-none" + disabledClassName}
              >
                <i className="fas fa-search" />
              </button>
            )}
          </form>
          <a
            className={filterScopeTogglerClassName + disabledClassName}
            onClick={this.toggleScopeFilter}
          >
            <i className="fas fa-filter" />
          </a>
        </div>
        {filterContainer}
      </div>
    );
  }
}

export default Searcher;
