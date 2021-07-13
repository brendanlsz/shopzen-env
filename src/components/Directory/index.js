import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./../../assets/logo-black.png";
import "./styles.scss";
import Product from "./../Product";
import Request from "./../Request";
import { fetchHomepageProducts } from "../../redux/Products/products.actions";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomepageRequests } from "../../redux/Requests/requests.actions";

const mapState = (state) => ({
  homeProducts: state.productsData.homepageProducts,
  homeRequests: state.requestsData.homepageRequests,
});

const Directory = (props) => {
  const dispatch = useDispatch();
  const { homeProducts, homeRequests } = useSelector(mapState);
  useEffect(() => {
    dispatch(fetchHomepageProducts());
    dispatch(fetchHomepageRequests());
  }, []);
  return (
    <div className="directory">
      <div className="row main-landingpage">
        <div className="col-5 logo-col">
          <img className="logo" src={logo}></img>
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
        <h1>
          Featured Products (<Link to="/products">Browse More</Link>)
        </h1>
        <div className="homeproducts">
          {homeProducts.map((product, pos) => {
            const { productThumbnail, productName, productPrice } = product;
            if (
              !productThumbnail ||
              !productName ||
              typeof productPrice === "undefined"
            )
              return null;
            const { productID } = product;
            const configProduct = {
              documentID: productID,
              ...product,
            };
            return <Product key={pos} {...configProduct} />;
          })}
        </div>

        <div className="featured-items"></div>
      </div>
      <div className="requests-row">
        <h1>
          Featured Requests (<Link to="/requests">Browse More</Link>)
        </h1>
        <div className="featured-items">
          <div className="homerequests">
            {homeRequests.map((request, pos) => {
              const { requestThumbnail, requestName, requestPrice } = request;
              if (
                !requestThumbnail ||
                !requestName ||
                typeof requestPrice === "undefined"
              )
                return null;
              const { requestID } = request;
              const configRequest = {
                documentID: requestID,
                ...request,
              };
              return <Request key={pos} {...configRequest} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directory;
