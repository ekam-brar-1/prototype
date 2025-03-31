const express = require('express');
const router = express.Router();
const Review = require('../models/Review');


router.post('/', async (req, res) => {
  const { userId, placeId, rating, comment } = req.body;
  try {
    const review = new Review({ userId, placeId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post review' });
  }
});


router.get('/:placeId', async (req, res) => {
  try {
    const reviews = await Review.find({ placeId: req.params.placeId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

module.exports = router;
