import notificationstypes from "./notifications.types";
import { takeLatest, put, all, call } from "redux-saga/effects";
import {
  handleCreateNotification,
  handleDeleteNotification,
  handleFetchUserNotifications,
} from "./notifications.helpers";

import {
  fetchUserNotifications,
  setUserNotification,
} from "./notifications.actions";

export function* createNotificationStart({ payload }) {
  try {
    yield handleCreateNotification(payload);
  } catch (err) {
    console.log(err);
  }
}

export function* onCreateNotificationStart() {
  yield takeLatest(
    notificationstypes.CREATE_NOTIFICATION_START,
    createNotificationStart
  );
}

export function* deleteNotificationStart({ payload }) {
  const { userID, documentID } = payload;
  try {
    yield handleDeleteNotification(documentID);
    yield put(fetchUserNotifications(userID));
  } catch (err) {
    console.log(err);
  }
}

export function* onDeleteNotificationStart() {
  yield takeLatest(
    notificationstypes.DELETE_NOTIFICATION_START,
    deleteNotificationStart
  );
}

export function* fetchUserNotificationsStart({ payload }) {
  try {
    const { data } = yield handleFetchUserNotifications(payload);
    yield put(setUserNotification(data));
  } catch (err) {
    console.log(err);
  }
}

export function* onFetchUserNotificationsStart() {
  yield takeLatest(
    notificationstypes.FETCH_USER_NOTIFICATION_START,
    fetchUserNotificationsStart
  );
}

export default function* notificationsSagas() {
  yield all([
    call(onCreateNotificationStart),
    call(onDeleteNotificationStart),
    call(onFetchUserNotificationsStart),
  ]);
}
