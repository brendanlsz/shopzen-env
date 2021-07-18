import { firestore } from "./../../firebase/utils";
import { storage } from "./../../firebase/upload";
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
      .limit(5)
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
  orderBy,
}) => {
  return new Promise((resolve, reject) => {
    const pageSize = 8;

    let ref = firestore.collection("requests");
    if (orderBy === "recent") {
      ref = ref.orderBy("createdDate", "desc");
    } else if (orderBy === "popularity") {
      ref = ref.orderBy("views", "desc");
    } else if (orderBy === "price") {
      ref = ref.orderBy("requestPrice", "desc");
    } else {
      ref = ref.orderBy("createdDate", "desc");
    }
    ref = ref.limit(pageSize);
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
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleDeleteThumbnail = (documentID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("requests")
      .doc(documentID)
      .get()
      .then((snapshot) => {
        let { imageName } = snapshot.data();
        return imageName;
      })
      .then((imageName) => {
        storage
          .ref(`/images/${imageName}`)
          .delete()
          .then(() => {
            resolve();
          })
          .catch((err) => {
            resolve();
          });
      })
      .catch((err) => {
        console.log(err);
        resolve();
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

export const handleFetchLister = (id) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("users")
      .doc(id)
      .get()
      .then((doc) => {
        const { email, userName } = doc.data();
        resolve({ email, userName });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
