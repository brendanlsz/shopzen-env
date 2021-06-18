import React from "react";
import "./styles.scss";

const Loader = ({ children, ...otherProps }) => {
  return (
    <div {...otherProps}>
      <div className="main-loader">
        <div className="loader"></div>
        <p>{children}</p>
      </div>
    </div>
  );
};

export default Loader;
