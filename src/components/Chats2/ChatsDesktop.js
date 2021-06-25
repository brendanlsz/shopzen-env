import React, { useRef, useState, useEffect } from "react"

import axios from 'axios'
import { useHistory } from "react-router-dom"
import { ChatEngine, getOrCreateChat, sendMessage  } from 'react-chat-engine'
import { Link, useLocation, NavLink } from "react-router-dom";
import { getChats } from 'react-chat-engine';
import createUserNoPP from '../Chats/createChatUserNoProfilePic'

import "./ChatsDesktop.css"
import { ChatEngineWrapper, Socket, ChatList, ChatFeed, ChatSettings } from 'react-chat-engine'
import createUser from '../Chats/createChatsUser';


import { Col } from 'react-grid-system'
import WithAuth from "../../hoc/withAuth";

// import { useAuth } from "./AuthContext"
import firebase, { auth } from 'firebase'


export default function Chats(props) {
  return (
    <WithAuth>
      <ChatEngineWrapper>
            <Socket
              userName={props.userEmail}
              userSecret={props.userEmail}
              projectID="896f6a0e-9b91-41ff-a3a4-4dedbfe06c10"
            />
            <div className="chatList">
              <ChatList />
            </div>
            <div className="chatFeed">
              <ChatFeed />
            </div>
        </ChatEngineWrapper>
    </WithAuth>
  );
}
