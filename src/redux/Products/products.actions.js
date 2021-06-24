import productsTypes from "./products.types";

export const addProductStart = (productData) => ({
  type: productsTypes.ADD_NEW_PRODUCT_START,
  payload: productData,
});

export const fetchProductsStart = (filters = {}) => ({
  type: productsTypes.FETCH_PRODUCTS_START,
  payload: filters,
});

export const setProducts = (products) => ({
  type: productsTypes.SET_PRODUCTS,
  payload: products,
});

export const deleteProductStart = (productID) => ({
  type: productsTypes.DELETE_PRODUCT_START,
  payload: productID,
});

export const fetchProductStart = (productID) => ({
  type: productsTypes.FETCH_PRODUCT_START,
  payload: productID,
});

export const fetchUserProducts = (userID) => ({
  type: productsTypes.FETCH_USER_PRODUCTS,
  payload: userID,
});

export const fetchRecProducts = (product) => ({
  type: productsTypes.FETCH_REC_PRODUCTS,
  payload: product,
});

export const fetchHomepageProducts = () => ({
  type: productsTypes.FETCH_HOMEPAGE_PRODUCTS,
});

export const setProduct = (product) => ({
  type: productsTypes.SET_PRODUCT,
  payload: product,
});

export const setUserProducts = (products) => ({
  type: productsTypes.SET_USER_PRODUCTS,
  payload: products,
});

export const setRecProducts = (products) => ({
  type: productsTypes.SET_REC_PRODUCTS,
  payload: products,
});

export const setHomepageProducts = (products) => ({
  type: productsTypes.SET_HOMEPAGE_PRODUCTS,
  payload: products,
});
