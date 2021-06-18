import searchTypes from "./search.types";

export const startSearch = (input = {}) => ({
  type: searchTypes.START_SEARCH,
  payload: input,
});

export const setSearchResults = (results) => ({
  type: searchTypes.SET_SEARCH_RESULTS,
  payload: results,
});
