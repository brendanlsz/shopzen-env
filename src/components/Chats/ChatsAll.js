import React, { useRef, useState, useEffect } from "react";

import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatEngine, getOrCreateChat } from "react-chat-engine";
import { Link, useLocation, NavLink } from "react-router-dom";

import { useAuth } from "../../customHooks";
import firebase from "firebase";
import "./index2.css";
import { getUserEmail, getCurrUserEmail } from "../../firebase/utils";


// import { useAuth } from "./AuthContext"
// import firebase from 'firebase'

export default function ChatsAll(props) {
  const [username, setUsername] = useState("");
  const { user } = useAuth();
  const history = useHistory();
  let [userEmail, setEmail] = useState("");

  const handleClick = async () => {
    try {
      let useremail = await getCurrUserEmail();
      setEmail(useremail);
      console.log(userEmail)
    } catch (err) {
      console.log(err);
    }
  };

  function createDirectChat(creds, str, str2) {
    getOrCreateChat(creds, { is_direct_chat: true, usernames: [str] }, () =>
      setUsername("")
    );
  }

  function renderChatForm(creds) {
    handleClick();
    return (
      <div>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={() =>
            createDirectChat(creds, props.adminUserEmail, props.adminUserUid)
          }
        >
          Create
        </button>
      </div>
    );
  }

  return (
    <div className="chats-page">
      <div className="nav-bar">
        <div className="logo-tab">ShopZen Chat</div>
      </div>
      <div className="chat">
        <ChatEngine
          height="100vh"
          userName={userEmail}
          userSecret={userEmail}
          projectID="896f6a0e-9b91-41ff-a3a4-4dedbfe06c10"
          renderNewChatForm={(creds) => renderChatForm(creds)}
        />
      </div>
    </div>
  );
}