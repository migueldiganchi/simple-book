import React from "react";

function Validation(props) {
  return (
    <div className="validation text-right px-2">
      {props.validationList.map(validation => {
        return (
          <div className="validation-error">
            <b>{validation.message}</b>
          </div>
        );
      })}
    </div>
  );
}

export default Validation;
