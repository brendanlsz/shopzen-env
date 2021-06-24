import { firestore } from "./../../firebase/utils";
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
        console.log(data);
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
      .limit(4)
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
  persistProducts = [],
}) => {
  return new Promise((resolve, reject) => {
    const pageSize = 6;
    let ref = firestore.collection("products").orderBy("createdDate", "desc");
    if (filterType) ref = ref.where("productCategory", "==", filterType);
    ref = ref.limit(pageSize);
    if (startAfterDoc) ref = ref.startAfter(startAfterDoc);

    ref
      .get()
      .then((snapshot) => {
        console.log(snapshot);
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
        console.log(documentID, 2);
        resolve();
      })
      .catch((err) => {
        reject(err);
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
