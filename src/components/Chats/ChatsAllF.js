import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import "./index2.css";

import { ChatEngine, getOrCreateChat } from 'react-chat-engine'

import { getUserEmail, getCurrUserEmail } from "../../firebase/utils";
import createUserNoPP from './createChatUserNoProfilePic'


import createUser from './createChatsUser';
import create from '@ant-design/icons/lib/components/IconFont';
import Header from './../Header/index';
import Footer from './../../components/Footer/index';
import AdminToolbar from '../AdminToolbar';
import { checkUserIsAdmin } from './../../Utils';


const mapState = ({ user }) => ({
  currentUser: user.currentUser,
});

const DirectChatPage = () => {
    const { currentUser } = useSelector(mapState);
    const isAdmin = checkUserIsAdmin(currentUser);

	  const [username, setUsername] = useState('')
    let [userEmail, setEmail] = useState("");
    const [loading, setLoading] = useState(true);



    const handleClick = async () => {
      try {
        let useremail = await getCurrUserEmail();
        setEmail(useremail);
        console.log(userEmail);
        createUserNoPP(useremail);
      } catch (err) {
        console.log(err);
      }
    };


    useEffect(() => {
        handleClick();  
    }, [])

    useEffect(() => {

        setTimeout(() => {
           setLoading(false)
        }, 1000)
  
      }, []);


	function createDirectChat(creds) {
		getOrCreateChat(
			creds,
			{ is_direct_chat: true, usernames: [username] },
			() => setUsername('')
		)
	}

	function renderChatForm(creds) {
        handleClick();
		return (
      <div>
        {/* <input
          type="text"
          class="rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="rounded" onClick={() => createDirectChat(creds)}>
          Create Chat
        </button> */}
      </div>
    );
	}

    if (loading) {
      handleClick();
      console.log(userEmail)
      return <div className="centerText">loading...</div>;
    }
    if (!isAdmin) {
      return (
        <div className="chats-page" height="100vh">
          <div className="nav-bar">
            <Header />
          </div>
          <div className="chat">
            <ChatEngine
              height="92vh"
              userName={userEmail}
              userSecret={userEmail}
              projectID="896f6a0e-9b91-41ff-a3a4-4dedbfe06c10"
              renderNewChatForm={(creds) => renderChatForm(creds)}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="chats-page" height="100vh">
          <div className="nav-bar-admin">
            <AdminToolbar />
            <Header />
          </div>
          <div className="chat">
            <ChatEngine
              height="88vh"
              userName={userEmail}
              userSecret={userEmail}
              projectID="896f6a0e-9b91-41ff-a3a4-4dedbfe06c10"
              renderNewChatForm={(creds) => renderChatForm(creds)}
            />
          </div>
        </div>
      );
    }
}

export default DirectChatPage;