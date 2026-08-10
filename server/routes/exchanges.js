const express = require('express');
const router = express.Router();
const Exchange = require('../models/Exchange');
const Book = require('../models/Book');
const User = require('../models/User');
const Credit = require('../models/Credit');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/exchanges - Get user's exchanges (as buyer or seller)
router.get('/', auth, async (req, res) => {
  try {
    const { role, status } = req.query;
    const query = {};
    if (role === 'seller') query.seller = req.userId;
    else if (role === 'buyer') query.buyer = req.userId;
    else query.$or = [{ seller: req.userId }, { buyer: req.userId }];
    if (status) query.status = status;

    const exchanges = await Exchange.find(query)
      .populate('book', 'title author images condition')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(exchanges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/exchanges/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id)
      .populate('book')
      .populate('buyer', 'name avatar email')
      .populate('seller', 'name avatar email');
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });
    res.json(exchange);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/exchanges - Request an exchange
router.post('/', auth, upload.array('offeredBookImages', 3), async (req, res) => {
  try {
    const { bookId, exchangeType, buyerMessage, deliveryMethod, deliveryAddress,
            deliveryContact, deliveryNotes, offeredBookTitle, offeredBookAuthor,
            offeredBookCondition, offeredBookDescription, creditsOffered } = req.body;

    const book = await Book.findById(bookId).populate('seller');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.status !== 'available') return res.status(400).json({ message: 'Book not available' });
    if (book.seller._id.toString() === req.userId.toString())
      return res.status(400).json({ message: 'Cannot request your own book' });

    // Validate credits
    if (exchangeType === 'credits') {
      const buyer = await User.findById(req.userId);
      const credits = parseInt(creditsOffered) || book.creditValue;
      if (buyer.credits < credits)
        return res.status(400).json({ message: `Insufficient credits. You have ${buyer.credits}, need ${credits}` });
    }

    const offeredBookImages = req.files?.map(f => `/uploads/${f.filename}`) || [];

    const exchange = await Exchange.create({
      book: bookId,
      seller: book.seller._id,
      buyer: req.userId,
      exchangeType,
      offeredBook: exchangeType === 'book' ? {
        title: offeredBookTitle,
        author: offeredBookAuthor,
        condition: offeredBookCondition,
        description: offeredBookDescription,
        images: offeredBookImages
      } : undefined,
      creditsOffered: exchangeType === 'credits' ? parseInt(creditsOffered) || book.creditValue : 0,
      buyerMessage,
      deliveryInfo: {
        method: deliveryMethod || 'pickup',
        address: deliveryAddress,
        contact: deliveryContact,
        notes: deliveryNotes
      }
    });

    // Mark book as pending
    await Book.findByIdAndUpdate(bookId, { status: 'pending' });

    // Notify seller
    await User.findByIdAndUpdate(book.seller._id, {
      $push: {
        notifications: {
          message: `New exchange request for "${book.title}"`,
          type: 'exchange',
          link: `/exchanges/${exchange._id}`
        }
      }
    });

    const io = req.app.get('io');
    if (io) {
      io.to(book.seller._id.toString()).emit('new_notification', {
        message: `New exchange request for "${book.title}"`,
        type: 'exchange'
      });
    }

    const populated = await Exchange.findById(exchange._id)
      .populate('book', 'title author images')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/exchanges/:id/respond - Seller accepts/rejects
router.put('/:id/respond', auth, async (req, res) => {
  try {
    const { action, sellerResponse } = req.body;
    const exchange = await Exchange.findById(req.params.id).populate('book');
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });
    if (exchange.seller.toString() !== req.userId.toString())
      return res.status(403).json({ message: 'Not authorized' });

    exchange.sellerResponse = sellerResponse || '';

    if (action === 'accept') {
      exchange.status = 'accepted';
      // Notify buyer
      await User.findByIdAndUpdate(exchange.buyer, {
        $push: {
          notifications: {
            message: `Your exchange request for "${exchange.book.title}" was accepted!`,
            type: 'exchange',
            link: `/exchanges/${exchange._id}`
          }
        }
      });
    } else if (action === 'reject') {
      exchange.status = 'rejected';
      await Book.findByIdAndUpdate(exchange.book._id, { status: 'available' });
      await User.findByIdAndUpdate(exchange.buyer, {
        $push: {
          notifications: {
            message: `Your exchange request for "${exchange.book.title}" was declined.`,
            type: 'exchange',
            link: `/exchanges/${exchange._id}`
          }
        }
      });
    }

    await exchange.save();
    res.json(exchange);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/exchanges/:id/complete - Mark as completed
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id).populate('book');
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });
    if (exchange.seller.toString() !== req.userId.toString() &&
        exchange.buyer.toString() !== req.userId.toString())
      return res.status(403).json({ message: 'Not authorized' });

    exchange.status = 'completed';
    exchange.completedAt = new Date();
    await exchange.save();

    // Mark book as exchanged
    await Book.findByIdAndUpdate(exchange.book._id, { status: 'exchanged' });

    // Award credits to seller (30 credits per exchange)
    const seller = await User.findById(exchange.seller);
    seller.credits += 30;
    seller.stats.booksExchanged += 1;
    await seller.save();

    await Credit.create({
      user: exchange.seller,
      amount: 30,
      type: 'earn',
      reason: `Book exchanged: "${exchange.book.title}"`,
      exchange: exchange._id,
      balance: seller.credits
    });

    // Update buyer stats
    const buyer = await User.findById(exchange.buyer);
    buyer.stats.booksAcquired += 1;

    if (exchange.exchangeType === 'credits') {
      buyer.credits -= exchange.creditsOffered;
      seller.credits += exchange.creditsOffered;
      await seller.save();

      await Credit.create({
        user: exchange.buyer,
        amount: -exchange.creditsOffered,
        type: 'spend',
        reason: `Acquired: "${exchange.book.title}"`,
        exchange: exchange._id,
        balance: buyer.credits
      });
    }

    await buyer.save();

    // Notify both parties
    const notif = { message: `Exchange for "${exchange.book.title}" completed!`, type: 'exchange' };
    await User.findByIdAndUpdate(exchange.seller, { $push: { notifications: { ...notif, link: `/exchanges/${exchange._id}` } } });
    await User.findByIdAndUpdate(exchange.buyer, { $push: { notifications: { ...notif, link: `/exchanges/${exchange._id}` } } });

    res.json(exchange);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/exchanges/:id/cancel
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) return res.status(404).json({ message: 'Not found' });
    if (exchange.buyer.toString() !== req.userId.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (!['pending', 'accepted'].includes(exchange.status))
      return res.status(400).json({ message: 'Cannot cancel this exchange' });

    exchange.status = 'cancelled';
    await exchange.save();
    await Book.findByIdAndUpdate(exchange.book, { status: 'available' });
    res.json(exchange);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
