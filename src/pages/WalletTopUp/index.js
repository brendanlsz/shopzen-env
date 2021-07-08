import React from "react";
import WalletTopUpDetails from "./../../components/WalletTopUpDetails";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { publishableKey } from "./../../stripe/config";
const stripePromise = loadStripe(publishableKey);

const WalletTopUp = () => {
  return (
    <Elements stripe={stripePromise}>
      <WalletTopUpDetails></WalletTopUpDetails>
    </Elements>
  );
};

export default WalletTopUp;
