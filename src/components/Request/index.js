import React from "react";
import { Link } from "react-router-dom";

import "./styles.scss";

const Request = (request, props) => {
  const {
    documentID,
    requestThumbnail,
    requestName,
    requestPrice,
    requestDesc,
  } = request;
  if (
    !documentID ||
    !requestThumbnail ||
    !requestName ||
    typeof requestPrice === "undefined"
  )
    return null;

  return (
    <div className="request" {...props}>
      <div className="thumb">
        <Link to={`/request/${documentID}`}>
          <img src={requestThumbnail} alt={requestName} />
        </Link>
      </div>

      <div className="details">
        <ul>
          <li>
            <span className="name">
              <Link to={`/request/${documentID}`}>{requestName}</Link>
            </span>
          </li>
          <li>
            <span className="price">${requestPrice}</span>
          </li>
        </ul>
      </div>

      <div className="description">
        <span>{requestDesc}</span>
      </div>
    </div>
  );
};

export default Request;
