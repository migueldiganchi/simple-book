import React from 'react';

function Board (props) {
  return (
    <div className="App-board">
        {props.children}
    </div>
  );
};

export default Board;