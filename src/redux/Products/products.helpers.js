import { firestore } from "./../../firebase/utils";
import { storage } from "./../../firebase/upload";
import { firebaseConfig } from "../../firebase/config";

export const handleAddProduct = (product) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("products")
      .doc()
      .set(product)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const handleFetchRecProducts = ({ productID, productCategory }) => {
  return new Promise((resolve, reject) => {
    let ref = firestore
      .collection("products")
      .limit(4)
      .where("productCategory", "==", productCategory)
      .orderBy("quantitysold", "desc");
    ref
      .get()
      .then((snapshot) => {
        let data = [
          ...snapshot.docs.map((doc) => {
            return { productID: doc.id, ...doc.data() };
          }),
        ];

        data = data.filter((product, index) => {
          return product.productID !== productID;
        });
        if (data.length === 4) data = data.slice(0, 2);
        resolve(data);
      })
      .catch((err) => console.log(err));
  });
};

export const handleFetchHomepageProducts = () => {
  return new Promise((resolve, reject) => {
    let ref = firestore
      .collection("products")
      .limit(5)
      .orderBy("quantitysold", "desc");
    ref
      .get()
      .then((snapshot) => {
        let data = [
          ...snapshot.docs.map((doc) => {
            return { productID: doc.id, ...doc.data() };
          }),
        ];
        resolve(data);
      })
      .catch((err) => console.log(err));
  });
};

export const handleFetchUserProducts = ({
  userID,
  startAfterDoc,
  persistProducts = [],
}) => {
  return new Promise((resolve, reject) => {
    if (!userID) {
      reject();
    }
    const pageSize = 6;
    let ref = firestore
      .collection("products")
      .limit(pageSize)
      .where("productAdminUserUID", "==", userID)
      .orderBy("createdDate");
    if (startAfterDoc) ref = ref.startAfter(startAfterDoc);
    ref
      .get()
      .then((snapshot) => {
        const totalCount = snapshot.size;
        const data = [
          ...persistProducts,
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

export const handleFetchProducts = ({
  userID,
  filterType,
  startAfterDoc,
  orderBy,
  persistProducts = [],
}) => {
  return new Promise((resolve, reject) => {
    const pageSize = 8;
    let ref = firestore.collection("products");
    if (orderBy === "recent") {
      ref = ref.orderBy("createdDate", "desc");
    } else if (orderBy === "popularity") {
      ref = ref.orderBy("quantitysold", "desc");
    } else if (orderBy === "pricedesc") {
      ref = ref.orderBy("productPrice", "desc");
    } else if (orderBy === "priceasc") {
      ref = ref.orderBy("productPrice", "asc");
    } else {
      ref = ref.orderBy("createdDate", "desc");
    }
    if (filterType) ref = ref.where("productCategory", "==", filterType);
    ref = ref.limit(pageSize);
    if (startAfterDoc) ref = ref.startAfter(startAfterDoc);

    ref
      .get()
      .then((snapshot) => {
        const totalCount = snapshot.size;

        const data = [
          ...persistProducts,
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

export const handleDeleteProduct = (documentID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("products")
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
      .collection("products")
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

export const handleFetchProduct = (productID) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("products")
      .doc(productID)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          resolve({
            ...snapshot.data(),
            documentID: productID,
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
