import React from "react";
import { NavLink } from "react-router-dom";

function Presentation() {
  return (
    <div className="App-presentation">
      <div class="text-center logo-holder">
        <i className="fas fa-smile-wink" />
      </div>
      <h3>Welcome to <b>Crazybook</b>!</h3>
      <p className="text-box">
          Laboratoria <b>news</b> application
      </p>
      <NavLink to="/auth" className="do do-primary">
        <span>Login to post</span>
      </NavLink>
    </div>
  );
}

export default Presentation;
