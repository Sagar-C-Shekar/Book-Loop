const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ['earn', 'spend', 'bonus', 'refund'],
    required: true
  },
  reason: { type: String, required: true },
  exchange: { type: mongoose.Schema.Types.ObjectId, ref: 'Exchange' },
  balance: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Credit', creditSchema);
