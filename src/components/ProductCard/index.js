import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductStart,
  setProduct,
} from "./../../redux/Products/products.actions";
import { addProduct } from "./../../redux/Cart/cart.actions";
import Button from "./../forms/Button";
import "./styles.scss";
import Product from "./../Product";

const mapState = (state) => ({
  currentUser: state.user.currentUser,
  product: state.productsData.product,
});

const ProductCard = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { productID } = useParams();
  const { product, currentUser } = useSelector(mapState);

  const {
    productThumbnail,
    productName,
    productPrice,
    productDesc,
    productDetails,
  } = product;

  useEffect(() => {
    dispatch(fetchProductStart(productID));

    return () => {
      dispatch(setProduct({}));
    };
  }, []);

  const handleAddToCart = (product) => {
    if (!product) return;
    if (!currentUser) {
      alert("Please Log in or Register to start shopping");
      window.location = '/login';
      return;
    }
    dispatch(addProduct(product));
    history.push("/cart");
  };

  const configAddToCartBtn = {
    type: "button",
  };

  return (
    <div className="productCard ">
      <div className="mainSection productSection">
        <div className="row w-100">
          <div className="thumbnail ">
            <img src={productThumbnail} alt="No thumbnail found" />
          </div>
          <div className=" productDetails ">
            <ul className="">
              <div className="productTitle">
                <li className="productName">
                  <h1>{productName}</h1>
                </li>
                <li className="productPrice">
                  <span>${productPrice}</span>
                </li>
              </div>
              <li className="productInfo">
                {/* <span
                  className="desc"
                  // dangerouslySetInnerHTML={{ _html: productDesc }}
                /> */}
                <p>Quantity left: 10</p>
                <p>
                  {productDesc === "" ? "No description given" : productDesc}
                </p>
              </li>

              <li className="addToCart">
                <div>
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
      </div>
      <div className="detailsSection productSection">
        <h1>Specification/Details</h1>
        {productDetails === "" ? (
          <span className="productdetails">
            <p>No details given</p>
          </span>
        ) : (
          <span
            className="productdetails"
            dangerouslySetInnerHTML={{ __html: productDetails }}
          ></span>
        )}
      </div>
      <div className="productSection recommendationSection">
        <h1>You might also like</h1>
        <div className="recList">
          <Product className="recproduct" {...product} />
          <Product className="recproduct" {...product} />
          <Product className="recproduct" {...product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
