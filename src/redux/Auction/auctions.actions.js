import auctionTypes from "./auctions.types";

export const addAuctionStart = (auctionData) => ({
  type: auctionTypes.ADD_NEW_AUCTION_START,
  payload: auctionData,
});

export const deleteAuctionStart = (auctionID) => ({
  type: auctionTypes.DELETE_AUCTION_START,
  payload: auctionID,
});

export const resolveAuctionStart = (auctionID) => ({
  type: auctionTypes.RESOLVE_AUCTION_START,
  payload: auctionID,
});

export const bidAuctionStart = (bidData) => ({
  type: auctionTypes.BID_AUCTION_START,
  payload: bidData,
});

export const fetchAuctionsStart = (filters = {}) => ({
  type: auctionTypes.FETCH_AUCTIONS_START,
  payload: filters,
});

export const fetchAuctionStart = (auctionID) => ({
  type: auctionTypes.FETCH_AUCTION_START,
  payload: auctionID,
});

export const fetchUserAuctions = (userID) => ({
  type: auctionTypes.FETCH_USER_AUCTIONS,
  payload: userID,
});

export const fetchRecAuctions = (auction) => ({
  type: auctionTypes.FETCH_REC_AUCTIONS,
  payload: auction,
});

export const fetchHomepageAuctions = () => ({
  type: auctionTypes.FETCH_HOMEPAGE_AUCTIONS,
});

export const setAuctions = (auctions) => ({
  type: auctionTypes.SET_AUCTIONS_START,
  payload: auctions,
});

export const setAuction = (auction) => ({
  type: auctionTypes.SET_AUCTION_START,
  payload: auction,
});

export const setUserAuctions = (auctions) => ({
  type: auctionTypes.SET_USER_AUCTIONS,
  payload: auctions,
});

export const setRecAuctions = (auctions) => ({
  type: auctionTypes.SET_REC_AUCTIONS,
  payload: auctions,
});

export const setHomepageAuctions = (auctions) => ({
  type: auctionTypes.SET_HOMEPAGE_AUCTIONS,
  payload: auctions,
});
