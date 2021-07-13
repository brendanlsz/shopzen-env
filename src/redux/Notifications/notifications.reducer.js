import notificationstypes from "./notifications.types";

const INITIAL_STATE = {
  notifications: [],
};
const notificationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case notificationstypes.SET_USER_NOTIFICATION_START:
      return {
        ...state,
        notifications: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

export default notificationsReducer;
