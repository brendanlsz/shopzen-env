import { takeLatest, call, all, put } from "redux-saga/effects";
import {
  auth,
  handleUserProfile,
  handleEmailUserProfile,
  getCurrentUser,
  GoogleProvider,
} from "./../../firebase/utils";
import userTypes from "./user.types";
import {
  signInSuccess,
  signOutUserSuccess,
  resetPasswordSuccess,
  userError,
} from "./user.actions";
import {
  handleResetPasswordAPI,
  handleChangeUserPassword,
  handleFindUser,
  handleFetchUserData,
} from "./user.helpers";

export function* changeUserPasswordStart({ payload }) {
  const { password, confirmPassword } = payload;
  if (password !== confirmPassword) {
    const err = ["Password Don't match"];
    yield put(userError(err));
    return;
  }
  try {
    yield handleChangeUserPassword(password);
    alert("Password changed successfully");
  } catch (err) {
    yield put(userError([err.message]));
  }
}

export function* onChangeUserPasswordStart() {
  yield takeLatest(userTypes.CHANGE_USER_PASSWORD, changeUserPasswordStart);
}

export function* getSnapshotFromEmailUserAuth(user, additionalData = {}) {
  try {
    const userRef = yield call(handleEmailUserProfile, {
      userAuth: user,
      additionalData,
    });
    const snapshot = yield userRef.get();
    yield put(
      signInSuccess({
        id: snapshot.id,
        ...snapshot.data(),
      })
    );
  } catch (err) {
    console.log(err);
  }
}

export function* getSnapshotFromUserAuth(user, additionalData = {}) {
  try {
    const userRef = yield call(handleUserProfile, {
      userAuth: user,
      additionalData,
    });
    const snapshot = yield userRef.get();
    yield put(
      signInSuccess({
        id: snapshot.id,
        ...snapshot.data(),
      })
    );
  } catch (err) {
    console.log(err);
  }
}

export function* emailSignIn({ payload: { email, password } }) {
  try {
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    yield getSnapshotFromEmailUserAuth(user);
  } catch (err) {
    yield put(userError([err.message]));
  }
}

export function* onEmailSignInStart() {
  yield takeLatest(userTypes.EMAIL_SIGN_IN_START, emailSignIn);
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield getCurrentUser();
    if (!userAuth) return;
    yield getSnapshotFromUserAuth(userAuth);
  } catch (err) {
    console.log(err);
  }
}

export function* onCheckUserSession() {
  yield takeLatest(userTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* signOutUser() {
  try {
    yield auth.signOut();
    yield put(signOutUserSuccess());
  } catch (err) {
    // console.log(err);
  }
}

export function* onSignOutUserStart() {
  yield takeLatest(userTypes.SIGN_OUT_USER_START, signOutUser);
}

export function* signUpUser({
  payload: { displayName, email, password, confirmPassword },
}) {
  if (password !== confirmPassword) {
    const err = ["Password Don't match"];
    yield put(userError(err));
    return;
  }
  try {
    yield handleFindUser(displayName);
  } catch (err) {
    yield put(userError([err.message]));
    return;
  }

  try {
    const { user } = yield auth.createUserWithEmailAndPassword(email, password).then((userCredential)=>{
      // send verification mail.
    userCredential.user.sendEmailVerification();
  })
    const additionalData = { displayName };
    yield getSnapshotFromEmailUserAuth(user, additionalData);
  } catch (err) {
    yield put(userError([err.message]));
  }
}

export function* onSignUpUserStart() {
  yield takeLatest(userTypes.SIGN_UP_USER_START, signUpUser);
}

export function* resetPassword({ payload: { email } }) {
  try {
    yield call(handleResetPasswordAPI, email);
    yield put(resetPasswordSuccess());
  } catch (err) {
    yield put(userError(err));
  }
}

export function* onResetPasswordStart() {
  yield takeLatest(userTypes.RESET_PASSWORD_START, resetPassword);
}

export function* googleSignIn() {
  try {
    const { user } = yield auth.signInWithRedirect(GoogleProvider);
    // yield getSnapshotFromUserAuth(user);
  } catch (err) {
    console.log(err);
    yield put(userError([err.msg]));
  }
}

export function* onGoogleSignInStart() {
  yield takeLatest(userTypes.GOOGLE_SIGN_IN_START, googleSignIn);
}

export function* fetchUserDataStart({ payload }) {
  try {
    const userData = yield handleFetchUserData(payload);
    yield put(signInSuccess(userData));
  } catch (err) {
    console.log(err);
  }
}

export function* onFetchUserDataStart() {
  yield takeLatest(userTypes.FETCH_USER_DATA, fetchUserDataStart);
}

export default function* userSagas() {
  yield all([
    call(onEmailSignInStart),
    call(onCheckUserSession),
    call(onSignOutUserStart),
    call(onSignUpUserStart),
    call(onResetPasswordStart),
    call(onGoogleSignInStart),
    call(onChangeUserPasswordStart),
    call(onFetchUserDataStart),
  ]);
}
