import { firestore } from "./../../firebase/utils";
import firebase from "firebase/app";

export const checkItem = (product) => {
  return new Promise((resolve, reject) =>
    firestore
      .collection("products")
      .doc(`${product.documentID}`)
      .get()
      .then((product) => {
        if (!product.exists) {
          reject();
        } else {
          resolve();
        }
      })
  );
};

export const handleSaveOrder = (order) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("orders")
      .doc()
      .set(order)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// export const handleSellerProfile = (item) => {
//   const { productAdminUserUID, productPrice, quantity } = item;
//   const totalAmount = productPrice * quantity;
// };
export const handleSellerWallet = (item) => {
  const { productAdminUserUID, productPrice, quantity } = item;
  const totalAmount = productPrice * 100 * quantity;
  // console.log(totalAmount);
  return new Promise((resolve, reject) => {
    firestore
      .doc(`users/${productAdminUserUID}`)
      .update({
        wallet: firebase.firestore.FieldValue.increment(totalAmount),
      })
      .then(
        () =>
          new Promise((resolve) => {
            console.log("start delay" + Date.now());
            setTimeout(resolve, 500);
          })
      )
      .then(() => {
        console.log("done delay" + Date.now());
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const handleProductQuantity = (item) => {
  const { documentID, quantity } = item;
  return new Promise((resolve, reject) => {
    firestore
      .doc(`products/${documentID}`)
      .update({
        quantitysold: firebase.firestore.FieldValue.increment(quantity),
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleGetUserOrderHistory = (uid) => {
  return new Promise((resolve, reject) => {
    let ref = firestore.collection("orders").orderBy("orderCreatedDate");
    ref = ref.where("orderUserID", "==", uid);

    ref
      .get()
      .then((snap) => {
        const data = [
          ...snap.docs.map((doc) => {
            return {
              ...doc.data(),
              documentID: doc.id,
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

export const handleGetOrder = (orderID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("orders")
      .doc(orderID)
      .get()
      .then((snap) => {
        if (snap.exists) {
          resolve({
            ...snap.data(),
            documentID: orderID,
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
