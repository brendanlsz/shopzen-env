import React, { useRef, useState, useEffect } from "react";

import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatEngine, getOrCreateChat, sendMessage } from "react-chat-engine";
import { Link, useLocation, NavLink } from "react-router-dom";
import { getChats } from "react-chat-engine";
import createUser from "./createChatsUser";
import createUserNoPP from "./createChatUserNoProfilePic";

import {
  ChatEngineWrapper,
  Socket,
  ChatList,
  ChatFeed,
  ChatSettings,
} from "react-chat-engine";

import { Col } from "react-grid-system";
import WithAuth from "../../hoc/withAuth";

import "./ChatsMobile.css";
// import { useAuth } from "./AuthContext"
import firebase, { auth } from "firebase";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

export default function Chats(props) {
  const { currentUserEmail, currentUserUid } = props;
  const authObject = {projectID: {process.env.PROJECT_ID}, userName: `${props.userEmail}`, userSecret: `${props.userEmail}`}
  console.log(`${currentUserEmail}`);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  //const { user } = useAuth();
  const history = useHistory();
  let [chatID, setChatID] = useState("");
  let [toggle, setToggle] = useState(0);

  const callback = (chat) => {
    console.log(chat.id);
    console.log("callback")
  }

  function createDirectChat(creds, str, str2) {
    getOrCreateChat(
      creds,
      {
        is_direct_chat: true,
        usernames: [`${str}`, `${props.userEmail}`],
      },
      callback
    );
    console.log(`${str}`)
  }
  
  useEffect(() => {
    setTimeout(
      () =>
        createDirectChat(authObject, props.adminUserEmail, props.adminUserUid),
      100
    );
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    createDirectChat(authObject, "ShopZen support", "ShopZen support");
  }, [props.userEmail])

  function renderChatForm(creds) {
    setTimeout(
      () => createDirectChat(creds, props.adminUserEmail, props.adminUserUid),
      200
    );
  }

  // useEffect(() => {
  //   setTimeout(createDirectChat("", props.adminUserEmail, props.adminUserUid), 250);
  //   console.log(chatID)
  // }, [chatID])

  if (loading) {
    return <div className="centerText"></div>;
  }
  return (
    <WithAuth>
      <div id="chats-page-mobile">
        <ChatEngineWrapper>
          <div>
            <Socket
              height="100vh"
              userName={props.userEmail}
              userSecret={props.userEmail}
              projectID={process.env.PROJECT_ID}
              renderNewChatForm={(creds) => renderChatForm(creds)}
            />
            {/* initial state */}
            {toggle == 0 && (
              <div className="chatMobileWrap">
                <button onClick={() => setToggle(1)}>
                  <div className="chatMobileButton">
                    <ChatList />
                  </div>
                </button>
              </div>
            )}
            {/* render normal chat */}
            {toggle == 1 && (
              <div>
                <div className="chatListm">
                  <ChatList />
                </div>
                <div className="chatFeedm">
                  <ChatFeed />
                </div>
                <div className="chatSetm">
                  <ChatSettings />
                </div>
              </div>
            )}
          </div>
        </ChatEngineWrapper>
      </div>
    </WithAuth>
  );
}
