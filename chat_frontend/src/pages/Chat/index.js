import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import roomService from '../../services/chatroomService';
import userService from '../../services/userServices';
import config from "../../utils/config";
import "./styles.css";

let socket = null;

const Chat = () => {
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const [chatrooms, setChatrooms] = useState([]);
  const [selectedChatroom, setSelectedChatroom] = useState({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io(config.BASE_URL);
    socket.on('notification', (message) => {
      setMessages(msgs => [message, ...msgs])
    });
  }, [messages]);

  // get chatrooms
  useEffect(() => {
    async function getData() {
      const userId = localStorage.getItem('userId');
      const rooms = await userService.getUserChatrooms(userId);
      setChatrooms(rooms);
      setSelectedChatroom(rooms[0]);
      const roomMessages = await roomService.getChatroomMessages(rooms[0].id);
      console.log('roomMessages', roomMessages);
      setMessages(roomMessages);
    }
    getData();
  }, []);
  
  // get las messages
  useEffect(() => {
    
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
      username,
      content: message,
      token
    });
    setMessage('');
  }

  function getMessageOwner(message) {
    const loggedUserId = parseInt(localStorage.getItem('userId'), 10);
    const messageOwner = parseInt(message.userId, 10);
    if (loggedUserId === messageOwner) {
      return 'my-chat-message'
    } else {
      return 'chat-message'
    };
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
            <div className={getMessageOwner(message)} key={`${message.id}-${idx}`}>
              {getMessageOwner(message) === 'chat-message' ? 
                <span className="chat-owner-name">{message.username}</span>
                : ''
              }
              <p>{message.content}</p>
              <span className="message-timestamp">{message.createdAt.split('T')[1].slice(0, 5)}</span>
            </div>
          ))}
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