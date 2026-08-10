const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { auth } = require('../middleware/auth');

router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.userId })
      .populate('participants', 'name avatar')
      .populate('book', 'title images')
      .sort({ lastMessage: -1 });
    res.json(conversations);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('participants', 'name avatar')
      .populate('book', 'title images author');
    if (!conversation) return res.status(404).json({ message: 'Not found' });
    if (!conversation.participants.some(p => p._id.toString() === req.userId.toString()))
      return res.status(403).json({ message: 'Not authorized' });
    res.json(conversation);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/start', auth, async (req, res) => {
  try {
    const { recipientId, bookId, message } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, recipientId] },
      book: bookId
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.userId, recipientId],
        book: bookId,
        messages: []
      });
    }
    if (message) {
      conversation.messages.push({ sender: req.userId, content: message });
      conversation.lastMessage = new Date();
      await conversation.save();
    }
    await conversation.populate('participants', 'name avatar');
    await conversation.populate('book', 'title images author');
    res.status(201).json(conversation);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:conversationId/message', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ message: 'Not found' });
    if (!conversation.participants.some(p => p.toString() === req.userId.toString()))
      return res.status(403).json({ message: 'Not authorized' });
    conversation.messages.push({ sender: req.userId, content });
    conversation.lastMessage = new Date();
    await conversation.save();
    const io = req.app.get('io');
    const recipientId = conversation.participants.find(p => p.toString() !== req.userId.toString());
    if (io && recipientId) {
      io.to(recipientId.toString()).emit('receive_message', {
        conversationId: conversation._id,
        message: { sender: req.userId, content, createdAt: new Date() }
      });
    }
    res.json({ message: 'Sent' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
