import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import FormInput from "./../forms/FormInput";
import Button from "./../forms/Button";
import Loader from "./../forms/Loader";
import { CountryDropdown } from "react-country-region-selector";
import { apiInstance } from "./../../Utils";
import { useSelector } from "react-redux";
import "./styles.scss";
import { useHistory } from "react-router-dom";
import { firestore } from "./../../firebase/utils";
import firebase from "firebase/app";
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

const mapState = ({ user }) => ({
  currentUser: user.currentUser,
});

const WalletTopUpDetails = () => {
  const { currentUser } = useSelector(mapState);
  const stripe = useStripe();
  const history = useHistory();
  const elements = useElements();
  const [nameOnCard, setNameOnCard] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [secured, setSecured] = useState(false);
  const [unsecured, setUnsecured] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    ...initialAddressState,
  });

  const handleSecured = (e) => {
    secured ? setSecured(false) : setSecured(true);
    setUnsecured(false);
  };

  const handleUnsecured = (e) => {
    setSecured(false);
    unsecured ? setUnsecured(false) : setUnsecured(true);
  };

  const handleWalletTopUp = async () => {
    try {
      await firestore.doc(`users/${currentUser.id}`).update({
        wallet: firebase.firestore.FieldValue.increment(topUpAmount * 100),
      });
      history.push("/dashboard/wallet");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCardBilling = (evt) => {
    const { name, value } = evt.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value,
    });
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

  const handleCardFormSubmit = async (evt) => {
    evt.preventDefault();
    const cardElement = elements.getElement("card");
    if (
      !billingAddress.line1 ||
      !billingAddress.city ||
      !billingAddress.state ||
      !billingAddress.postal_code ||
      !billingAddress.country ||
      !nameOnCard
    ) {
      return;
    }
    setShowLoader(true);
    apiInstance
      .post("/payments/create", {
        amount: topUpAmount * 100,
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
                  handleWalletTopUp();
                  setShowLoader(false);
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

  return (
    <div>
      <div className="paymentDetails">
        <form onSubmit={handleCardFormSubmit}>
          <div className="group">
            <h1 className="walletTitle">Wallet: ${currentUser.wallet / 100}</h1>
            <h2 className="topupamount">Top-up Amount:</h2>
            <FormInput
              type="number"
              min="10.00"
              max="10000.00"
              step="0.01"
              placeholder="Price of item"
              value={topUpAmount}
              required
              handleChange={(e) => setTopUpAmount(e.target.value)}
            />
            <h2 className="addressTitle">Billing Address</h2>
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
              handleChange={(evt) => handleCardBilling(evt)}
              value={billingAddress.line1}
              type="text"
            />

            <FormInput
              placeholder="Line 2"
              name="line2"
              handleChange={(evt) => handleCardBilling(evt)}
              value={billingAddress.line2}
              type="text"
            />

            <FormInput
              required
              placeholder="City"
              name="city"
              handleChange={(evt) => handleCardBilling(evt)}
              value={billingAddress.city}
              type="text"
            />

            <FormInput
              required
              placeholder="State"
              name="state"
              handleChange={(evt) => handleCardBilling(evt)}
              value={billingAddress.state}
              type="text"
            />

            <FormInput
              required
              placeholder="Postal Code"
              name="postal_code"
              handleChange={(evt) => handleCardBilling(evt)}
              value={billingAddress.postal_code}
              type="text"
            />

            <div className="formRow checkoutInput">
              <CountryDropdown
                required
                onChange={(val) =>
                  handleCardBilling({
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
      </div>
    </div>
  );
};

export default WalletTopUpDetails;
