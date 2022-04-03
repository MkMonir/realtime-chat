const users = [];

// note: Join User To Chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);

  return user;
};

// note: Get Current User
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// note: User Leave Chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// note: Get Room Users
const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
