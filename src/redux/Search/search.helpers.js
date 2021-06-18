import { firestore } from "./../../firebase/utils.js";

export const handleStartSearch = ({
  queryType,
  searchInput,
  startAfterDoc,
}) => {
  return new Promise((resolve, reject) => {
    if (searchInput === "") {
      resolve({
        result: [],
        queryDoc: undefined,
        isLastPage: true,
      });
    }
    const pageSize = 3;
    let ref = firestore.collection(`${queryType}`).limit(pageSize);
    if (queryType === "") {
      reject("No query type given");
      console.log("No query type given");
    }
    ref = ref
      .orderBy("lowerCaseName", "asc")
      .where("lowerCaseName", ">=", searchInput.toLowerCase())
      .where("lowerCaseName", "<=", searchInput.toLowerCase() + "\uf8ff");

    if (startAfterDoc) ref = ref.startAfter(startAfterDoc);
    ref
      .get()
      .then((snapshot) => {
        const totalCount = snapshot.size;
        const data = [
          ...snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              documentID: doc.id,
            };
          }),
        ];
        resolve({
          result: data,
          isLastPage: totalCount < pageSize,
          queryDoc: snapshot.docs[totalCount - 1],
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
