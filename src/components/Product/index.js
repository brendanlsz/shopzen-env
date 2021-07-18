import React from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "./../forms/Button";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "./../../redux/Cart/cart.actions";
import Rating from "@material-ui/lab/Rating";

import "./styles.scss";

const mapState = (state) => ({
  currentUser: state.user.currentUser,
});

const Product = (product, props) => {
  const { currentUser } = useSelector(mapState);
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    documentID,
    productThumbnail,
    productName,
    productPrice,
    productReviewScore,
    productReviewNumber,
  } = product;
  let productRating = 0;
  if (productReviewNumber !== 0) {
    productRating = Math.round(productReviewScore / productReviewNumber);
  }
  if (
    !documentID ||
    !productThumbnail ||
    !productName ||
    typeof productReviewNumber === "undefined" ||
    typeof productReviewScore === "undefined" ||
    typeof productPrice === "undefined"
  )
    return null;

  const configAddToCartBtn = {
    type: "button",
  };

  const handleAddToCart = (product) => {
    if (!product) return;
    if (!currentUser) {
      alert("Please login or register to start shopping");
      window.location = "/login";
      return;
    }
    dispatch(addProduct(product));
    history.push("/cart");
  };

  return (
    <div className="product" {...props}>
      <div className="thumb">
        <Link to={`/product/${documentID}`}>
          <img src={productThumbnail} alt={productName} />
        </Link>
      </div>

      <div className="details">
        <ul>
          <li>
            <span className="name">
              <Link to={`/product/${documentID}`}>
                <strong>{productName}</strong>
              </Link>
            </span>
          </li>
          <li>
            <span className="price">${productPrice / 100}</span>
          </li>
          <li>
            <div className="reviews">
              <Rating name="read-only" value={productRating} readOnly />
              <span className="reviews-number">({productReviewNumber})</span>
            </div>
          </li>
          <li>
            <div className="addToCart">
              <Button
                {...configAddToCartBtn}
                onClick={() => handleAddToCart(product)}
              >
                Add to cart
              </Button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Product;
