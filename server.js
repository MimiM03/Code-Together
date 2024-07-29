import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('codeChange', (data) => {
    socket.broadcast.emit('codeChange', data);
  });

  socket.on('languageChange', (language) => {
    socket.broadcast.emit('languageChange', language);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
