import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
// import { firestore } from "./../../firebase/utils";
import { fetchCart } from "./../../redux/Cart/cart.actions";
import {
  emailSignInStart,
  googleSignInStart,
  // resetUserState,
  clearUserErrors,
} from "./../../redux/User/user.actions";

import "./styles.scss";

import AuthWrapper from "./../AuthWrapper";
import FormInput from "./../forms/FormInput";
import Buttons from "./../forms/Button";
import Loader from "./../forms/Loader";

import googleLogo from "./../../assets/google-logo.png";

const mapState = ({ user }) => ({
  currentUser: user.currentUser,
  userErr: user.userErr,
});

const SignIn = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentUser, userErr } = useSelector(mapState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loggingin, setLoggingin] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearUserErrors());
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      resetForm();
      history.push("/");
    }
  }, [currentUser]);

  useEffect(() => {
    if (Array.isArray(userErr) && userErr.length > 0) {
      setErrors(userErr);
      setLoggingin(false);
    } else {
      setErrors([]);
    }
  }, [userErr]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setErrors([]);
    setLoggingin(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggingin(true);
    dispatch(emailSignInStart({ email, password }));
  };

  const handleGoogleSignIn = () => {
    setLoggingin(true);
    dispatch(googleSignInStart());
  };

  const configAuthWrapper = {
    headline: "Log In",
  };

  return (
    <AuthWrapper {...configAuthWrapper}>
      <div>
        <p>Key in your details below</p>
        <div className="errors">
          {errors.length > 0 && (
            <ul>
              {errors.map((err, index) => {
                return <li key={index}>{err}</li>;
              })}
            </ul>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <FormInput
            type="email"
            name="email"
            required
            value={email}
            placeholder="Email"
            handleChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            type="password"
            name="password"
            required
            value={password}
            placeholder="Password"
            handleChange={(e) => setPassword(e.target.value)}
          />
          <p>
            Forgot password? Reset it <Link to="/recovery">here</Link>
          </p>
          <div
            className={`form-button mt-3 justify-content-center ${
              loggingin ? "hidden" : ""
            }`}
          >
            <Buttons id="submit" type="submit">
              Login
            </Buttons>
          </div>
          <Loader className={`${loggingin ? "" : "hidden"}`}>
            Logging in...
          </Loader>

          <p className="text-center my-4">Or</p>
          <div className="d-flex justify-content-center ">
            <div
              className="btn btn-lg btn-outline-dark loginbtn"
              onClick={handleGoogleSignIn}
            >
              <img src={googleLogo} alt="googlelogo"></img>
              Sign in with Google
            </div>
          </div>

          <hr></hr>
          <div className="d-flex justify-content-center">
            <p className="d-flex align-items-center flex-direction: column">
              Don't have an account?
            </p>
          </div>

          <Link to="/registration">
            <Buttons className="btnblock">Register Here</Buttons>
          </Link>
        </form>
      </div>
    </AuthWrapper>
  );
};

export default SignIn;
