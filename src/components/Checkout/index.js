import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
} from "./../../redux/Cart/cart.selectors";
import { saveOrderHistory } from "../../redux/Orders/orders.actions";
import { createStructuredSelector } from "reselect";
import "./styles.scss";
import Button from "./../forms/Button";
import Item from "./Item";
import { firestore } from "./../../firebase/utils";
import firebase from "firebase/app";

const mapState = createStructuredSelector({
  cartItems: selectCartItems,
  total: selectCartTotal,
  itemCount: selectCartItemsCount,
});

const mapState2 = ({ user, ordersData }) => ({
  currentUser: user.currentUser,
});

const Checkout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { cartItems, total, itemCount } = useSelector(mapState);
  const { currentUser } = useSelector(mapState2);
  const errMsg = "You have no items in your cart.";

  const walletCheckout = async () => {
    try {
      // console.log(currentUser.wallet, total);
      if (currentUser.wallet < total) {
        alert("You don't have enough money in your wallet");
        return;
      }
      const configOrder = {
        orderTotal: total,
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
          };
        }),
      };
      await firestore.doc(`users/${currentUser.id}`).update({
        wallet: firebase.firestore.FieldValue.increment(-total),
      });
      dispatch(saveOrderHistory(configOrder));
      history.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>

      <div className="cart">
        {cartItems.length > 0 ? (
          <table border="0" cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td>
                  <table
                    className="checkoutHeader"
                    border="0"
                    cellPadding="10"
                    cellSpacing="0"
                  >
                    <tbody>
                      <tr>
                        <th>Product</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Remove</th>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table border="0" cellSpacing="0" cellPadding="0">
                    <tbody>
                      {cartItems.map((item, pos) => {
                        return (
                          <tr key={pos}>
                            <td>
                              <Item {...item} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table border="0" cellSpacing="0" cellPadding="0">
                    <tbody>
                      <tr>
                        <td>
                          <table border="0" cellPadding="10" cellSpacing="0">
                            <tbody>
                              <tr>
                                <td>
                                  <h3>Total: ${total / 100}</h3>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table border="0" cellPadding="10" cellSpacing="0">
                            <tbody>
                              <tr></tr>
                              <tr>
                                <td>
                                  <Button
                                    onClick={() => history.push("/products")}
                                  >
                                    Continue Shopping
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    onClick={() => {
                                      walletCheckout();
                                    }}
                                  >
                                    Checkout with Wallet
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    onClick={() => history.push("/payment")}
                                  >
                                    Checkout with Card
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>{errMsg}</p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
