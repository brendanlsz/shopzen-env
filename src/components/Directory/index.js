import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
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
import ImageGallery from 'react-image-gallery';
import img1 from './../../assets/Requests.png'
import img2 from './../../assets/Products.png'
import img3 from './../../assets/Auction.png'




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
    if(stat == 2) {
      setTimeout(() => {
        setStat(0)
      }, 3000);
    } else {
      setTimeout(() => {
        setStat(stat+1)
      }, 3000);
    }
  }, [stat])


  const slideImages = [
    img1,
    img2,
    img3
  ];

  const images = [
    {original: img1},
    {original: img2},
    {original: img3},
  ];

  function handleClick() {
    if(slide == 0) {
      history.push(`/requests/`);
    }
    if(slide == 1) {
      history.push(`/products/`);
    }
    if(slide == 2) {
      history.push(`/auctions/`);
    }
  }

  return (
    <div className="directory">
      <div className="row main-landingpage">
        <div className="col-5 logo-col">
          {/* <iframe
            width="512"
            height="288"
            src="https://www.youtube.com/embed/s4-d0m-aJVU"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe> */}
        </div>
        {/* {stat == 0 && <img src={img1} alt="hello" />}
        {stat == 1 && <img src={img2} alt="hello" />}
        {stat == 2 && <img src={img3} alt="hello" />} */}
        <ImageGallery
          autoPlay={true}
          items={images}
          onSlide={(a) => setSlide(a)}
          onClick={() => handleClick()}
          slideInterval={7000}
          slideDuration={900}
        />
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
