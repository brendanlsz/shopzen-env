import { auth } from "./../../firebase/utils";

export const handleResetPasswordAPI = (email) => {
  const config = {
    url: "https://shopzen.vercel.app/login",
  };

  return new Promise((resolve, reject) => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        resolve();
      })
      .catch(() => {
        const err = ["Email not found. Please try again."];
        reject(err);
      });
  });
};

export const handleChangeUserPassword = (password) => {
  return new Promise((resolve, reject) => {
    const user = auth.currentUser;
    user
      .updatePassword(password)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
