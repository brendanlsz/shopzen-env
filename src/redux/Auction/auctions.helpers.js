import { firestore } from "./../../firebase/utils";
import { storage } from "./../../firebase/upload";

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

export const handleBidAuction = ({ biddetails, auctionID }) => {
  const { price } = biddetails;
  return new Promise((resolve, reject) => {
    firestore
      .collection("auctions")
      .doc(auctionID)
      .update({
        bidDetails: biddetails,
        currentBidPrice: price,
      })
      .then(() => {
        resolve();
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
  persistAuctions = [],
}) => {
  return new Promise((resolve, reject) => {
    const pageSize = 6;
    let ref = firestore.collection("auctions").orderBy("createdDate", "desc");
    if (filterType) ref = ref.where("auctionCategory", "==", filterType);
    ref = ref.limit(pageSize);
    if (startAfterDoc) ref = ref.startAfter(startAfterDoc);

    ref
      .get()
      .then((snapshot) => {
        console.log(snapshot);
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
      .where("auctionCategory", "==", auctionCategory);
    // .orderBy("quantitysold", "desc");
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
      .orderBy("quantitysold", "desc");
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

export const handleDeleteAuction = (documentID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("auctions")
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
        const { email, displayName } = doc.data();
        resolve({ email, displayName });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
