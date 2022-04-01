const path = require('path');
const http = require('http');
const dotenv = require('dotenv');
const express = require('express');
const socketio = require('socket.io');

dotenv.config({ path: './config.env' });

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
