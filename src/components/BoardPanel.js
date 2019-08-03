import React from 'react';

function BoardPanel (props) {
  return(
    <div className="App-board-panel">
      <div className="panel-body">
        {props.children}
      </div>
    </div>
  );
};

export default BoardPanel;