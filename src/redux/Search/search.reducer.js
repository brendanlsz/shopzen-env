import searchTypes from "./search.types";

const INITIAL_STATE = {
  searchResults: {},
  searchInput: "",
};

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
    case searchTypes.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
      };
    case searchTypes.SET_SEARCH_INPUT:
      return {
        ...state,
        searchInput: action.payload,
      };
  }
};

export default searchReducer;
