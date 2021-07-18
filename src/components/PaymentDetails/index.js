import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import FormInput from "./../forms/FormInput";
import Button from "./../forms/Button";
import Loader from "./../forms/Loader";
import { CountryDropdown } from "react-country-region-selector";
import { apiInstance } from "./../../Utils";
import {
  selectCartTotal,
  selectCartItemsCount,
  selectCartItems,
} from "./../../redux/Cart/cart.selectors";
import { saveOrderHistory } from "./../../redux/Orders/orders.actions";
import { clearCart } from "./../../redux/Cart/cart.actions";
import { checkItem } from "../../redux/Orders/orders.helpers";
import { createStructuredSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./styles.scss";
import { firestore } from "./../../firebase/utils";
import firebase from "firebase/app";
import { checkUserSession } from "../../redux/User/user.actions";

//logo
import Stripe from "./../../assets/stripe.png";
import unSecured from "./../../assets/notSecured.png";
import Secured from "./../../assets/Secured.png";

const initialAddressState = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
};

const mapState = createStructuredSelector({
  total: selectCartTotal,
  itemCount: selectCartItemsCount,
  cartItems: selectCartItems,
});

const mapState2 = ({ user }) => ({
  currentUser: user.currentUser,
});

const PaymentDetails = () => {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const { total, itemCount, cartItems } = useSelector(mapState);
  const { currentUser } = useSelector(mapState2);
  const dispatch = useDispatch();
  const [billingAddress, setBillingAddress] = useState({
    ...initialAddressState,
  });
  const [shippingAddress, setShippingAddress] = useState({
    ...initialAddressState,
  });
  const [walletShippingAddress, setWalletShippingAddress] = useState({
    ...initialAddressState,
  });
  const [recipientName, setRecipientName] = useState("");
  const [walletRecipientName, setWalletRecipientName] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [walletPayment, setWalletPayment] = useState(false);
  const [cardPayment, setCardPayment] = useState(true);
  const [secured, setSecured] = useState(false);
  const [unsecured, setUnsecured] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
    dispatch(checkUserSession());
  }, []);

  useEffect(() => {
    if (itemCount < 1) {
      history.push("/dashboard/orderhistory");
    }
  }, [itemCount]);

  const handleCardShipping = (evt) => {
    const { name, value } = evt.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };

  const handleWalletShipping = (evt) => {
    const { name, value } = evt.target;
    setWalletShippingAddress({
      ...walletShippingAddress,
      [name]: value,
    });
  };

  const handleBilling = (evt) => {
    const { name, value } = evt.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value,
    });
  };

  const handleCardFormSubmit = async (evt) => {
    evt.preventDefault();
    const cardElement = elements.getElement("card");

    if (
      !shippingAddress.line1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postal_code ||
      !shippingAddress.country ||
      !billingAddress.line1 ||
      !billingAddress.city ||
      !billingAddress.state ||
      !billingAddress.postal_code ||
      !billingAddress.country ||
      !recipientName ||
      !nameOnCard
    ) {
      return;
    }
    let i = 0;
    while (i < cartItems.length) {
      try {
        await checkItem(cartItems[i]);
      } catch {
        console.log(i);
        try {
          if (cartItems[i].productName) {
            alert(
              `The product ${cartItems[i].productName} has been removed from the store, please consider other products, thank you.`
            );
          }
        } catch {
          alert(
            "Error with processing payment of products, please try again, sorry for the incovenience"
          );
          history.push("/products");
          dispatch(clearCart());
        }
        history.push("/products");
        dispatch(clearCart());
        return;
      }
      i++;
    }

    setShowLoader(true);

    apiInstance
      .post("/payments/create", {
        amount: total,
        shipping: {
          name: recipientName,
          address: {
            ...shippingAddress,
          },
        },
      })
      .then(({ data: clientSecret }) => {
        stripe
          .createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
              name: nameOnCard,
              address: {
                ...billingAddress,
              },
            },
          })
          .then(({ paymentMethod }) => {
            stripe
              .confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
              })
              .then(({ paymentIntent }) => {
                if (paymentIntent) {
                  const configOrder = {
                    orderTotal: total,
                    orderType: "product",
                    orderItems: cartItems.map((item) => {
                      const {
                        documentID,
                        productThumbnail,
                        productName,
                        productPrice,
                        quantity,
                        productAdminUserUID,
                      } = item;

                      return {
                        documentID,
                        productThumbnail,
                        productName,
                        productPrice,
                        quantity,
                        productAdminUserUID,
                        ratingDetails: { productID: documentID, rated: false },
                      };
                    }),
                  };
                  dispatch(saveOrderHistory(configOrder));
                } else {
                  alert("Payment Rejected, please try again");
                  setShowLoader(false);
                }
              })
              .catch((err) => {
                setShowLoader(false);
              });
          })
          .catch((err) => setShowLoader(false));
      })
      .catch((err) => setShowLoader(false));
  };

  const handleWalletFormSubmit = async (evt) => {
    evt.preventDefault();
    if (
      !walletShippingAddress.line1 ||
      !walletShippingAddress.city ||
      !walletShippingAddress.state ||
      !walletShippingAddress.postal_code ||
      !walletShippingAddress.country ||
      !walletRecipientName
    ) {
      return;
    }

    try {
      // console.log(currentUser.wallet, total);
      if (currentUser.wallet < total) {
        alert("You don't have enough money in your wallet");
        return;
      }
      const configOrder = {
        orderTotal: total,
        orderType: "product",
        orderItems: cartItems.map((item) => {
          const {
            documentID,
            productThumbnail,
            productName,
            productPrice,
            quantity,
            productAdminUserUID,
          } = item;

          return {
            documentID,
            productThumbnail,
            productName,
            productPrice,
            quantity,
            productAdminUserUID,
            ratingDetails: { productID: documentID, rated: false },
          };
        }),
      };
      await firestore.doc(`users/${currentUser.id}`).update({
        wallet: firebase.firestore.FieldValue.increment(-total),
      });
      dispatch(saveOrderHistory(configOrder));
      history.push("/dashboard/orderhistory");
    } catch (err) {
      console.log(err);
    }
  };

  const configCardElement = {
    iconStyle: "solid",
    style: {
      base: {
        fontSize: "16px",
      },
    },
    hidePostalCode: true,
  };

  const handleSecured = (e) => {
    secured ? setSecured(false) : setSecured(true);
    setUnsecured(false);
  };

  const handleUnsecured = (e) => {
    setSecured(false);
    unsecured ? setUnsecured(false) : setUnsecured(true);
  };

  return (
    <div className="paymentDetails">
      <div className="paymentMethod">
        <Button
          className={cardPayment ? "active btnblock" : "btnblock"}
          onClick={() => {
            setWalletPayment(false);
            setCardPayment(true);
            setBillingAddress({
              ...initialAddressState,
            });
            setShippingAddress({
              ...initialAddressState,
            });
            setWalletShippingAddress({
              ...initialAddressState,
            });
            setRecipientName("");
            setWalletRecipientName("");
          }}
        >
          Pay with Card
        </Button>
        or
        <Button
          className={walletPayment ? "active btnblock" : "btnblock"}
          onClick={() => {
            setWalletPayment(true);
            setCardPayment(false);
            setBillingAddress({
              ...initialAddressState,
            });
            setShippingAddress({
              ...initialAddressState,
            });
            setWalletShippingAddress({
              ...initialAddressState,
            });
            setRecipientName("");
            setWalletRecipientName("");
          }}
        >
          Pay with Wallet
        </Button>
      </div>
      {cardPayment ? (
        <form onSubmit={handleCardFormSubmit}>
          <div className="group">
            <h2>Shipping Address</h2>

            <FormInput
              required
              placeholder="Recipient Name"
              name="recipientName"
              handleChange={(evt) => setRecipientName(evt.target.value)}
              value={recipientName}
              type="text"
            />

            <FormInput
              required
              placeholder="Line 1"
              name="line1"
              handleChange={(evt) => handleCardShipping(evt)}
              value={shippingAddress.line1}
              type="text"
            />

            <FormInput
              placeholder="Line 2"
              name="line2"
              handleChange={(evt) => handleCardShipping(evt)}
              value={shippingAddress.line2}
              type="text"
            />

            <FormInput
              required
              placeholder="City"
              name="city"
              handleChange={(evt) => handleCardShipping(evt)}
              value={shippingAddress.city}
              type="text"
            />

            <FormInput
              required
              placeholder="State"
              name="state"
              handleChange={(evt) => handleCardShipping(evt)}
              value={shippingAddress.state}
              type="text"
            />

            <FormInput
              required
              placeholder="Postal Code"
              name="postal_code"
              handleChange={(evt) => handleCardShipping(evt)}
              value={shippingAddress.postal_code}
              type="text"
            />

            <div className="formRow checkoutInput">
              <CountryDropdown
                required
                onChange={(val) =>
                  handleCardShipping({
                    target: {
                      name: "country",
                      value: val,
                    },
                  })
                }
                value={shippingAddress.country}
                valueType="short"
              />
            </div>
          </div>

          <div className="group">
            <h2>Billing Address</h2>

            <FormInput
              required
              placeholder="Name on Card"
              name="nameOnCard"
              handleChange={(evt) => setNameOnCard(evt.target.value)}
              value={nameOnCard}
              type="text"
            />

            <FormInput
              required
              placeholder="Line 1"
              name="line1"
              handleChange={(evt) => handleBilling(evt)}
              value={billingAddress.line1}
              type="text"
            />

            <FormInput
              placeholder="Line 2"
              name="line2"
              handleChange={(evt) => handleBilling(evt)}
              value={billingAddress.line2}
              type="text"
            />

            <FormInput
              required
              placeholder="City"
              name="city"
              handleChange={(evt) => handleBilling(evt)}
              value={billingAddress.city}
              type="text"
            />

            <FormInput
              required
              placeholder="State"
              name="state"
              handleChange={(evt) => handleBilling(evt)}
              value={billingAddress.state}
              type="text"
            />

            <FormInput
              required
              placeholder="Postal Code"
              name="postal_code"
              handleChange={(evt) => handleBilling(evt)}
              value={billingAddress.postal_code}
              type="text"
            />

            <div className="formRow checkoutInput">
              <CountryDropdown
                required
                onChange={(val) =>
                  handleBilling({
                    target: {
                      name: "country",
                      value: val,
                    },
                  })
                }
                value={billingAddress.country}
                valueType="short"
              />
            </div>
          </div>

          <h2>Card Details</h2>
          <h4 className="stripe">
            Secured Payment powered by
            <a href="https://stripe.com/en-sg">
              <img height="25px" src={Stripe} alt="Stripe" />
            </a>
          </h4>
          <div className="listCards">
            <Button type="button" onClick={() => handleUnsecured()}>
              <h4>List of test cards</h4>
            </Button>
            <Button type="button" onClick={() => handleSecured()}>
              <h4>
                List of <strong>3D secured</strong> test cards
              </h4>
            </Button>
          </div>
          <div className="renderTop">
            {secured ? <img src={Secured} alt="Secured" /> : <div />}
            {unsecured ? <img src={unSecured} alt="Unsecured" /> : <div />}
          </div>

          <div className="group">
            <CardElement options={configCardElement} />
          </div>

          {showLoader ? <div /> : <Button type="submit">Pay Now</Button>}
          {showLoader ? (
            <Loader>Processing payment... This may take a while</Loader>
          ) : (
            <div />
          )}
        </form>
      ) : (
        <div className="wallet">
          <h1>Wallet: ${currentUser.wallet / 100}</h1>
          <p>
            Money is added to wallet whenever a product listed for sale is sold
          </p>
          <div className="topupbtn">
            <Button
              onClick={() => {
                history.push("/wallettopup");
              }}
            >
              Top Up
            </Button>
          </div>
          <form onSubmit={handleWalletFormSubmit}>
            <div className="group">
              <h2>Shipping Address</h2>

              <FormInput
                required
                placeholder="Recipient Name"
                name="recipientName"
                handleChange={(evt) => setWalletRecipientName(evt.target.value)}
                value={walletRecipientName}
                type="text"
              />

              <FormInput
                required
                placeholder="Line 1"
                name="line1"
                handleChange={(evt) => handleWalletShipping(evt)}
                value={walletShippingAddress.line1}
                type="text"
              />

              <FormInput
                placeholder="Line 2"
                name="line2"
                handleChange={(evt) => handleWalletShipping(evt)}
                value={walletShippingAddress.line2}
                type="text"
              />

              <FormInput
                required
                placeholder="City"
                name="city"
                handleChange={(evt) => handleWalletShipping(evt)}
                value={walletShippingAddress.city}
                type="text"
              />

              <FormInput
                required
                placeholder="State"
                name="state"
                handleChange={(evt) => handleWalletShipping(evt)}
                value={walletShippingAddress.state}
                type="text"
              />

              <FormInput
                required
                placeholder="Postal Code"
                name="postal_code"
                handleChange={(evt) => handleWalletShipping(evt)}
                value={walletShippingAddress.postal_code}
                type="text"
              />

              <div className="formRow checkoutInput">
                <CountryDropdown
                  required
                  onChange={(val) =>
                    handleWalletShipping({
                      target: {
                        name: "country",
                        value: val,
                      },
                    })
                  }
                  value={walletShippingAddress.country}
                  valueType="short"
                />
              </div>
            </div>
            <Button>Pay Now</Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
