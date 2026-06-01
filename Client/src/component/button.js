import React from "react";
import "../CSS/button.css";

function Button({ name }) {
  return (
    <button type="button" className="btn checkoutButton mb-3 ">
      {name}
    </button>
  );
}

export default Button;
