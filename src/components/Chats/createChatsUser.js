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
  console.log("create user called");
  console.log(props);

  getUser().then((user) => {
    console.log(user)
    axios
      .get("https://api.chatengine.io/users/me/", {
        headers: {
          "project-id": "896f6a0e-9b91-41ff-a3a4-4dedbfe06c10",
          "user-name": props,
          "user-secret": props,
        },
      })

      .catch(() => {
        let formdata = new FormData();
        formdata.append("email", props);
        formdata.append("username", props);
        formdata.append("secret", props);

        getFile(user.photoURL).then((avatar) => {
          formdata.append("avatar", avatar, avatar.name);
          console.log("getFile called")
          axios
            .post("https://api.chatengine.io/users", formdata, {
              headers: { "private-key": "3dfba052-b4df-4c04-a33d-18c26cfcdffd" },
            })
            .catch((error) => console.log(error));
        });
      });
  });
}
