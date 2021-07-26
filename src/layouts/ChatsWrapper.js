import React, { useEffect, useState } from "react";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import { isMobile, isDesktop, isBrowser } from "react-device-detect";
import {
  ChatEngineWrapper,
  Socket,
  ChatList,
  ChatFeed,
  ChatSettings,
  ChatEngine,
} from "react-chat-engine";
import ChatsDesktop from "./../components/Chats2/ChatsDesktop";
import ChatsMobile from "./../components/Chats2/ChatsMobile";
import chatLogo from './../assets/chat.png'

//getUserEmail
import { getUserEmail, getCurrUserEmail } from "./../firebase/utils";
import { useSelector } from "react-redux";

const mapState = (state) => ({
  currentUser: state.user.currentUser,
});

const ChatsWrapper = (props) => {
  let [clicked, setClicked] = useState(false);
  let [userEmail, setEmail] = useState("");
  let [loading, setLoading] = useState(false);
  let [user, setUser] = useState(false);
  const { currentUser } = useSelector(mapState);

  const getUser = async () => {
    try {
      let useremail = await getCurrUserEmail();
      setEmail(useremail);
      console.log(userEmail);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
    console.log("HELLOOOOOO" + userEmail);
  }, [clicked]);

  if (!currentUser) {
    return null;
  }

  if (isBrowser) {
    if (!clicked) {
      return (
        <button className="chatsButton" onClick={() => setClicked(!clicked)}>
          <img height="55px" width="55px" src={chatLogo} alt="Chats" />
        </button>
      );
    } else {
      return (
        <div id="chats-page-all">
          <button className="closeButton" onClick={() => setClicked(!clicked)}>
            x
          </button>
          <ChatsDesktop userEmail={userEmail} />
        </div>
      );
    }
  } else if (isMobile) {
    if (!clicked) {
      return (
        <button className="chatsButton" onClick={() => setClicked(!clicked)}>
          <img height="40px" width="40px" src={chatLogo} alt="Chats" />
        </button>
      );
    } else {
      return (
        <div>
          <ChatsMobile userEmail={userEmail} />
          <button
            id="chats-page-close-mobile"
            onClick={() => setClicked(!clicked)}
          >
            Close
          </button>
        </div>
      );
    }
  }
};

export default ChatsWrapper;
