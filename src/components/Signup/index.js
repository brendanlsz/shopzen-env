import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  signUpUserStart,
  clearUserErrors,
} from "./../../redux/User/user.actions";
import "./styles.scss";

import AuthWrapper from "./../AuthWrapper";
import FormInput from "./../forms/FormInput";
import Button from "./../forms/Button";
import Loader from "./../forms/Loader";

const mapState = ({ user }) => ({
  currentUser: user.currentUser,
  userErr: user.userErr,
});

const Signup = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentUser, userErr } = useSelector(mapState);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearUserErrors());
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      reset();
      history.push("/");
    }
  }, [currentUser]);

  useEffect(() => {
    if (Array.isArray(userErr) && userErr.length > 0) {
      setErrors(userErr);
      setRegistering(false);
    } else {
      setErrors([]);
    }
  }, [userErr]);

  const reset = () => {
    setDisplayName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors([]);
    setRegistering(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setRegistering(true);
    dispatch(
      signUpUserStart({
        displayName,
        email,
        password,
        confirmPassword,
      })
    );
  };

  const configAuthWrapper = {
    headline: "Registration",
  };

  return (
    <AuthWrapper {...configAuthWrapper}>
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

        <form onSubmit={handleFormSubmit}>
          <FormInput
            type="text"
            name="displayName"
            value={displayName}
            placeholder="Username"
            required
            handleChange={(e) => setDisplayName(e.target.value)}
          />

          <FormInput
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            required
            handleChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            type="password"
            name="password"
            value={password}
            placeholder="Password"
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

          <div className={`mt-3 ${registering ? "hidden" : ""}`}>
            <Button type="submit">Register</Button>
          </div>
          <Loader className={`${registering ? "" : "hidden"}`}>
            Registering...
          </Loader>
        </form>

        {/* <div className="links">
          <Link to="/login">LogIn</Link>
          {` | `}
          <Link to="/recovery">Reset Password</Link>
        </div> */}
      </div>
    </AuthWrapper>
  );
};

export default Signup;
