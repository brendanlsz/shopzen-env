import ordersTypes from "./orders.types";
import { takeLatest, put, all, call } from "redux-saga/effects";
import {
  handleSaveOrder,
  handleGetUserOrderHistory,
  handleGetOrder,
  handleSellerWallet,
  handleProductQuantity,
} from "./orders.helpers";
import { auth } from "./../../firebase/utils";
import { checkUserSession } from "../User/user.actions";
import { clearCart } from "./../Cart/cart.actions";
import { setUserOrderHistory, setOrderDetails } from "./orders.actions";

export function* getUserOrderHistory({ payload }) {
  try {
    const history = yield handleGetUserOrderHistory(payload);
    yield put(setUserOrderHistory(history));
  } catch (err) {
    console.log(err);
  }
}

export function* onGetUserOrderHistoryStart() {
  yield takeLatest(
    ordersTypes.GET_USER_ORDER_HISTORY_START,
    getUserOrderHistory
  );
}

export function* saveOrder({ payload }) {
  try {
    const timestamps = new Date();
    const { orderItems } = payload;
    yield handleSaveOrder({
      ...payload,
      orderUserID: auth.currentUser.uid,
      orderCreatedDate: timestamps,
    });
    const length = orderItems.length;
    let i = 0;
    while (i < length) {
      console.log(orderItems[i]);
      try {
        yield handleSellerWallet(orderItems[i]);
        yield handleProductQuantity(orderItems[i]);
      } catch (error) {
        console.log(error);
      }
      i++;
    }
    yield put(clearCart());
    yield put(checkUserSession());
  } catch (err) {
    // console.log(err);
  }
}

export function* onSaveOrderHistoryStart() {
  yield takeLatest(ordersTypes.SAVE_ORDER_HISTORY_START, saveOrder);
}

export function* getOrderDetails({ payload }) {
  try {
    const order = yield handleGetOrder(payload);
    console.log(order);
    yield put(setOrderDetails(order));
  } catch (err) {
    // console.log(err);
  }
}

export function* onGetOrderDetailsStart() {
  yield takeLatest(ordersTypes.GET_ORDER_DETAILS_START, getOrderDetails);
}

export default function* ordersSagas() {
  yield all([
    call(onSaveOrderHistoryStart),
    call(onGetUserOrderHistoryStart),
    call(onGetOrderDetailsStart),
  ]);
}
