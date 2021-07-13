import notificationstypes from "./notifications.types";

export const createNotification = (notification) => ({
  type: notificationstypes.CREATE_NOTIFICATION_START,
  payload: notification,
});

export const deleteNotification = (notificationID) => ({
  type: notificationstypes.DELETE_NOTIFICATION_START,
  payload: notificationID,
});

export const fetchUserNotifications = (userID) => ({
  type: notificationstypes.FETCH_USER_NOTIFICATION_START,
  payload: userID,
});

export const setUserNotification = (notifications = []) => ({
  type: notificationstypes.SET_USER_NOTIFICATION_START,
  payload: notifications,
});
