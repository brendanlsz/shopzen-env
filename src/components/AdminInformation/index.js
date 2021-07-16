import React from "react";
import "./styles.scss";

const AdminInformation = (props) => {
  const { userName, email } = props;
  return (
    <div className="admin-information">
      <div className="profileicon">
        <i class="fa fa-user" aria-hidden="true"></i>
      </div>
      <div className="details">
        <p>Username: {userName}</p>
        <p>E-mail: {email}</p>
      </div>
    </div>
  );
};

export default AdminInformation;
