import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthWrapper from "./../AuthWrapper";
import FormInput from "./../forms/FormInput";
import Button from "./../forms/Button";
import "./styles.scss";

import {
  changeUserPassword,
  clearUserErrors,
} from "./../../redux/User/user.actions";

const mapState = ({ user }) => ({
  currentUser: user.currentUser,
  userErr: user.userErr,
});

const ResetPassword = () => {
  const { userErr, currentUser } = useSelector(mapState);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    return () => {
      dispatch(clearUserErrors());
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(userErr) && userErr.length > 0) {
      setErrors(userErr);
    } else {
      setErrors([]);
    }
  }, [userErr]);

  const resetForm = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changeUserPassword({ password, confirmPassword }));
    resetForm();
  };

  return (
    <div className="changepassword">
      <h1>Change Password</h1>
      <div>
        <div className="errors">
          {errors.length > 0 && (
            <ul>
              {errors.map((err, index) => {
                return <li key={index}>{err}</li>;
              })}
            </ul>
          )}
        </div>
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <FormInput
          type="password"
          name="password"
          value={password}
          placeholder="New Password"
          minLength="6"
          required
          handleChange={(e) => setPassword(e.target.value)}
        />
        <FormInput
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm Password"
          minLength="6"
          required
          handleChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit">Change Password</Button>
      </form>
    </div>
  );
};

export default ResetPassword;
