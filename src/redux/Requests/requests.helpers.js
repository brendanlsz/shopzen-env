import { firestore } from "./../../firebase/utils";
import firebase from "firebase/app";

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

export const handleFetchHomepageRequests = () => {
  return new Promise((resolve, reject) => {
    let ref = firestore
      .collection("requests")
      .limit(4)
      .orderBy("views", "desc");
    ref
      .get()
      .then((snapshot) => {
        let data = [
          ...snapshot.docs.map((doc) => {
            return { requestID: doc.id, ...doc.data() };
          }),
        ];
        resolve(data);
      })
      .catch((err) => console.log(err));
  });
};

export const handleFetchRecRequests = ({ requestID, requestCategory }) => {
  return new Promise((resolve, reject) => {
    let ref = firestore
      .collection("requests")
      .limit(4)
      .where("requestCategory", "==", requestCategory)
      .orderBy("views", "desc");
    ref
      .get()
      .then((snapshot) => {
        let data = [
          ...snapshot.docs.map((doc) => {
            return { requestID: doc.id, ...doc.data() };
          }),
        ];
        console.log(data);
        data = data.filter((request, index) => {
          return request.requestID !== requestID;
        });
        if (data.length === 4) data = data.slice(0, 2);
        resolve(data);
      })
      .catch((err) => console.log(err));
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

export const handleIncrementRequestView = (requestID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("requests")
      .doc(`${requestID}`)
      .update({
        views: firebase.firestore.FieldValue.increment(1),
      });
  });
};
