const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true },
}, { _id: false });

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true , set: (v) => v?.trim()},
  author: { type: String, required: true , set: (v) => v?.trim()},
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true , set: (v) => v.trim()},
  ratings: [ratingSchema],
  averageRating: { type: Number, required: true },
});

module.exports = mongoose.model('Book', bookSchema);