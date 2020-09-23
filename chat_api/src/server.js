const express = require('express');
const http = require('http');
const passport = require('passport');
const websocket = require('socket.io');
const cors = require('cors');

const bootstrapp = require('./setup');
const { addListener } = require('./utils/messageReceivedEmitter');
const loadRoutesV1 = require('./routes/v1');
const container = require('./setup/dependencyContainer');

bootstrapp().then((bootstrapResult) => {
  const PORT = process.env.API_PORT || 8000;

  const app = express();
  const server = http.createServer(app);
  const io = websocket(server);

  // Auth
  const { authStrategies } = bootstrapResult;
  console.log(authStrategies);
  const jwtAuthMiddleware = passport.authenticate('jwt', { session: false });
  passport.use('jwt', authStrategies.jwt);

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => res.send({ message: 'Server OK.' }));
  app.use('/api/v1', loadRoutesV1({ jwtAuth: jwtAuthMiddleware }));

  const messageController = container.resolve('messageController');

  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join_room', (room) => {
      console.log('wanna join room', JSON.stringify(room));
      const { id, name } = room;
      socket.join(`${id}_${name.toLowerCase()}`);
    });

    socket.on('chat_message', async (message) => {
      const { id, name } = message.selectedChatroom;
      const roomName = `${id}_${name.toLowerCase()}`;
      console.log(`Received chat message: ${JSON.stringify(message)}`);
      const newMessage = await messageController.receiveMessage(message);
      if (newMessage.data) {
        io.to(roomName).emit('notification', newMessage.data);
      }
    });
  });

  // handle events
  addListener('bot_message_received', (data) => {
    console.log('Bot response:', data);
    const { id, name } = data.selectedChatroom;
    const roomName = `${id}_${name.toLowerCase()}`;
    io.to(roomName).emit('notification', data);
    console.log(`emit message to room ${roomName}:`, data);
  });

  server.listen(PORT, () => console.log(`Server is running at port: ${PORT}`));
});
