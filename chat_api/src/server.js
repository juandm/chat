const express = require('express');
const http = require('http');
const websocket = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = websocket(server);

const bootstrapp = require('./setup');
const loadRoutesV1 = require('./routes/v1'); // eslint-disable-line global-require

bootstrapp().then(() => {
  const PORT = process.env.API_PORT || 8000;

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => res.send({ message: 'Server OK.' }));
  app.use('/api/v1', loadRoutesV1());

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
