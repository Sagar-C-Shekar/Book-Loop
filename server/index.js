const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/exchanges', require('./routes/exchanges'));
app.use('/api/users', require('./routes/users'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/credits', require('./routes/credits'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/chat', require('./routes/chat'));

// Socket.IO for real-time chat & notifications
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    connectedUsers[userId] = socket.id;
    socket.join(userId);
  });

  socket.on('send_message', (data) => {
    const { recipientId, message, senderId, conversationId } = data;
    io.to(recipientId).emit('receive_message', { message, senderId, conversationId });
  });

  socket.on('send_notification', (data) => {
    const { recipientId, notification } = data;
    io.to(recipientId).emit('new_notification', notification);
  });

  socket.on('disconnect', () => {
    Object.keys(connectedUsers).forEach(userId => {
      if (connectedUsers[userId] === socket.id) delete connectedUsers[userId];
    });
  });
});

app.set('io', io);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  );
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/')
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = { app, io };
