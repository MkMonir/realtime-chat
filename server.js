const path = require('path');
const http = require('http');
const dotenv = require('dotenv');
const express = require('express');
const socketio = require('socket.io');
const formateMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

dotenv.config({ path: './config.env' });
app.use(express.static(path.join(__dirname, 'public')));

// note: Run When Client Connect

const botName = 'Chatcord Bot';

io.on('connection', (socket) => {
  socket.on('joinroom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit('message', formateMessage(botName, 'Welcome to chatcord'));

    // Send Users And Room Info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    socket.broadcast
      .to(user.room)
      .emit('message', formateMessage(botName, `${user.username} has joined chatcord`));
  });

  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formateMessage(user.username, msg));
  });

  // note: Run when a user left the chatcord
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formateMessage(botName, `${user.username} has left the chat`)
      );

      // Send Users And Room Info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server successfully running on port ${PORT}`));
