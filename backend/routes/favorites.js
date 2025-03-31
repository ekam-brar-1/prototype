const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');


router.post('/', async (req, res) => {
  const { userId, placeId } = req.body;
  try {
    const existing = await Favorite.findOne({ userId, placeId });
    if (existing) return res.status(400).json({ error: 'Already in favorites' });

    const favorite = new Favorite({ userId, placeId });
    await favorite.save();
    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});


router.get('/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId }).populate('placeId');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

module.exports = router;
