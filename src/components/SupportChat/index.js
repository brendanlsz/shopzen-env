import React, { useRef, useState, useEffect } from "react"

import axios from 'axios'
import { useHistory } from "react-router-dom"
import { ChatEngine, getOrCreateChat, sendMessage  } from 'react-chat-engine'
import { Link, useLocation, NavLink } from "react-router-dom";
import { getChats } from 'react-chat-engine';
import createUserNoPP from '../Chats/createChatUserNoProfilePic'

import { ChatEngineWrapper, Socket, ChatList, ChatFeed, ChatSettings } from 'react-chat-engine'
import { NewChatForm } from 'react-chat-engine';

import createUser from '../Chats/createChatsUser';


import { Col } from 'react-grid-system'
import WithAuth from "../../hoc/withAuth";

// import { useAuth } from "./AuthContext"
import firebase, { auth } from 'firebase'


export default function Chats(props) {

  const [username, setUsername] = useState('')


  function createDirectChat(creds) {
		getOrCreateChat(
			creds,
			{ is_direct_chat: true, usernames: [username] },
			() => setUsername('')
		)
	}

  function renderChatForm(creds) {
    return (
      <div className="renderNew">
        <input
          className="renderNew"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="renderNew" onClick={() => createDirectChat(creds)}>
          Create
        </button>
      </div>
    );
  }
  
  return (
    <WithAuth>
      <ChatEngineWrapper>
        <Socket
          userName="ShopZen support"
          userSecret="ShopZen support"
          projectID={process.env.PROJECT_ID}
        />
        <div className="chatList">
          <ChatList renderNewChatForm={(creds) => renderChatForm(creds)} />
        </div>
        <div className="chatFeed">
          <ChatFeed />
        </div>
      </ChatEngineWrapper>
    </WithAuth>
  );
}
