const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/leaderboard/sellers
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await User.find({})
      .select('name avatar stats location badges createdAt')
      .sort({ 'stats.booksExchanged': -1, 'stats.booksListed': -1 })
      .limit(20);
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/leaderboard/buyers
router.get('/buyers', async (req, res) => {
  try {
    const buyers = await User.find({})
      .select('name avatar stats location badges createdAt')
      .sort({ 'stats.booksAcquired': -1, 'stats.totalCreditsEarned': -1 })
      .limit(20);
    res.json(buyers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/leaderboard/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalBooks, totalExchanges] = await Promise.all([
      User.countDocuments(),
      require('../models/Book').countDocuments(),
      require('../models/Exchange').countDocuments({ status: 'completed' })
    ]);
    res.json({ totalUsers, totalBooks, totalExchanges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
