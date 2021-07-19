import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./../../assets/logo-black.png";
import "./styles.scss";
import Product from "./../Product";
import Request from "./../Request";
import Auction from "./../Auction";
import { fetchHomepageProducts } from "../../redux/Products/products.actions";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomepageRequests } from "../../redux/Requests/requests.actions";
import { fetchHomepageAuctions } from "../../redux/Auction/auctions.actions";

const mapState = (state) => ({
  homeProducts: state.productsData.homepageProducts,
  homeRequests: state.requestsData.homepageRequests,
  homeAuctions: state.auctionData.homepageAuctions,
});

const Directory = (props) => {
  const dispatch = useDispatch();
  const { homeProducts, homeRequests, homeAuctions } = useSelector(mapState);
  useEffect(() => {
    dispatch(fetchHomepageProducts());
    dispatch(fetchHomepageRequests());
    dispatch(fetchHomepageAuctions());
  }, []);
  return (
    <div className="directory">
      <div className="row main-landingpage">
        <div className="col-5 logo-col">
          <iframe
            width="512"
            height="288"
            src="https://www.youtube.com/embed/s4-d0m-aJVU"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
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
              <Link className="btn" to="/dashboard/manage">
                Manage Listings
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
        <div className="title">
          <h1>Featured Products </h1>
          <Link to="/products">
            See All
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
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
      </div>
      <div className="auctions-row">
        <div className="title">
          <h1>Featured Auctions</h1>{" "}
          <Link to="/auctions">
            See All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="homeauctions">
          {homeAuctions.map((auction, pos) => {
            const { auctionThumbnail, auctionName, currentBidPrice } = auction;
            if (
              !auctionThumbnail ||
              !auctionName ||
              typeof currentBidPrice === "undefined"
            )
              return null;
            const { auctionID } = auction;
            const configAuction = {
              documentID: auctionID,
              ...auction,
            };
            return <Auction key={pos} {...configAuction} />;
          })}
        </div>
      </div>

      <div className="requests-row">
        <div className="title">
          <h1>Featured Requests</h1>{" "}
          <Link to="/requests">
            See All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
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
