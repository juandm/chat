import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FiSend } from "react-icons/fi";

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  useEffect(() => {
    socket = io(config.BASE_URL);
    socket.on('notification', (receivedMessage) => {
      if(receivedMessage.isBotMessage) {
        receivedMessage.name = 'StockBot';
        receivedMessage.userId = -1;
      }      
      setMessages(msgs => [receivedMessage, ...msgs])
    });
  }, []);

  // get chatrooms and last messages
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
  

  async function handleChatroomSelection(e) {
    // e.style.fontWeight = 'bold';
    const selectedRoom = chatrooms.find(chatroom => chatroom.name.toLowerCase() === e.innerText.toLowerCase())
    setSelectedChatroom(selectedRoom);
    socket.emit('join_room', selectedRoom);
    const roomMessages = await roomService.getChatroomMessages(selectedRoom.id);
    setMessages(roomMessages || []);
  }
 
  async function handleSendMessage() {
    if(message.length > 0 ) {
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
  }
  
  async function handleMessageChange(e) {
    setMessage(e.target.value);
    setIsButtonDisabled(message.length === 0);
  }

  const onKeyDownHandler = e => {
    if (e.keyCode === 13) {
      handleSendMessage();
    }
  };

  function getMessageOwner(message) {
    const loggedUserId = parseInt(localStorage.getItem('userId'), 10);
    const messageOwner = parseInt(message.userId, 10);
    if (loggedUserId === messageOwner) {
      return 'my-chat-message'
    } else {
      return 'chat-message'
    };
  }

  function buildMessageItem(message, idx) {
    const owner = getMessageOwner(message);
    const chatOwnerName = message.isBotMessage ? 'StockBot' : message.username;
    return (
      <div className={owner} key={`${message.id}-${idx}`}>
        { 
          owner === 'chat-message' ? 
          <span className="chat-owner-name">{chatOwnerName}</span>
          : ''
        }
        <p>{message.content}</p>
        <span className="message-timestamp">{message.createdAt.split('T')[1].slice(0, 5)}</span>
      </div>)
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
          {messages.map((message, idx) => (buildMessageItem(message, idx)))}
        </div>
        <div className="typing-container">
          <textarea 
            onChange={handleMessageChange}
            onKeyDown={onKeyDownHandler}
            value={message}
            ></textarea>
          <button onClick={handleSendMessage} disabled={isButtonDisabled}><FiSend size={20} color="#FFF" /></button>
        </div>
      </section>
    </div>
  );
};

export default Chat;