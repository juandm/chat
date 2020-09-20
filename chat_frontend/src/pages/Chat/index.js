import React, { useState, useEffect } from 'react';
import api from '../../services/api';

import "./styles.css";

const Chat = () => {

  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    api.get(`/users/${userId}/chatrooms`)
      .then(apiResponse => {
        const rooms = apiResponse.data.data;
        setChatrooms(rooms);
      })
      .catch(error => {
        console.log(error);
      });
  });

  async function handleChatroomSelection(e) {
    alert(e)
  }

  async function handleSendMessage(e) {
    alert('send message')
  }

  return (    
    <div className="chat-container">
        <section className="chatrooms-container">
          <h3>Chatrooms</h3>
          <ul>
            {
              chatrooms.map((chatroom => (
                <li key={chatrooms.id} onClick={(e) => handleChatroomSelection(e.target.innerText)}>
                  <div className="chatroom-item">
                    <p>{chatroom.name}</p>
                  </div>
                </li>
              )))
            }
            
          </ul>
        </section>
        <section className="messages-container">
          <div className="messages">
          <h3>Messages</h3>
          </div>
          <div className="typing-container">
            <textarea></textarea>
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </section>
    </div>
  );
};

export default Chat;