let io;

const setupWebSocket = (server) => {
  const socketIO = require('socket.io');
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected via WebSocket');

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

const broadcastNewPoll = (poll) => {
  if (io) {
    io.emit('newPoll', poll); // Broadcast to all connected clients
  }
};

// Function to broadcast leaderboard update
const broadcastLeaderboardUpdate = (leaderboard) => {
  io.emit('leaderboard_update', leaderboard);
};

module.exports = {
  setupWebSocket,
  broadcastNewPoll,
  broadcastLeaderboardUpdate
};
