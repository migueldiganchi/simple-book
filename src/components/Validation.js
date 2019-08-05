import React from "react";

function Validation(props) {
  return props.validationList && props.validationList.length > 0 ? (
    <div className="validation text-right px-2">
      {props.validationList.map(validation => {
        return (
          <div className="validation-error">
            <b>{validation.message}</b>
          </div>
        );
      })}
    </div>
  ) : null;
}

export default Validation;
