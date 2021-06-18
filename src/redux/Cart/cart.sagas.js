import { takeLatest, put, all, call } from "redux-saga/effects";
import { handleFetchCart } from "./cart.utils";
import cartTypes from "./cart.types";
import { setCart } from "./cart.actions";

export function* fetchCart() {
  try {
    const cart = yield handleFetchCart();
    yield put(setCart(cart));
  } catch (err) {
    console.log(err);
  }
}

export function* onFetchCart() {
  yield takeLatest(cartTypes.FETCH_CART, fetchCart);
}

export default function* cartSagas() {
  yield all([call(onFetchCart)]);
}
