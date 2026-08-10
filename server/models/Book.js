const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  isbn: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology',
           'Philosophy', 'Romance', 'Mystery', 'Fantasy', 'Self-Help', 'Business',
           'Children', 'Young Adult', 'Poetry', 'Comics', 'Other'],
    required: true
  },
  condition: {
    type: String,
    enum: ['Like New', 'Very Good', 'Good', 'Fair', 'Poor'],
    required: true
  },
  images: [{ type: String }],
  language: { type: String, default: 'English' },
  publishedYear: { type: Number },
  pages: { type: Number },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exchangeType: {
    type: String,
    enum: ['book', 'credits', 'both'],
    default: 'both'
  },
  creditValue: { type: Number, default: 20 },
  wantedGenres: [{ type: String }],
  wantedBooks: { type: String, default: '' },
  status: {
    type: String,
    enum: ['available', 'pending', 'exchanged'],
    default: 'available'
  },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: String }],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ category: 1, condition: 1, status: 1 });

module.exports = mongoose.model('Book', bookSchema);
