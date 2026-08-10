const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// GET /api/notifications
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('notifications');
    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $set: { 'notifications.$[].read': true }
    });
    res.json({ message: 'All notifications marked read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', auth, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.userId, 'notifications._id': req.params.id },
      { $set: { 'notifications.$.read': true } }
    );
    res.json({ message: 'Notification marked read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
