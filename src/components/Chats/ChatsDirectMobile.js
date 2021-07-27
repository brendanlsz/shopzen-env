import React, { useRef, useState, useEffect } from "react"

import axios from 'axios'
import { useHistory } from "react-router-dom"
import { ChatEngine, getOrCreateChat, sendMessage  } from 'react-chat-engine'
import { Link, useLocation, NavLink } from "react-router-dom";
import { getChats } from 'react-chat-engine';
import createUser from './createChatsUser';
import createUserNoPP from './createChatUserNoProfilePic'



import { ChatEngineWrapper, Socket, ChatList, ChatFeed, ChatSettings } from 'react-chat-engine'

import { Col } from 'react-grid-system'
import WithAuth from "../../hoc/withAuth";

import "./ChatsDirectMobile.css"
// import { useAuth } from "./AuthContext"
import firebase, { auth } from 'firebase'

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export default function Chats(props) {
  const {currentUserEmail, currentUserUid} = props
  const authObject = {projectID: {process.env.PROJECT_ID}, userName: `${currentUserEmail}`, userSecret: `${currentUserEmail}`}
  console.log(`${currentUserEmail}`)

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  //const { user } = useAuth();
  const history = useHistory();
  let [chatID, setChatID] = useState("");
  let [toggle, setToggle] = useState(false);
  let [count, setCount] = useState(0);


  const callback = (chat) => {
    setChatID(chat.id);
    console.log(chat.id);
    console.log("callback")
  }


  function createDirectChat(creds, str, str2) {
    getOrCreateChat(
      creds,
      {
        is_direct_chat: true,
        usernames: [`${str}`, `${currentUserEmail}`],
      },
      callback
    );
    console.log(`${str}`)
  }

  useEffect(() => {
    createDirectChat(authObject, "ShopZen support", "ShopZen support");
    setTimeout(() => createDirectChat(authObject, props.adminUserEmail, props.adminUserUid), 100);
    setTimeout(() => {
       setLoading(false)
    }, 1000)
  }, []);

  useEffect(() => {
    setTimeout(
      () => setCount(1),
      5000
    );
  }, [chatID])

  // useEffect(() => {
  //   setTimeout(createDirectChat(authObject, props.adminUserEmail, props.adminUserUid), 150);
  //   console.log("create direct chat called")
  // }, [])

  function renderChatForm(creds) {
    setTimeout(
      () => createDirectChat(creds, props.adminUserEmail, props.adminUserUid),
      200
    );
  }

  const callback1 = () => {
    console.log("auto callback");
  }

  useEffect(() => {
    const authObject1 = {projectID: {process.env.PROJECT_ID}, userName: `${currentUserEmail}`, userSecret: `${currentUserEmail}`}
    const messageObject = {'text': `<a href="${props.url}">${props.url}</a>`, 'sender_username': `${currentUserEmail}`}
    sendMessage(authObject1, chatID, messageObject, callback1)
  }, [props.url])

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
              userName={currentUserEmail}
              userSecret={currentUserEmail}
              projectID={process.env.PROJECT_ID}
              renderNewChatForm={(creds) => renderChatForm(creds)}
            />
          </div>
          <div className="chatListm">
            <ChatList activeChat={chatID} />
          </div>

          {count == 0 && (
            <div className="chatFeedm">
              <ChatFeed activeChat={chatID} />
            </div>
          )}
          {count == 1 && (
            <div className="chatFeedm">
              <ChatFeed />
            </div>
          )}
          <div className="chatSetm">
            <ChatSettings />
          </div>
        </ChatEngineWrapper>
      </div>
    </WithAuth>
  );
}
