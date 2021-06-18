import { handleUserCart, firestore, auth } from "./../../firebase/utils";

export const existingCartItem = ({ prevCartItems, nextCartItem }) => {
  return prevCartItems.find(
    (cartItem) => cartItem.documentID === nextCartItem.documentID
  );
};

export const handleClearCart = () => {
  const newcart = [];
  handleUserCart(newcart);
  return newcart;
};

export const handleAddToCart = ({ prevCartItems, nextCartItem }) => {
  const quantityIncrement = 1;
  const cartItemExists = existingCartItem({ prevCartItems, nextCartItem });
  if (cartItemExists) {
    const newcart = prevCartItems.map((cartItem) =>
      cartItem.documentID === nextCartItem.documentID
        ? {
            ...cartItem,
            quantity: cartItem.quantity + quantityIncrement,
          }
        : cartItem
    );
    handleUserCart(newcart);
    return newcart;
  }

  const newcart = [
    ...prevCartItems,
    {
      ...nextCartItem,
      quantity: quantityIncrement,
    },
  ];
  handleUserCart(newcart);
  return newcart;
};

export const handleRemoveCartItem = ({ prevCartItems, cartItemToRemove }) => {
  const newCart = prevCartItems.filter(
    (item) => item.documentID !== cartItemToRemove.documentID
  );
  handleUserCart(newCart);
  return newCart;
};

export const handleReduceCartItem = ({ prevCartItems, cartItemToReduce }) => {
  const existingCartItem = prevCartItems.find(
    (cartItem) => cartItem.documentID === cartItemToReduce.documentID
  );

  if (existingCartItem.quantity === 1) {
    const newCart = prevCartItems.filter(
      (cartItem) => cartItem.documentID !== existingCartItem.documentID
    );
    handleUserCart(newCart);
    return newCart;
  }

  const newCart = prevCartItems.map((cartItem) =>
    cartItem.documentID === existingCartItem.documentID
      ? {
          ...cartItem,
          quantity: cartItem.quantity - 1,
        }
      : cartItem
  );
  handleUserCart(newCart);
  return newCart;
};

export const handleFetchCart = () => {
  return new Promise((resolve, reject) => {
    firestore
      .doc(`users/${auth.currentUser.uid}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve(doc.data().cart);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such cart!");
        }
      })
      .catch((err) => {
        console.log("Error getting cart:", err);
      });
  });
};
