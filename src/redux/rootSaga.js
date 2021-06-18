import { all, call } from "redux-saga/effects";

import userSagas from "./User/user.sagas";
import productsSagas from "./Products/products.sagas";
import ordersSagas from "./Orders/orders.sagas";
import requestsSagas from "./Requests/requests.sagas";
import cartSagas from "./Cart/cart.sagas";
import searchSagas from "./Search/search.sagas";

export default function* rootSaga() {
  yield all([
    call(userSagas),
    call(productsSagas),
    call(ordersSagas),
    call(requestsSagas),
    call(cartSagas),
    call(searchSagas),
  ]);
}
