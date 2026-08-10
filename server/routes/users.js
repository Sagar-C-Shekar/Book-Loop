const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const { auth } = require('../middleware/auth');

// GET /api/users/:id - Public profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -notifications');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const books = await Book.find({ seller: req.params.id }).sort({ createdAt: -1 }).limit(10);
    res.json({ user, books });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id/books
router.get('/:id/books', async (req, res) => {
  try {
    const books = await Book.find({ seller: req.params.id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
