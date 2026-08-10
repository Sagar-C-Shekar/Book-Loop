const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');
const { auth } = require('../middleware/auth');

// GET /api/credits/history
router.get('/history', auth, async (req, res) => {
  try {
    const credits = await Credit.find({ user: req.userId })
      .populate('exchange', 'book')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(credits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
