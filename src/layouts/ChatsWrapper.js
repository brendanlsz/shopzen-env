import React, { useEffect, useState } from 'react'
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import { ChatEngineWrapper, Socket, ChatList, ChatFeed, ChatSettings } from 'react-chat-engine'
import './../../src/chatsStyle.scss'

//getUserEmail
import { getUserEmail, getCurrUserEmail } from "./../firebase/utils";

const ChatsWrapper = (props) => {
  let [clicked, setClicked] = useState(false);
  let [userEmail, setEmail] = useState("");
  let [loading, setLoading] = useState(false);

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
    
  }, [clicked])


  if(!clicked) {
    return (
      <button className="chatsButton" onClick={() => setClicked(!clicked)}>
        Chats
      </button>
    );
  } else {
    return (
      <div id="chats-page-all">
        <button className="chatsButton" onClick={() => setClicked(!clicked)}>
          Close
        </button>
        <ChatEngineWrapper>
          <Socket
            height="100vh"
            userName={userEmail}
            userSecret={userEmail}
            projectID="896f6a0e-9b91-41ff-a3a4-4dedbfe06c10"
          />
          <div className="chatList">
            <ChatList />
          </div>
          <div className="chatFeed">
            <ChatFeed />
          </div>
        </ChatEngineWrapper>
      </div>
    );
  }
};

export default ChatsWrapper;
