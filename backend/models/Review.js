const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Store userId as a string because Supabase returns a UUID
  userId: {
    type: String,
    required: true,
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Location',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
