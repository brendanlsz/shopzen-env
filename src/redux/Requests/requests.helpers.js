import { firestore } from "./../../firebase/utils";

export const handleAddRequest = (request) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("requests")
      .doc()
      .set(request)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleFetchUserRequests = ({
  userID,
  startAfterDoc,
  persistRequests = [],
}) => {
  return new Promise((resolve, reject) => {
    if (!userID) {
      reject();
    }
    const pageSize = 6;
    let ref = firestore
      .collection("requests")
      .limit(pageSize)
      .where("productAdminUserUID", "==", userID)
      .orderBy("createdDate");
    if (startAfterDoc) ref = ref.startAfter(startAfterDoc);
    ref
      .get()
      .then((snapshot) => {
        const totalCount = snapshot.size;
        const data = [
          ...persistRequests,
          ...snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              documentID: doc.id,
            };
          }),
        ];

        resolve({
          data,
          queryDoc: snapshot.docs[totalCount - 1],
          isLastPage: totalCount < pageSize,
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const handleFetchRequests = ({
  filterType,
  startAfterDoc,
  persistRequests = [],
}) => {
  return new Promise((resolve, reject) => {
    const pageSize = 6;

    let ref = firestore
      .collection("requests")
      .orderBy("createdDate", "desc")
      .limit(pageSize);
    if (filterType) ref = ref.where("requestCategory", "==", filterType);
    if (startAfterDoc) ref = ref.startAfter(startAfterDoc);

    ref
      .get()
      .then((snapshot) => {
        const totalCount = snapshot.size;
        const data = [
          ...persistRequests,
          ...snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              documentID: doc.id,
            };
          }),
        ];

        resolve({
          data,
          queryDoc: snapshot.docs[totalCount - 1],
          isLastPage: totalCount < pageSize,
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const handleDeleteRequest = (documentID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("requests")
      .doc(documentID)
      .delete()
      .then(() => {
        console.log(documentID, 2);
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleFetchRequest = (requestID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("requests")
      .doc(requestID)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          resolve({
            ...snapshot.data(),
            documentID: requestID,
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
