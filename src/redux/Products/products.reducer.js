import productsTypes from "./products.types";
import productTypes from "./products.types";

const INITIAL_STATE = {
  products: [],
  product: {},
  userProducts: [],
};

const productsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case productTypes.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case productsTypes.SET_PRODUCT:
      return {
        ...state,
        product: action.payload,
      };
    case productsTypes.SET_USER_PRODUCTS:
      return {
        ...state,
        userProducts: action.payload,
      };
    default:
      return state;
  }
};

export default productsReducer;
