import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { firebaseConfig } from "./config";

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
GoogleProvider.setCustomParameters({ prompt: "select_account" });

export const handleUserProfile = async ({ userAuth, additionalData }) => {
  if (!userAuth) return;
  const { uid } = userAuth;

  const userRef = firestore.doc(`users/${uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email } = userAuth;
    const timestamp = new Date();
    const userRoles = ["user"];
    const cart = [];
    const wallet = 0;

    try {
      await userRef.set({
        displayName,
        email,
        createdDate: timestamp,
        userRoles,
        cart,
        wallet,
        ...additionalData,
      });
    } catch (err) {
      // console.log(err);
    }
  }

  return userRef;
};

export const handleUserCart = (cart) => {
  return new Promise((resolve, reject) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const { uid } = currentUser;
    const userRef = firestore.collection("users").doc(`${uid}`);
    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          firestore.doc(`users/${uid}`).set({
            ...doc.data(),
            cart: cart,
          });
          resolve();
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          reject();
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        reject();
      });
  });
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

export const getCurrUserEmail = () => {
  return new Promise((resolve, reject) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const { uid } = currentUser;
    firestore
      .doc(`users/${uid}`)
      .get()
      .then((doc) => {
        const userref = doc.data();
        const { email } = userref;
        resolve(email);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};


export const getUserEmail = (uid) => {
  return new Promise((resolve, reject) => {
    firestore
      .doc(`users/${uid}`)
      .get()
      .then((doc) => {
        const userref = doc.data();
        const { email } = userref;
        resolve(email);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};