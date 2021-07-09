import auctionTypes from "./auctions.types";

const INITIAL_STATE = {
  auctions: [],
  auction: {},
  userAuctions: [],
  recAuctions: [],
  homepageAuctions: [],
};

const auctionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case auctionTypes.SET_PRODUCTS:
      return {
        ...state,
        auctions: action.payload,
      };
    case auctionTypes.SET_PRODUCT:
      return {
        ...state,
        auction: action.payload,
      };
    case auctionTypes.SET_USER_PRODUCTS:
      return {
        ...state,
        userAuctions: action.payload,
      };
    case auctionTypes.SET_REC_PRODUCTS:
      return {
        ...state,
        recAuctions: action.payload,
      };
    case auctionTypes.SET_HOMEPAGE_PRODUCTS:
      return {
        ...state,
        homepageAuctions: action.payload,
      };
    default:
      return state;
  }
};

export default auctionReducer;
