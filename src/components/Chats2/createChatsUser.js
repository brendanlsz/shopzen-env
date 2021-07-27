import React, {useEffect, useState} from 'react';
import { Link, useLocation, NavLink } from "react-router-dom";
import axios from 'axios'
import firebase from 'firebase';
import { useAuth } from './authContext';

const getFile = async (url) => {
  const response = await fetch(url);
  const data = await response.blob();

  return new File([data], "userPhoto.jpg", {type: 'image/jpeg'})
}

const getUser = async () => {
  const user = firebase.auth().currentUser;
  console.log(user);
  while (user == null) {

  }
  return user;
}

export default function CreateUser(props) {
  console.log("create user no PP called");
  console.log(props);
  if (typeof props == 'undefined') {
    return;
  }

  let formdata = new FormData();
  formdata.append("email", props[0]);
  formdata.append("username", props[1]);
  formdata.append("secret", props[1]);

  axios
    .post("https://api.chatengine.io/users", formdata, {
      headers: { "private-key": {process.env.PRIVATE_KEY} },
    })
    .catch((error) => console.log(error));
}
