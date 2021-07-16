import { firestore } from "./../../firebase/utils";
import firebase from "firebase/app";
import { storage } from "./../../firebase/upload";
import { handleCreateNotification } from "../Notifications/notifications.helpers";

export const handleAddAuction = (auction) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("auctions")
      .doc()
      .set(auction)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleBidAuction = ({ biddetails, auctionID, auctionName }) => {
  const { price } = biddetails;
  return new Promise((resolve, reject) => {
    firestore
      .collection("auctions")
      .doc(auctionID)
      .get()
      .then((doc) => {
        const snap = doc.data();
        if (snap.bidDetails && snap.numberOfBids > 0) {
          firestore
            .doc(`users/${snap.bidDetails.userID}`)
            .update({
              wallet: firebase.firestore.FieldValue.increment(
                snap.bidDetails.price
              ),
            })
            .then(() => {
              const time = new Date();
              handleCreateNotification({
                notificationCreatedDate: time,
                notificationContent: `Your bid of $${
                  snap.bidDetails.price / 100
                } for "${auctionName}" has been outbid by another user, the amount paid has been refunded to your wallet. Consider bidding again if you are still interested in the item`,
                recipientID: snap.bidDetails.userID,
                auctionID,
              });
            })
            .then(() => {
              firestore
                .collection("auctions")
                .doc(auctionID)
                .update({
                  bidDetails: biddetails,
                  currentBidPrice: price,
                  numberOfBids: firebase.firestore.FieldValue.increment(1),
                })
                .then(() => {
                  firestore
                    .doc(`users/${biddetails.userID}`)
                    .update({
                      wallet: firebase.firestore.FieldValue.increment(-price),
                    })
                    .then(() => {
                      const time = new Date();
                      handleCreateNotification({
                        notificationCreatedDate: time,
                        notificationContent: `Your bid of $${
                          price / 100
                        } for "${auctionName}" was made succesfully, please wait for lister to decide whether to accept the bid`,
                        recipientID: biddetails.userID,
                        auctionID,
                      }).then(() => resolve());
                    });
                });
            });
        } else {
          firestore
            .collection("auctions")
            .doc(auctionID)
            .update({
              bidDetails: biddetails,
              currentBidPrice: price,
              numberOfBids: firebase.firestore.FieldValue.increment(1),
            })
            .then(() => {
              firestore
                .doc(`users/${biddetails.userID}`)
                .update({
                  wallet: firebase.firestore.FieldValue.increment(-price),
                })
                .then(() => {
                  const time = new Date();
                  handleCreateNotification({
                    notificationCreatedDate: time,
                    notificationContent: `Your bid of $${
                      price / 100
                    } for "${auctionName}" was made succesfully, please wait for lister to decide whether to accept the bid`,
                    recipientID: biddetails.userID,
                    auctionID,
                  }).then(() => resolve());
                });
            });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleCheckAuction = ({ biddetails, auctionID }) => {
  const { price } = biddetails;
  return new Promise((resolve, reject) => {
    firestore
      .collection("auctions")
      .doc(auctionID)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        if (price <= data.currentBidPrice) {
          reject("Bid price too low");
        } else {
          resolve();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleFetchAuctions = ({
  userID,
  filterType,
  startAfterDoc,
  orderBy,
  persistAuctions = [],
}) => {
  return new Promise((resolve, reject) => {
    const pageSize = 6;
    let ref = firestore.collection("auctions");
    if (orderBy === "recent") {
      ref = ref.orderBy("createdDate", "desc");
    } else if (orderBy === "popularity") {
      ref = ref.orderBy("numberOfBids", "desc");
    } else if (orderBy === "price") {
      ref = ref.orderBy("currentBidPrice", "desc");
    } else {
      ref = ref.orderBy("createdDate", "desc");
    }
    if (filterType) ref = ref.where("auctionCategory", "==", filterType);
    ref = ref.limit(pageSize);
    if (startAfterDoc) ref = ref.startAfter(startAfterDoc);

    ref
      .get()
      .then((snapshot) => {
        const totalCount = snapshot.size;

        const data = [
          ...persistAuctions,
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

export const handleFetchRecAuctions = ({ auctionID, auctionCategory }) => {
  return new Promise((resolve, reject) => {
    let ref = firestore
      .collection("auctions")
      .limit(4)
      .where("auctionCategory", "==", auctionCategory)
      .orderBy("numberOfBids", "desc");
    ref
      .get()
      .then((snapshot) => {
        let data = [
          ...snapshot.docs.map((doc) => {
            return { auctionID: doc.id, ...doc.data() };
          }),
        ];
        console.log(data);
        data = data.filter((auction, index) => {
          return auction.auctionID !== auctionID;
        });
        if (data.length === 4) data = data.slice(0, 2);
        resolve(data);
      })
      .catch((err) => console.log(err));
  });
};

export const handleFetchHomepageAuctions = () => {
  return new Promise((resolve, reject) => {
    let ref = firestore
      .collection("auctions")
      .limit(4)
      .orderBy("numberOfBids", "desc");
    ref
      .get()
      .then((snapshot) => {
        let data = [
          ...snapshot.docs.map((doc) => {
            return { auctionID: doc.id, ...doc.data() };
          }),
        ];
        resolve(data);
      })
      .catch((err) => console.log(err));
  });
};

export const handleFetchUserAuctions = ({
  userID,
  startAfterDoc,
  persistAuctions = [],
}) => {
  return new Promise((resolve, reject) => {
    if (!userID) {
      reject();
    }
    const pageSize = 6;
    console.log(userID);
    let ref = firestore
      .collection("auctions")
      .limit(pageSize)
      .where("productAdminUserUID", "==", userID)
      .orderBy("createdDate");
    if (startAfterDoc) ref = ref.startAfter(startAfterDoc);
    ref
      .get()
      .then((snapshot) => {
        const totalCount = snapshot.size;
        const data = [
          ...persistAuctions,
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

export const handleDeleteAuction = ({ documentID, auctionName }) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("auctions")
      .doc(documentID)
      .get()
      .then((doc) => {
        const snap = doc.data();
        if (snap.bidDetails && snap.numberOfBids > 0) {
          firestore
            .doc(`users/${snap.bidDetails.userID}`)
            .update({
              wallet: firebase.firestore.FieldValue.increment(
                snap.bidDetails.price
              ),
            })
            .then(() => {
              const time = new Date();
              handleCreateNotification({
                notificationCreatedDate: time,
                notificationContent: `Your bid of $${
                  snap.bidDetails.price / 100
                } for "${auctionName}" has been cancelled as the lister decided to delete the auction. The amount has been refunded to your wallet`,
                recipientID: snap.bidDetails.userID,
              }).then(() => {
                firestore
                  .collection("auctions")
                  .doc(documentID)
                  .delete()
                  .then(() => {
                    resolve();
                  });
              });
            });
        } else {
          firestore
            .collection("auctions")
            .doc(documentID)
            .delete()
            .then(() => {
              resolve();
            });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleResolveAuction = ({ documentID, auctionName }) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("auctions")
      .doc(documentID)
      .get()
      .then((doc) => {
        const snap = doc.data();
        if (snap.bidDetails && snap.numberOfBids > 0) {
          const time = new Date();
          handleCreateNotification({
            notificationCreatedDate: time,
            notificationContent: `Congratulations, your bid of $${
              snap.bidDetails.price / 100
            } for "${auctionName}" has been confirmed by the lister.`,
            recipientID: snap.bidDetails.userID,
          }).then(() => {
            firestore
              .collection("auctions")
              .doc(documentID)
              .delete()
              .then(() => {
                resolve();
              });
          });
        } else {
          firestore
            .collection("auctions")
            .doc(documentID)
            .delete()
            .then(() => {
              resolve();
            });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleDeleteThumbnail = (documentID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("auctions")
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

export const handleFetchAuction = (auctionID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("auctions")
      .doc(auctionID)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          resolve({
            ...snapshot.data(),
            documentID: auctionID,
          });
        }
      })
      .catch((err) => {
        reject(err);
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
