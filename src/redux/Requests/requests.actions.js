import requestTypes from "./requests.types";

export const addRequestStart = (requestData) => ({
  type: requestTypes.ADD_NEW_REQUEST_START,
  payload: requestData,
});

export const fetchRequestsStart = (filters = {}) => ({
  type: requestTypes.FETCH_REQUESTS_START,
  payload: filters,
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

export const setRequest = (request) => ({
  type: requestTypes.SET_REQUEST,
  payload: request,
});

export const setUserRequests = (requests) => ({
  type: requestTypes.SET_USER_REQUESTS,
  payload: requests,
});

// export const addUserRequestStart = (requestData) => ({
//   type: requestTypes.ADD_NEW_USER_REQUEST_START,
//   payload: requestData,
// });
