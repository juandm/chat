import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import api from '../../services/api';
import "./styles.css";

let socket = null;

const Chat = () => {
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const [chatrooms, setChatrooms] = useState([]);
  const [selectedChatroom, setSelectedChatroom] = useState({});
  const [message, setMessage] = useState('');
  const [lastMessage, setLastMessage] = useState({});
  const [messages, setMessages] = useState([
    {id:1, content: 'hola'},
    {id:2, content: 'hola'},
    {id:3, content: 'como estas'},
  ]);

  useEffect(() => {
    socket = io('localhost:7000');
    socket.on('notification', (message) => {
      console.log('server', message);
      setLastMessage(message)
      setMessages([...messages, message])
    });
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    api.get(`/users/${userId}/chatrooms`)
      .then(apiResponse => {
        const rooms = apiResponse.data.data;
        setChatrooms(rooms);
        setSelectedChatroom(rooms[0]);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  async function handleChatroomSelection(e) {
    const selectedRoom = chatrooms.find(chatroom => chatroom.name.toLowerCase() === e.innerText.toLowerCase())
    setSelectedChatroom(selectedRoom);
    socket.emit('join_room', selectedChatroom);
  }

  async function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  async function handleSendMessage(e) {
    const token = localStorage.getItem('token');
    socket.emit('chat_message', {
      selectedChatroom,
      userId,
      content: message,
      token
    });
    setMessage('');
  }

  return (    
    <div className="chat-container">
      <section className="chatrooms-container">
      <div className="chatrooms-header"><h3>Chatrooms of {username}</h3></div>
        <ul>
          {
            chatrooms.map(((chatroom, idx) => (
              <li key={`${chatrooms.id}-${idx}`} onClick={(e) => handleChatroomSelection(e.target)}>
                <div className="chatroom-item">
                  <p data-chatroom_id = {chatrooms.id}>{chatroom.name}</p>
                </div>
              </li>
            )))
          }
          
        </ul>
      </section>
      <section className="messages-container">
        <div className="messages-header">
          <h3>Messages of { selectedChatroom.name } chatroom</h3>
        </div>
        <div className="messages">
          {messages.map((message, idx) => (
            <div className="chat-message" key={`${message.id}-${idx}`}>
              <p>{message.content}</p>
            </div>
          ))}
        <div className="my-chat-message">
          <p>heeyy</p>
        </div>
        </div>
        <div className="typing-container">
          <textarea 
            onChange={(e) => handleMessageChange(e)}
            value={message}
            ></textarea>
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </section>
    </div>
  );
};

export default Chat;