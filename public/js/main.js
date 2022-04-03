const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit('joinroom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message', (msg) => {
  outputMessages(msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

const outputMessages = (message) => {
  const html = `
    <div class="message">
      <p class="meta">${message.username} <span>${message.time}</span></p>
      <p class="text">${message.text}</p>
    </div>
  `;

  chatMessages.insertAdjacentHTML('beforeend', html);
};

const outputRoomName = (room) => {
  roomName.textContent = room;
};

const outputUsers = (users) => {
  userList.innerHTML = `${users.map((user) => `<li>${user.username}</li>`).join('')}`;
};
