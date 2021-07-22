import { firestore } from "./../../firebase/utils";
import firebase from "firebase/app";

export const checkItem = (product) => {
  const { quantity } = product;
  console.log(quantity);
  return new Promise((resolve, reject) =>
    firestore
      .collection("products")
      .doc(`${product.documentID}`)
      .get()
      .then((product) => {
        const data = product.data();
        if (!product.exists) {
          reject("does not exist");
        } else if (data.quantityAvailable < quantity) {
          reject("not enough stock");
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

export const handleSellerWallet = (item) => {
  const { productAdminUserUID, productPrice, quantity } = item;
  const totalAmount = productPrice * quantity;
  return new Promise((resolve, reject) => {
    firestore
      .doc(`users/${productAdminUserUID}`)
      .update({
        wallet: firebase.firestore.FieldValue.increment(totalAmount),
      })
      .then(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 500);
          })
      )
      .then(() => {
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
        quantityAvailable: firebase.firestore.FieldValue.increment(-quantity),
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
    let ref = firestore
      .collection("orders")
      .orderBy("orderCreatedDate", "desc");
    ref = ref.where("orderUserID", "==", uid);

    ref
      .get()
      .then((snap) => {
        const data = [
          ...snap.docs.map((doc) => {
            if (doc.data().orderType === "product") {
              return {
                ...doc.data(),
                documentID: doc.id,
                orderItems: doc.data().orderItems.map((item) => {
                  return {
                    ...item,
                    ratingDetails: { ...item.ratingDetails, orderID: doc.id },
                  };
                }),
              };
            } else {
              return {
                ...doc.data(),
                documentID: doc.id,
              };
            }
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
          if (snap.data().orderType === "product") {
            resolve({
              ...snap.data(),
              documentID: orderID,
              orderItems: snap.data().orderItems.map((item) => {
                return {
                  ...item,
                  ratingDetails: { ...item.ratingDetails, orderID: orderID },
                };
              }),
            });
          } else {
            resolve({
              ...snap.data(),
              documentID: orderID,
            });
          }
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
