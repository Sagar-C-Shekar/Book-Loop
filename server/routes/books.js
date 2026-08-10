const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/books - Browse all books
router.get('/', async (req, res) => {
  try {
    const { category, condition, status, search, sort, page = 1, limit = 12, seller } = req.query;
    const query = {};
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (status) query.status = status; else query.status = 'available';
    if (seller) query.seller = seller;
    if (search) query.$text = { $search: search };

    let sortObj = { createdAt: -1 };
    if (sort === 'popular') sortObj = { views: -1 };
    if (sort === 'liked') sortObj = { 'likes': -1 };
    if (sort === 'credits') sortObj = { creditValue: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [books, total] = await Promise.all([
      Book.find(query).sort(sortObj).skip(skip).limit(parseInt(limit))
        .populate('seller', 'name avatar stats.rating location'),
      Book.countDocuments(query)
    ]);

    res.json({ books, total, pages: Math.ceil(total / limit), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/books/featured
router.get('/featured', async (req, res) => {
  try {
    const books = await Book.find({ featured: true, status: 'available' })
      .limit(6).populate('seller', 'name avatar');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('seller', 'name avatar bio location stats createdAt');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/books - Create book listing
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { title, author, description, category, condition, isbn, language,
            publishedYear, pages, exchangeType, creditValue, wantedGenres, wantedBooks, tags } = req.body;

    const images = req.files?.map(f => `/uploads/${f.filename}`) || [];

    const book = await Book.create({
      title, author, description, category, condition, isbn, language,
      publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
      pages: pages ? parseInt(pages) : undefined,
      exchangeType, creditValue: parseInt(creditValue) || 20,
      wantedGenres: wantedGenres ? JSON.parse(wantedGenres) : [],
      wantedBooks, tags: tags ? JSON.parse(tags) : [],
      images, seller: req.userId
    });

    await User.findByIdAndUpdate(req.userId, { $inc: { 'stats.booksListed': 1 } });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/books/:id
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.toString() !== req.userId.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const newImages = req.files?.map(f => `/uploads/${f.filename}`) || [];
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const updates = { ...req.body, images: [...existingImages, ...newImages] };
    delete updates.existingImages;

    const updated = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/books/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.toString() !== req.userId.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/books/:id/like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const liked = book.likes.includes(req.userId);
    if (liked) book.likes.pull(req.userId);
    else book.likes.push(req.userId);
    await book.save();
    res.json({ liked: !liked, likeCount: book.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
