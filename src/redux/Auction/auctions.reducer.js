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
    case auctionTypes.SET_AUCTIONS_START:
      return {
        ...state,
        auctions: action.payload,
      };
    case auctionTypes.SET_AUCTION_START:
      return {
        ...state,
        auction: action.payload,
      };
    case auctionTypes.SET_USER_AUCTIONS:
      return {
        ...state,
        userAuctions: action.payload,
      };
    case auctionTypes.SET_REC_AUCTIONS:
      return {
        ...state,
        recAuctions: action.payload,
      };
    case auctionTypes.SET_HOMEPAGE_AUCTIONS:
      return {
        ...state,
        homepageAuctions: action.payload,
      };
    default:
      return state;
  }
};

export default auctionReducer;
