import { auth } from "./../../firebase/utils";
import { takeLatest, put, all, call } from "redux-saga/effects";
import {
  setProducts,
  setProduct,
  fetchProductsStart,
  fetchUserProducts,
  setUserProducts,
} from "./products.actions";
import {
  handleAddProduct,
  handleFetchProducts,
  handleFetchProduct,
  handleDeleteProduct,
  handleFetchUserProducts,
} from "./products.helpers";
import productsTypes from "./products.types";
import { onAddUserRequestStart } from "../Requests/requests.sagas";

export function* addProduct({ payload }) {
  try {
    const timestamp = new Date();
    const userid = auth.currentUser.uid;
    yield handleAddProduct({
      ...payload,
      productAdminUserUID: userid,
      createdDate: timestamp,
      quantitysold: 0,
    });
    yield put(fetchProductsStart());
  } catch (err) {
    // console.log(err);
  }
}

export function* onAddProductStart() {
  yield takeLatest(productsTypes.ADD_NEW_PRODUCT_START, addProduct);
}

// export function* addUserProduct({ payload }) {
//   try {
//     const timestamp = new Date();
//     const userid = auth.currentUser.uid;
//     yield handleAddProduct({
//       ...payload,
//       productAdminUserUID: userid,
//       createdDate: timestamp,
//     });
//     yield put(fetchUserProducts(auth.currentUser.uid));
//   } catch (err) {
//     // console.log(err);
//   }
// }

// export function* onAddUserProductStart() {
//   yield takeLatest(productsTypes.ADD_NEW_USER_PRODUCT_START, addUserProduct);
// }

export function* fetchUserProductsStart({ payload }) {
  try {
    const products = yield handleFetchUserProducts(payload);
    yield put(setUserProducts(products));
  } catch (err) {
    console.log(err);
  }
}

export function* onFetchUserProductsStart() {
  yield takeLatest(productsTypes.FETCH_USER_PRODUCTS, fetchUserProductsStart);
}

export function* fetchProducts({ payload }) {
  try {
    const products = yield handleFetchProducts(payload);
    yield put(setProducts(products));
    yield put(fetchUserProducts({ userID: auth.currentUser.uid }));
  } catch (err) {
    // console.log(err);
  }
}

export function* onFetchProductsStart() {
  yield takeLatest(productsTypes.FETCH_PRODUCTS_START, fetchProducts);
}

export function* deleteProduct({ payload }) {
  try {
    yield handleDeleteProduct(payload);
    yield all([
      put(fetchProductsStart()),
      put(fetchUserProducts(auth.currentUser.uid)),
    ]);
  } catch (err) {
    // console.log(err);
  }
}

export function* onDeleteProductStart() {
  yield takeLatest(productsTypes.DELETE_PRODUCT_START, deleteProduct);
}

export function* fetchProduct({ payload }) {
  try {
    const product = yield handleFetchProduct(payload);
    yield put(setProduct(product));
  } catch (err) {
    // console.log(err);
  }
}

export function* onFetchProductStart() {
  yield takeLatest(productsTypes.FETCH_PRODUCT_START, fetchProduct);
}

export default function* productsSagas() {
  yield all([
    call(onAddProductStart),
    call(onFetchProductsStart),
    call(onDeleteProductStart),
    call(onFetchProductStart),
    call(onFetchUserProductsStart),
    // call(onAddUserProductStart),
  ]);
}
