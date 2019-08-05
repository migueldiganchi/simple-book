import React from "react";

function Validation(props) {
  return props.validationList && props.validationList.length > 0 ? (
    <div className="validation text-right px-2">
      {props.validationList.map((validation, i) => {
        return (
          <div key={i} className="validation-error">
            <b>{validation.message}</b>
          </div>
        );
      })}
    </div>
  ) : null;
}

export default Validation;
