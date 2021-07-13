import { auth } from "./../../firebase/utils";
import { takeLatest, put, all, call } from "redux-saga/effects";
import {
  fetchAuctionsStart,
  fetchAuctionStart,
  fetchUserAuctions,
  setAuction,
  setAuctions,
  setHomepageAuctions,
  setRecAuctions,
  setUserAuctions,
} from "./auctions.actions";
import {
  handleAddAuction,
  handleFetchRecAuctions,
  handleFetchHomepageAuctions,
  handleFetchUserAuctions,
  handleFetchAuctions,
  handleDeleteThumbnail,
  handleDeleteAuction,
  handleFetchAuction,
  handleFetchLister,
  handleBidAuction,
  handleCheckAuction,
} from "./auctions.helpers";
import auctionTypes from "./auctions.types";

export function* addAuction({ payload }) {
  try {
    const timestamp = new Date();
    const userid = auth.currentUser.uid;
    yield handleAddAuction({
      ...payload,
      productAdminUserUID: userid,
      createdDate: timestamp,
      currentBidPrice: 0,
    });
    yield put(fetchAuctionsStart());
  } catch (err) {
    // console.log(err);
  }
}

export function* onAddAuctionStart() {
  yield takeLatest(auctionTypes.ADD_NEW_AUCTION_START, addAuction);
}

export function* bidAuction({ payload }) {
  const { auctionID } = payload;
  try {
    try {
      yield handleCheckAuction(payload);
    } catch {
      alert("A higher bid has been made by another User");
      yield put(fetchAuctionStart(auctionID));
      return;
    }
    yield handleBidAuction(payload);
    alert("Bid Succesful");
  } catch (err) {
    console.log(err);
  }
}

export function* onBidAuctionStart() {
  yield takeLatest(auctionTypes.BID_AUCTION_START, bidAuction);
}

export function* fetchRecAuctionsStart({ payload }) {
  try {
    const { documentID, auctionCategory } = payload;
    const auctions = yield handleFetchRecAuctions({
      auctionID: documentID,
      auctionCategory,
    });
    yield put(setRecAuctions(auctions));
  } catch (err) {
    console.log(err);
  }
}

export function* onFetchRecAuctionsStart() {
  yield takeLatest(auctionTypes.FETCH_REC_AUCTIONS, fetchRecAuctionsStart);
}

export function* fetchHomepageAuctionsStart({ payload }) {
  try {
    const auctions = yield handleFetchHomepageAuctions();
    yield put(setHomepageAuctions(auctions));
  } catch (err) {
    console.log(err);
  }
}

export function* onFetchHomepageAuctionsStart() {
  yield takeLatest(
    auctionTypes.FETCH_HOMEPAGE_AUCTIONS,
    fetchHomepageAuctionsStart
  );
}

export function* fetchUserAuctionsStart({ payload }) {
  try {
    const auctions = yield handleFetchUserAuctions(payload);
    yield put(setUserAuctions(auctions));
  } catch (err) {
    console.log(err);
  }
}

export function* onFetchUserAuctionsStart() {
  yield takeLatest(auctionTypes.FETCH_USER_AUCTIONS, fetchUserAuctionsStart);
}

export function* fetchAuctions({ payload }) {
  try {
    const auctions = yield handleFetchAuctions(payload);
    yield put(setAuctions(auctions));
    yield put(fetchUserAuctions({ userID: auth.currentUser.uid }));
  } catch (err) {
    // console.log(err);
  }
}

export function* onFetchAuctionsStart() {
  yield takeLatest(auctionTypes.FETCH_AUCTIONS_START, fetchAuctions);
}

export function* deleteAuction({ payload }) {
  try {
    yield handleDeleteThumbnail(payload);
    yield handleDeleteAuction(payload);
    yield all([
      put(fetchAuctionsStart()),
      put(fetchUserAuctions(auth.currentUser.uid)),
    ]);
  } catch (err) {
    // console.log(err);
  }
}

export function* onDeleteAuctionStart() {
  yield takeLatest(auctionTypes.DELETE_AUCTION_START, deleteAuction);
}

export function* fetchAuction({ payload }) {
  try {
    let auction = yield handleFetchAuction(payload);
    const { productAdminUserUID } = auction;
    const lister = yield handleFetchLister(productAdminUserUID);
    auction = { ...auction, lister };
    yield put(setAuction(auction));
  } catch (err) {
    // console.log(err);
  }
}

export function* onFetchAuctionStart() {
  yield takeLatest(auctionTypes.FETCH_AUCTION_START, fetchAuction);
}

export default function* auctionsSagas() {
  yield all([
    call(onAddAuctionStart),
    call(onFetchAuctionsStart),
    call(onDeleteAuctionStart),
    call(onFetchAuctionStart),
    call(onFetchUserAuctionsStart),
    call(onFetchRecAuctionsStart),
    call(onFetchHomepageAuctionsStart),
    call(onBidAuctionStart),
  ]);
}
