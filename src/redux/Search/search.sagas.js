import { takeLatest, call, all, put } from "redux-saga/effects";
import searchTypes from "./search.types";
import { handleStartSearch } from "./search.helpers";
import { setSearchResults, setSearchInput } from "./search.actions";

export function* startSearch({ payload }) {
  const { searchInput } = payload;
  const results = yield handleStartSearch(payload);
  yield put(setSearchResults(results));
  yield put(setSearchInput(searchInput));
}

export function* onStartSearch() {
  yield takeLatest(searchTypes.START_SEARCH, startSearch);
}

export default function* searchSagas() {
  yield all([call(onStartSearch)]);
}
