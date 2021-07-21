import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
import ImageGallery from "react-image-gallery";
import img0 from "./../../assets/Title.png";
import img1 from "./../../assets/Requests.png";
import img2 from "./../../assets/Products.png";
import img3 from "./../../assets/Auction.png";
import img4 from "./../../assets/Requestsm.png";
import img5 from "./../../assets/Productsm.png";
import img6 from "./../../assets/Auctionm.PNG";
import img12 from "./../../assets/Titlem.PNG";
import img7 from "./../../assets/item.png";
import img8 from "./../../assets/Searching.png";
import img9 from "./../../assets/Transactions.png";
import img10 from "./../../assets/Wallet.PNG";
import img11 from "./../../assets/Recommendations.PNG";

import { isBrowser, isMobile } from "react-device-detect";

const mapState = (state) => ({
  homeProducts: state.productsData.homepageProducts,
  homeRequests: state.requestsData.homepageRequests,
  homeAuctions: state.auctionData.homepageAuctions,
});

const Directory = (props) => {
  const dispatch = useDispatch();
  const { homeProducts, homeRequests, homeAuctions } = useSelector(mapState);
  const [stat, setStat] = useState(0);
  const [slide, setSlide] = useState(0);
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchHomepageProducts());
    dispatch(fetchHomepageRequests());
    dispatch(fetchHomepageAuctions());
  }, []);

  useEffect(() => {
    if (stat == 2) {
      setTimeout(() => {
        setStat(0);
      }, 3000);
    } else {
      setTimeout(() => {
        setStat(stat + 1);
      }, 3000);
    }
  }, [stat]);

  const images = [
    { original: img0 },
    { original: img1 },
    { original: img2 },
    { original: img3 },
  ];

  const imagesm = [
    { original: img12 },
    { original: img4 },
    { original: img5 },
    { original: img6 },
  ];

  const imagesf = [
    { original: img7 },
    { original: img8 },
    { original: img9 },
    { original: img10 },
    { original: img11 },
  ];

  function handleClick() {
    if (slide === 1) {
      history.push(`/requests/`);
    }
    if (slide === 2) {
      history.push(`/products/`);
    }
    if (slide === 3) {
      history.push(`/auctions/`);
    }
  }

  return (
    <div className="directory">
      <ImageGallery
        autoPlay={true}
        items={isMobile ? imagesm : images}
        onSlide={(a) => setSlide(a)}
        onClick={() => handleClick()}
        slideInterval={7000}
        slideDuration={900}
      />
      <div className="row main-landingpage"></div>
      {/* <div className="features-row">
        <h1>Main Features</h1>
        <div className="features-list row">
          <div className="feature">
            <i class="fa fa-3x  fa-thumbs-up"></i>
            <h1>Recommendations</h1>
            <p>
              View recommendations of similar listings when browsing through
              items or requests
            </p>
          </div>
        </div>
      </div> */}
      <div className="features-row">
        <h1>Main Features</h1>
        <div className="features-list row">
          <div className="feature">
            <iframe
              height="100%"
              width="100%"
              src="https://www.youtube.com/embed/s4-d0m-aJVU"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>

          <div className="feature">
            <ImageGallery
              autoPlay={true}
              items={imagesf}
              slideInterval={7500}
              slideDuration={900}
            />
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
