const express = require('express');
const http = require('http');
const websocket = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = websocket(server);

const bootstrapp = require('./setup');

bootstrapp().then(() => {
  const PORT = process.env.API_PORT || 8000;

  app.use(cors());
  app.get('/', (req, res) => res.send({ message: 'Server OK.' }));

  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('chat_message', (message) => {
      console.log(`Received chat message: ${message}`);
      const timestamp = new Date().toISOString();
      io.emit('chat_message', { timestamp, data: message });
    });
  });

  server.listen(PORT, () => console.log(`Server is running at port: ${PORT}`));
});
