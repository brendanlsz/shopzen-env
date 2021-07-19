import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import React, { useEffect, useState } from "react";
import { firestore } from "./../../../firebase/utils";
import firebase from "firebase/app";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetailsStart } from "../../../redux/Orders/orders.actions";

const mapState = (state) => ({
  orderDetails: state.ordersData.orderDetails,
});

const RatingComponent = ({ ratingDetails }) => {
  const dispatch = useDispatch();
  const { orderDetails } = useSelector(mapState);
  const { rated, productID, orderID } = ratingDetails;
  const [value, setValue] = useState(0);
  const [localRated, setLocalRated] = useState(false);
  return (
    <Box component="fieldset" mb={3} borderColor="transparent">
      {localRated ? (
        <div>
          <Rating name="read-only" value={value} readOnly />
          <p>Thank you for rating the product!</p>
        </div>
      ) : rated ? (
        <p>The product has already been rated</p>
      ) : (
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            setLocalRated(true);
            firestore
              .collection("products")
              .doc(productID)
              .update({
                productReviewNumber: firebase.firestore.FieldValue.increment(1),
                productReviewScore:
                  firebase.firestore.FieldValue.increment(newValue),
              })
              .then(() => {
                firestore
                  .collection("orders")
                  .doc(orderID)
                  .update({
                    orderItems: orderDetails.orderItems.map((item) => {
                      if (item.documentID === productID) {
                        return {
                          ...item,
                          ratingDetails: { ...ratingDetails, rated: true },
                        };
                      } else {
                        return { ...item };
                      }
                    }),
                  })
                  .then(() => {
                    dispatch(getOrderDetailsStart(orderID));
                  });
              })
              .catch((err) => {
                alert("The item has been removed from the store");
              });
          }}
        />
      )}
    </Box>
  );
};

export default RatingComponent;
