import React from "react";

class Searcher extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  state = {
    isActive: false,
    isFilterActive: false,
    term: "",
    scopeFilter: -1,
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

  toggleFilter = () => {
    this.setState({ isFilterActive: !this.state.isFilterActive });
    // clear scope filter
    if (this.state.isFilterActive) {
      this.setState({ scopeFilter: -1 });
      if (!this.props.onClose) {
        return;
      }
      this.props.onClose();
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
        <div className="keypad left">
          <a onClick={this.toggleFilter} className={"do " + disabledClassName}>
            <i className="fas fa-times" />
            Close
          </a>
        </div>
        <div className="keypad right">
          <a
            className={friendsClassName + disabledClassName}
            onClick={() => {
              this.setScopeFilter(this.state.scopeFilterTypes.FRIENDS);
            }}
          >
            <i className="fas fa-user-lock" />
            Friends
          </a>
          <a
            className={publicClassName + disabledClassName}
            onClick={() => {
              this.setScopeFilter(this.state.scopeFilterTypes.PUBLIC);
            }}
          >
            <i className="fas fa-fire" />
            Public
          </a>
        </div>
      </div>
    );
  };

  clearTerm = () => {
    setTimeout(() => {
      this.setState({
        term: ""
      });
      this.textInput.current.focus();
      console.log('this.textInput', this.textInput);
    }, 99);
    if (!this.props.onClose) {
      return;
    }
    this.props.onClose();
  };

  render() {
    let placeholderText = !this.state.isActive ? "Search publications" : "";
    let searcherClassName = this.state.isActive
      ? "App-searcher active"
      : "App-searcher";

    let disabledClassName = this.props.disabled ? " disabled" : "";

    let filterTogglerClassName = this.state.isFilterActive
      ? "filter-toggler do do-flat do-circular do-primary"
      : "filter-toggler do do-flat do-circular";

    let filterContainer = this.state.isFilterActive
      ? this.getFilterContainer()
      : null;

    return (
      <div className={searcherClassName}>
        <form action="/searcher" method="get" onSubmit={this.goSearch}>
          <input
            ref={this.textInput}
            onFocus={this.suggestSearching}
            onBlur={this.finishSuggestion}
            onChange={this.onTyping}
            disabled={this.props.disabled}
            type="text"
            placeholder={placeholderText}
          />
          {this.state.term === "" ? (
            <button
              type="submit"
              className={"do do-flat do-circular" + disabledClassName}
            >
              <i className="fas fa-search" />
            </button>
          ) : (
            <button
              type="reset"
              onClick={this.clearTerm}
              className={
                "do do-primary do-flat do-circular" + disabledClassName
              }
            >
              <i className="fas fa-times" />
            </button>
          )}
        </form>
        <a
          className={filterTogglerClassName + disabledClassName}
          onClick={this.toggleFilter}
        >
          <i className="fas fa-filter" />
        </a>
        {filterContainer}
      </div>
    );
  }
}

export default Searcher;
