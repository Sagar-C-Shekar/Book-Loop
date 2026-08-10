const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exchangeType: { type: String, enum: ['book', 'credits'], required: true },
  offeredBook: {
    title: String,
    author: String,
    condition: String,
    description: String,
    images: [String]
  },
  creditsOffered: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  buyerMessage: { type: String, default: '' },
  sellerResponse: { type: String, default: '' },
  deliveryInfo: {
    method: { type: String, enum: ['pickup', 'delivery', 'mail'], default: 'pickup' },
    address: String,
    contact: String,
    notes: String
  },
  completedAt: { type: Date },
  sellerRating: { type: Number, min: 1, max: 5 },
  buyerRating: { type: Number, min: 1, max: 5 },
  sellerReview: { type: String },
  buyerReview: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Exchange', exchangeSchema);
