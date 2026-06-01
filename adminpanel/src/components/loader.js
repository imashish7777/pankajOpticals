import React from "react";
import "../CSS/loader.css"


function Loader() {
  return (
    <>
      <div className="loader">
        <span className="loader__element"></span>
        <span className="loader__element"></span>
        <span className="loader__element"></span>
      </div>
    </>
  );
}

export default Loader;
