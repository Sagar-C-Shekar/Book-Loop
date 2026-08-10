const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  exchange: { type: mongoose.Schema.Types.ObjectId, ref: 'Exchange' },
  messages: [messageSchema],
  lastMessage: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
