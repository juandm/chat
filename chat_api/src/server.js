const express = require('express');
const http = require('http');
const websocket = require('socket.io');
const cors = require('cors');

const bootstrapp = require('./setup');
const loadRoutesV1 = require('./routes/v1');
const container = require('./setup/dependencyContainer');

bootstrapp().then(() => {
  const PORT = process.env.API_PORT || 8000;

  const app = express();
  const server = http.createServer(app);
  const io = websocket(server);

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => res.send({ message: 'Server OK.' }));
  app.use('/api/v1', loadRoutesV1());

  const messageController = container.resolve('messageController');

  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join_room', (room) => {
      console.log('wanna join room', JSON.stringify(room));
      const { id, name } = room;
      socket.join(`${id}_${name.toLowerCase()}`);
    });

    socket.on('chat_message', async (message) => {
      // const timestamp = new Date().toISOString();
      const { id, name } = message.selectedChatroom;
      const roomName = `${id}_${name.toLowerCase()}`;
      console.log(`Received chat message: ${JSON.stringify(message)}`);
      const newMessage = await messageController.saveMessage(message);
      io.to(roomName).emit('notification', newMessage.data);
    });
  });

  server.listen(PORT, () => console.log(`Server is running at port: ${PORT}`));
});
