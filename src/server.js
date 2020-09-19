const express = require('express');
const http = require('http');
const websocket = require('socket.io');
const cors = require('cors');

const PORT = 8000;
const app = express();

const server = http.createServer(app);
const io = websocket(server);

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

module.exports = app;
