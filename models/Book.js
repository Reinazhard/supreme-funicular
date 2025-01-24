const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  available: { type: Boolean, default: true },
  category: { type: String, required: true },
  rentedBy: { type: String, default: null },
  rentedDate: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  isOverdue: { type: Boolean, default: false }
});

module.exports = mongoose.model('Book', bookSchema);