import { firestore } from "./../../firebase/utils";

export const handleCreateNotification = (notification) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("notifications")
      .doc()
      .set(notification)
      .then(() => resolve())
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleDeleteNotification = (notificationID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("notifications")
      .doc(notificationID)
      .delete()
      .then(() => resolve())
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleFetchUserNotifications = (userID) => {
  return new Promise((resolve, reject) => {
    let ref = firestore
      .collection("notifications")
      .orderBy("notificationCreatedDate", "desc");
    ref = ref.where("recipientID", "==", userID);
    ref
      .get()
      .then((snapshot) => {
        const data = [
          ...snapshot.docs.map((notification) => {
            return {
              ...notification.data(),
              documentID: notification.id,
            };
          }),
        ];
        resolve({ data });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
