const express = require('express');
const router = express.Router();
const Exchange = require('../models/Exchange');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// POST /api/reviews/:exchangeId - Submit review
router.post('/:exchangeId', auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const exchange = await Exchange.findById(req.params.exchangeId).populate('book');
    if (!exchange || exchange.status !== 'completed')
      return res.status(400).json({ message: 'Cannot review this exchange' });

    let reviewedUserId;
    if (exchange.buyer.toString() === req.userId.toString()) {
      exchange.sellerRating = rating;
      exchange.sellerReview = review;
      reviewedUserId = exchange.seller;
    } else if (exchange.seller.toString() === req.userId.toString()) {
      exchange.buyerRating = rating;
      exchange.buyerReview = review;
      reviewedUserId = exchange.buyer;
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await exchange.save();

    // Update user's avg rating
    const user = await User.findById(reviewedUserId);
    const newCount = user.stats.reviewCount + 1;
    const newRating = ((user.stats.rating * user.stats.reviewCount) + rating) / newCount;
    user.stats.rating = Math.round(newRating * 10) / 10;
    user.stats.reviewCount = newCount;
    await user.save();

    res.json({ message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
