import { auth } from "./../../firebase/utils";

export const handleResetPasswordAPI = (email) => {
  const config = {
    url: "https://shopzen-milestone2.vercel.app/login",
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
