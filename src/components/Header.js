import React from "react";
import { withRouter, NavLink, matchPath } from "react-router-dom";

function Header(props) {
  const isAuthActive = !!matchPath(props.location.pathname, "/auth");
  const isHomeActive = !!matchPath(props.location.pathname, {
    path: "/",
    exact: true
  });

  console.log("props.location.pathname", props.location.pathname);
  console.log("isHomeActive", isHomeActive);

  return (
    <header className="App-header">
      <div className="App-title m-0 pt-1 clearfix">
        <NavLink
          to="/auth"
          activeClassName="active"
          className={
            "do do-primary do-circular float-left " +
            (isAuthActive ? "active" : "")
          }
        >
          <i className="fas fa-key" />
        </NavLink>
        <h5 className="App-title-text mt-1">
          <NavLink to="/" activeClassName={isHomeActive ? "" : "text-muted"}>
            <span>{props.title}</span>
          </NavLink>
        </h5>
        <button type="submit" className="do do-primary do-circular float-right">
          <i className="fas fa-bars" />
        </button>
      </div>
      <div>{props.children}</div>
    </header>
  );
}

export default withRouter(Header);
