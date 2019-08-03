import React from "react";
import { withRouter, NavLink, matchPath } from "react-router-dom";

function Header(props) {
  const isAuthActive = !!matchPath(props.location.pathname, "/auth");
  const isHomeActive = !!matchPath(props.location.pathname, {
    path: "/",
    exact: true
  });

  return (
    <header className="App-header">
      <div className="App-title m-0 pt-1 clearfix">
        <NavLink
          to="/auth"
          activeClassName="active"
          className={
            "do do-primary do-circular float-left " +
            (isAuthActive ? "disabled" : "")
          }
        >
          <i className="fas fa-key" />
        </NavLink>
        <h5 className="App-title-text mt-1">
          <NavLink to="/" activeClassName={isHomeActive ? "" : "text-underline"}>
            <span>{props.title}</span>
          </NavLink>
        </h5>
        <NavLink
          to="/"
          className={
            "do do-primary do-circular float-right " +
            (isHomeActive ? "disabled" : "")
          }
        >
          <i className="fas fa-home" />
        </NavLink>
      </div>
      <div>{props.children}</div>
    </header>
  );
}

export default withRouter(Header);
