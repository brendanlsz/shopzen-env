import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import AuthWrapper from "./../AuthWrapper";
import FormInput from "./../forms/FormInput";
import Button from "./../forms/Button";
import Loader from "./../forms/Loader";

import {
  clearUserErrors,
  fetchUserData,
  userError,
} from "../../redux/User/user.actions";
import { handleFindUser } from "./../../redux/User/user.helpers";

import "./styles.scss";
import { firestore } from "../../firebase/utils";

const mapState = ({ user }) => ({
  currentUser: user.currentUser,
  userErr: user.userErr,
});

const FirstTimeLogin = () => {
  const [userName, setUserName] = useState("");
  const [errors, setErrors] = useState([]);
  const [loader, setLoader] = useState(false);
  const { currentUser, userErr } = useSelector(mapState);
  const history = useHistory();
  const dispatch = useDispatch();

  const reset = () => {
    setUserName("");
  };

  useEffect(() => {
    return () => {
      dispatch(clearUserErrors());
    };
  }, []);

  useEffect(() => {
    if (currentUser.userName) {
      reset();
      history.push("/");
    }
  }, [currentUser]);

  useEffect(() => {
    if (Array.isArray(userErr) && userErr.length > 0) {
      setErrors(userErr);
      setLoader(false);
    } else {
      setErrors([]);
    }
  }, [userErr]);

  const configAuthWrapper = {
    headline: "First Time Login",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      await handleFindUser(userName);
      await firestore
        .doc(`users/${currentUser.id}`)
        .update({ userName: userName });
      alert("Username set successfully");
      dispatch(fetchUserData(currentUser.id));
      history.push("/");
    } catch (err) {
      dispatch(userError([err.message]));
      setLoader(false);
    }
  };

  return (
    <div className="firsttimelogin">
      <AuthWrapper {...configAuthWrapper}>
        <p>
          We have detected that this is your first time logging in to our
          website and you do not have a username yet. Please choose a username
          of your choice
        </p>
        <div className="errors">
          {errors.length > 0 && (
            <ul>
              {errors.map((err, index) => {
                return <li key={index}>{err}</li>;
              })}
            </ul>
          )}
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <FormInput
            type="text"
            name="userName"
            value={userName}
            placeholder="Username"
            required
            handleChange={(e) => setUserName(e.target.value)}
          ></FormInput>
          {loader ? (
            <Loader>Setting up username...</Loader>
          ) : (
            <div className="mt-3">
              <Button type="submit">Submit</Button>
            </div>
          )}
        </form>
      </AuthWrapper>
    </div>
  );
};

export default FirstTimeLogin;
