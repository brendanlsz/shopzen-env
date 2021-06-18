import React, { useEffect, useState } from 'react'

import "./index2.css";

import { ChatEngine, getOrCreateChat } from 'react-chat-engine'

import { getUserEmail, getCurrUserEmail } from "../../firebase/utils";

import createUser from './createChatsUser';
import create from '@ant-design/icons/lib/components/IconFont';


const DirectChatPage = () => {
	const [username, setUsername] = useState('')
    let [userEmail, setEmail] = useState("");
    const [loading, setLoading] = useState(true);



    const handleClick = async () => {
      try {
        let useremail = await getCurrUserEmail();
        setEmail(useremail);
        console.log(userEmail);
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
				<input 
					placeholder='Username' 
					value={username} 
					onChange={(e) => setUsername(e.target.value)} 
				/>
				<button onClick={() => createDirectChat(creds)}>
					Create
				</button>
			</div>
		)
	}

    if (loading) {
      handleClick();
      console.log(userEmail)
      return <div>loading...</div>;
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

export default DirectChatPage;