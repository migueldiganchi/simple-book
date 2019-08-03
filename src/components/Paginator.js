import React from 'react';

function Paginator (props) {
  return (
    <div className="paginator">
      <div className="keypad">
        <a href=""
          className="do do-primary do-circular"
          onClick={props.onFirst}>
          <i className="fas fa-angle-double-left" />
        </a>
        <a href=""
          className="do do-primary do-circular"
          onClick={props.onPrevious}>
          <i className="fas fa-angle-left" />
        </a>
        <div className="text">
          <b className="page">1</b> of <b className="total-pages">999</b>
        </div>
        <a href=""
          className="do do-primary do-circular"
          onClick={props.onNext}>
          <i className="fas fa-angle-right" />
        </a>
        <a href=""
          className="do do-primary do-circular"
          onClick={props.onLast}>
          <i className="fas fa-angle-double-right" />
        </a>
      </div>
    </div>
  );
}

export default Paginator;