const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Credit = require('../models/Credit');
const { auth } = require('../middleware/auth');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, location });

    // Log welcome credits
    await Credit.create({
      user: user._id,
      amount: 50,
      type: 'bonus',
      reason: 'Welcome bonus credits!',
      balance: 50
    });

    const token = generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
  console.log(err);
  res.status(500).json({ message: err.message });
}
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    user.lastActive = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
  console.log(err);
  res.status(500).json({ message: err.message });
}
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (err) {
  console.log(err);
  res.status(500).json({ message: err.message });
}
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, location, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, bio, location, avatar },
      { new: true }
    );
    res.json(user);
  } catch (err) {
  console.log(err);
  res.status(500).json({ message: err.message });
}
});

// PUT /api/auth/change-password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
  console.log(err);
  res.status(500).json({ message: err.message });
}
});

module.exports = router;
