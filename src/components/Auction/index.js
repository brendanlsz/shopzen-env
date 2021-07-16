import React from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "../forms/Button";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/Cart/cart.actions";

import "./styles.scss";

const mapState = (state) => ({
  currentUser: state.user.currentUser,
});

const Auction = (auction, props) => {
  const { currentUser } = useSelector(mapState);
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    documentID,
    auctionThumbnail,
    auctionName,
    currentBidPrice,
    auctionMinimumBid,
  } = auction;
  if (
    !documentID ||
    !auctionThumbnail ||
    !auctionName ||
    typeof currentBidPrice === "undefined"
  )
    return null;

  return (
    <div className="auction" {...props}>
      <div className="thumb">
        <Link to={`/auction/${documentID}`}>
          <img src={auctionThumbnail} alt={auctionName} />
        </Link>
      </div>

      <div className="details">
        <ul>
          <li>
            <span className="name">
              <Link to={`/product/${documentID}`}>
                <strong>{auctionName}</strong>
              </Link>
            </span>
          </li>
          <li>
            <span className="price">
              Highest Bid:{" "}
              {currentBidPrice > 0 ? (
                <strong>${currentBidPrice / 100}</strong>
              ) : (
                <strong>No bids yet</strong>
              )}
            </span>
          </li>
          <li>
            <span className="price">
              Minimum Bid Price: <strong>${auctionMinimumBid / 100}</strong>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Auction;
