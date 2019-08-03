import React, { Component } from "react";

class Searcher extends Component {
  state = {
    isActive: false,
    isFilterActive: false,
    term: ""
  };
  suggestSearching = () => {
    console.log("loading focus");
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
  };

  orderByDate = () => {
    console.log("order publication results by date time");
    this.props.onOrder("by-date", "asc");
  };

  orderByAuthorName = () => {
    console.log("order publication results by author name");
    this.props.onOrder("by-author-name", "desc");
  };

  getFilterContainer = () => {
    let disabledClassName = this.props.disabled ? " disabled" : "";

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
            className={"do do-primary " + disabledClassName}
            onClick={this.orderByDate}
          >
            <i className="fas fa-sort" />
            By date
          </a>
          <a
            className={"do do-primary " + disabledClassName}
            onClick={this.orderByAuthorName}
          >
            <i className="fas fa-sort" />
            By author
          </a>
        </div>
      </div>
    );
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
            onFocus={this.suggestSearching}
            onBlur={this.finishSuggestion}
            onChange={this.onTyping}
            disabled={this.props.disabled}
            type="text"
            placeholder={placeholderText}
          />
          <button className={"do do-flat do-circular " + disabledClassName}>
            <i className="fas fa-search" />
          </button>
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
