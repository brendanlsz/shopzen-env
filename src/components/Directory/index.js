import React from "react";
import { Link } from "react-router-dom";
import ShopMen from "./../../assets/shopMens.jpg";
import ShopWomen from "./../../assets/shopWomens.jpg";
import ShopBag from "./../../assets/shopBag.jpg";
import "./styles.scss";

const Directory = (props) => {
  return (
    <div className="directory">
      <div className="wrap">
        <div
          className="item d-flex justify-content-center align-items-center flex-column"
          style={{
            backgroundImage: `url(${ShopBag})`,
          }}
        >
          <h1 className="leftText">Here to Shop?</h1>
          <Link className="btn btn-lg" to="/products">
            View Products for Sale
          </Link>
        </div>
        <div
          className="item d-flex justify-content-center align-items-center flex-column"
          style={{
            backgroundImage: `url(${ShopMen})`,
          }}
        >
          <h1 className="rightText">Here to Sell?</h1>
          <Link className="btn btn-lg" to="/requests">
            View Buy Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Directory;
