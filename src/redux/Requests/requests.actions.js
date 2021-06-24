import requestTypes from "./requests.types";

export const addRequestStart = (requestData) => ({
  type: requestTypes.ADD_NEW_REQUEST_START,
  payload: requestData,
});

export const fetchRequestsStart = (filters = {}) => ({
  type: requestTypes.FETCH_REQUESTS_START,
  payload: filters,
});

export const fetchRecRequests = (request) => ({
  type: requestTypes.FETCH_REC_REQUESTS,
  payload: request,
});

export const setRequests = (requests) => ({
  type: requestTypes.SET_REQUESTS,
  payload: requests,
});

export const deleteRequestStart = (requestID) => ({
  type: requestTypes.DELETE_REQUEST_START,
  payload: requestID,
});

export const fetchUserRequests = (userID) => ({
  type: requestTypes.FETCH_USER_REQUESTS,
  payload: userID,
});

export const fetchRequestStart = (requestID) => ({
  type: requestTypes.FETCH_REQUEST_START,
  payload: requestID,
});

export const fetchHomepageRequests = () => ({
  type: requestTypes.FETCH_HOMEPAGE_REQUESTS,
});

export const setRequest = (request) => ({
  type: requestTypes.SET_REQUEST,
  payload: request,
});

export const setUserRequests = (requests) => ({
  type: requestTypes.SET_USER_REQUESTS,
  payload: requests,
});

export const setRecRequests = (request) => ({
  type: requestTypes.SET_REC_REQUESTS,
  payload: request,
});

export const incrementRequestView = (requestID) => ({
  type: requestTypes.INCREMENT_REQUEST_VIEW,
  payload: requestID,
});

export const setHomepageRequests = (requests) => ({
  type: requestTypes.SET_HOMEPAGE_REQUESTS,
  payload: requests,
});
