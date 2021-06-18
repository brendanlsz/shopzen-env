import React from "react";
import "./styles.scss";

const AuthWrapper = ({ headline, children }) => {
  return (
    <div className="formwrap">
      <div className="form-body">
        <div className="form-holder">
          <div className="form-content">
            <div className="form-items">
              {headline && <h3>{headline}</h3>}
              <div className="children">{children && children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
