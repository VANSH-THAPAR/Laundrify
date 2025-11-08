// socket.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function initSocket(io) {

  // --- Socket.io Middleware for JWT Authentication ---
  // This runs for *every* new socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token'));
    }

    try {
      // Verify the token and attach user data to the socket
      const decoded = jwt.verify(token, process.env.jwt_secret);
      socket.user = decoded; // Adds { id, name, email, roomId } to socket
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // --- Main Connection Handler ---
  io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.user.name}`);

    // --- Join a Room ---
    // We automatically place the user in a "room" based on their
    // hostel room ID from the token. This ensures they only
    // chat with their own roommates.
    socket.join(socket.user.roomId);
    
    // Optional: Notify room that user has joined
    // socket.to(socket.user.roomId).emit('serverMessage', {
    //   name: 'System',
    //   text: `${socket.user.name} has joined the chat.`
    // });

    // --- Listen for a new message from a client ---
    socket.on('clientMessage', (text) => {
      if (!text) return; // Ignore empty messages

      // Create the message object, using the authenticated user's name
      const messageData = {
        name: socket.user.name,
        text: text.substring(0, 300), // Limit message length
        time: new Date()
      };

      // --- Broadcast the message to EVERYONE in that room ---
      io.to(socket.user.roomId).emit('serverMessage', messageData);
    });

    // --- Handle disconnection ---
    socket.on('disconnect', () => {
      console.log(`A user disconnected: ${socket.user.name}`);
      // Optional: Notify room that user has left
      // socket.to(socket.user.roomId).emit('serverMessage', {
      //   name: 'System',
      //   text: `${socket.user.name} has left the chat.`
      // });
    });
  });
}

module.exports = { initSocket };