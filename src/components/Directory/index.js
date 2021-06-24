import React from "react";
import { Link } from "react-router-dom";
import logo from "./../../assets/logo-black.png";
import "./styles.scss";
import Product from "./../Product";

const Directory = (props) => {
  return (
    <div className="directory">
      <div className="row main-landingpage">
        <div className="col-5 logo-col">
          <img classname="logo" src={logo}></img>
        </div>
        <div className="col-7 description-col">
          <div className="body">
            <h1>Shopping Made Easier </h1>
            <p>
              At ShopZen, on top of letting sellers list items for sale, we
              allow buyers to make listings of items they wish to buy online so
              that interested sellers can contact them
            </p>
            <div className="btn-section">
              <Link className="btn" to="/dashboard/products">
                List product for sale
              </Link>
              or
              <Link className="btn" to="/dashboard/requests">
                Make a buy request
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="features-row">
        <h1>Main Features</h1>
        <div className="features-list row">
          <div className="feature">
            <i class="fa fa-3x fa-shopping-bag"></i>
            <h1>Item Listings</h1>
            <p>
              Make listings of items to sell or make requests of items you wish
              to buy
            </p>
          </div>
          <div className="feature">
            <i class="fa fa-3x fa-search"></i>
            <h1>Searching</h1>
            <p>
              Search for products or requests you are interested in using our
              search function
            </p>
          </div>
          <div className="feature">
            <i class="fa fa-3x fa-credit-card"></i>
            <h1>Transactions</h1>
            <p>
              Make transactions smoothly and securely when buying or selling
              items
            </p>
          </div>
        </div>
      </div>
      <div className="products-row">
        <h1>Featured Products</h1>
      </div>
      <div className="requests-row">
        <h1>Featured Requests</h1>
      </div>
    </div>
  );
};

export default Directory;
