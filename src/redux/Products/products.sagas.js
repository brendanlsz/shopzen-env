import { auth } from "./../../firebase/utils";
import { takeLatest, put, all, call } from "redux-saga/effects";
import {
  setProducts,
  setProduct,
  fetchProductsStart,
  fetchUserProducts,
  setUserProducts,
  setRecProducts,
  setHomepageProducts,
} from "./products.actions";
import {
  handleAddProduct,
  handleFetchProducts,
  handleFetchProduct,
  handleDeleteProduct,
  handleFetchUserProducts,
  handleFetchRecProducts,
  handleFetchHomepageProducts,
} from "./products.helpers";
import productsTypes from "./products.types";

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

export function* fetchRecProductsStart({ payload }) {
  try {
    const { documentID, productCategory } = payload;
    const products = yield handleFetchRecProducts({
      productID: documentID,
      productCategory,
    });
    yield put(setRecProducts(products));
  } catch (err) {
    console.log(err);
  }
}

export function* onFetchRecProductsStart() {
  yield takeLatest(productsTypes.FETCH_REC_PRODUCTS, fetchRecProductsStart);
}

export function* fetchHomepageProductsStart({ payload }) {
  try {
    const products = yield handleFetchHomepageProducts();
    yield put(setHomepageProducts(products));
  } catch (err) {
    console.log(err);
  }
}

export function* onFetchHomepageProductsStart() {
  yield takeLatest(
    productsTypes.FETCH_HOMEPAGE_PRODUCTS,
    fetchHomepageProductsStart
  );
}

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
    call(onFetchRecProductsStart),
    call(onFetchHomepageProductsStart),
  ]);
}
