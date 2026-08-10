const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  credits: { type: Number, default: 50 }, // Start with 50 welcome credits
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  stats: {
    booksListed: { type: Number, default: 0 },
    booksExchanged: { type: Number, default: 0 },
    booksAcquired: { type: Number, default: 0 },
    totalCreditsEarned: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  badges: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  notifications: [{
    message: String,
    type: { type: String, enum: ['exchange', 'credit', 'review', 'system'] },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    link: String
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
