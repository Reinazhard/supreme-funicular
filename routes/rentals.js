const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Add a new endpoint to get overdue books
router.get('/overdue', async (req, res) => {
  try {
    const overdueBooks = await Book.find({
      available: false,
      dueDate: { $lt: new Date() }
    });
    res.status(200).send(overdueBooks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Rent a book
router.post('/:id/rent', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    if (!book.available) return res.status(400).send('Book is already rented');
    
    const rentDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // Set due date to 14 days from now
    
    book.available = false;
    book.rentedBy = req.body.borrowerName;
    book.rentedDate = rentDate;
    book.dueDate = dueDate;
    book.isOverdue = false;
    await book.save();
    res.status(200).send(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Return a book
router.post('/:id/return', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    if (book.available) return res.status(400).send('Book is not rented');
    
    book.available = true;
    book.rentedBy = null;
    book.rentedDate = null;
    book.dueDate = null;  // Clear the due date
    await book.save();
    res.status(200).send(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
