import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductStart,
  fetchRecProducts,
  setProduct,
  setRecProducts,
} from "./../../redux/Products/products.actions";
import { addProduct } from "./../../redux/Cart/cart.actions";
import Button from "./../forms/Button";
import "./styles.scss";
import Product from "./../Product";
import { Redirect } from "react-router-dom";
import { getUserEmail, getCurrUserEmail } from "../../firebase/utils";
import { isBrowser, isMobile } from "react-device-detect";
import WithAuth from "../../hoc/withAuth";
import Chats from "./../Chats/ChatsDirectDesktop";
import ChatsMobile from "./../Chats/ChatsDirectMobile";
import AdminInformation from "../AdminInformation";
import createUserNoPP from "./../Chats/createChatUserNoProfilePic";

const mapState = (state) => ({
  currentUser: state.user.currentUser,
  product: state.productsData.product,
  recProducts: state.productsData.recProducts,
});

const ProductCard = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { productID } = useParams();
  const { product, recProducts, currentUser } = useSelector(mapState);
  let [click, setClick] = useState(false);
  let [clicked, setClicked] = useState(false);
  const [userEmail, setEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const {
    productThumbnail,
    productName,
    productPrice,
    productDesc,
    productDetails,
    productAdminUserUID,
    lister,
  } = product;

  useEffect(() => {
    dispatch(fetchProductStart(productID));
    const getData = async () => {
      try {
        const email = await getUserEmail();
        console.log(email);
        createUserNoPP(email);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
    return () => {
      dispatch(setProduct({}));
      dispatch(setRecProducts([]));
      window.scrollTo(0, 0);
    };
  }, [productID]);

  useEffect(() => {
    if (userEmail !== "" && adminEmail !== "") {
      if (userEmail === adminEmail)
        alert("Listing created by user, cannot contact yourself.");
      else {
        setClick(true);
      }
    }
  }, [userEmail, adminEmail]);

  const handleClose = () => {
    setClick(false);
  };

  const handleClick = async () => {
    if (!currentUser && clicked) {
      return <Redirect to="/products" />;
    }
    if (!currentUser && !clicked) {
      alert("Please login or register to contact seller");
      window.location = "/login";
      return;
    }
    if (userEmail !== "" && adminEmail !== "") {
      if (userEmail === adminEmail) {
        alert("Listing created by user, cannot contact yourself");
        return;
      }
    }
    try {
      let adminemail = await getUserEmail(productAdminUserUID);
      setAdminEmail(adminemail);
    } catch (err) {
      console.log(err);
    }
    try {
      let useremail = await getCurrUserEmail();
      setEmail(useremail);
    } catch (err) {
      console.log(err);
    }
    if (userEmail !== adminEmail) {
      setClick(true);
    }
    console.log(adminEmail);
    console.log(userEmail);
  };

  useEffect(() => {
    if (product) dispatch(fetchRecProducts(product));
  }, [product]);

  const handleAddToCart = (product) => {
    if (!product) return;
    if (!currentUser) {
      alert("Please Log in or Register to start shopping");
      window.location = "/login";
      return;
    }
    dispatch(addProduct(product));
    history.push("/cart");
  };

  const configAddToCartBtn = {
    type: "button",
  };

  if (isBrowser) {
    if (click) {
      // handleClick();
      if (!currentUser) {
        if (clicked) {
          return <Redirect to="/products" />;
        }
        return <Redirect to="/login" />;
      }
      return (
        <div>
          <WithAuth>
            <button id="chats-page-close" onClick={() => handleClose()}>
              x
            </button>
            <Chats
              currentUserEmail={userEmail}
              currentUserUid={currentUser.id}
              adminUserEmail={adminEmail}
              admiUserUid={productAdminUserUID}
            />
          </WithAuth>
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

                      <p>
                        {productDesc === ""
                          ? "No description given"
                          : productDesc}
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
                    <li>
                      <Button onClick={() => handleClick()}>
                        Contact Seller
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="detailsSection productSection">
              <div className="admin-detail-section">
                <h1>Seller Details</h1>
                <AdminInformation {...lister} />
              </div>
              <div className="product-detail-section">
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
            </div>
            <div className="productSection recommendationSection">
              <h1>You might also like</h1>
              <div className="recList">
                {recProducts.map((product, pos) => {
                  const { productThumbnail, productName, productPrice } =
                    product;
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
          </div>
        </div>
      );
    } else if (!click) {
      return (
        <div>
          {currentUser ? (
            <button id="chatsButton" onClick={() => handleClick()}>
              Chats
            </button>
          ) : (
            <div />
          )}
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

                      <p>
                        {productDesc === ""
                          ? "No description given"
                          : productDesc}
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
                    <li>
                      <Button onClick={() => handleClick()}>
                        Contact Seller
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="detailsSection productSection">
              <div className="admin-detail-section">
                <h1>Seller Details</h1>
                <AdminInformation {...lister} />
              </div>
              <div className="product-detail-section">
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
            </div>
            <div className="productSection recommendationSection">
              <h1>You might also like</h1>
              <div className="recList">
                {recProducts.map((product, pos) => {
                  const { productThumbnail, productName, productPrice } =
                    product;
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
          </div>
        </div>
      );
    }
  } else if (isMobile) {
    if (click) {
      // handleClick();
      if (!currentUser) {
        if (clicked) {
          return <Redirect to="/requests" />;
        }
        return <Redirect to="/login" />;
      }
      return (
        <div>
          <WithAuth>
            <button id="chats-page-close-mobile" onClick={() => handleClose()}>
              Close
            </button>
            <ChatsMobile
              currentUserEmail={userEmail}
              currentUserUid={currentUser.id}
              adminUserEmail={adminEmail}
              admiUserUid={productAdminUserUID}
            />
          </WithAuth>
        </div>
      );
    } else if (!click) {
      return (
        <div>
          {currentUser ? (
            <button id="chatsButton" onClick={() => handleClick()}>
              Chats
            </button>
          ) : (
            <div />
          )}
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

                      <p>
                        {productDesc === ""
                          ? "No description given"
                          : productDesc}
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
                    <li>
                      <Button onClick={() => handleClick()}>
                        Contact Seller
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="detailsSection productSection">
              <div className="admin-detail-section">
                <h1>Seller Details</h1>
                <AdminInformation {...lister} />
              </div>
              <div className="product-detail-section">
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
            </div>
            <div className="productSection recommendationSection">
              <h1>You might also like</h1>
              <div className="recList">
                {recProducts.map((product, pos) => {
                  const { productThumbnail, productName, productPrice } =
                    product;
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
          </div>
        </div>
      );
    }
  }
};

export default ProductCard;
