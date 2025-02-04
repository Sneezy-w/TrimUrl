import express from 'express';
import Url from '../models/Url.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const urls = await Url.find({ userId: res.locals.logged_in.uid }).sort({
      createdAt: -1,
    });
    res.render('dashboard', { urls, baseUrl: req.get('host') });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) {
      return res.status(404).render('404');
    }

    url.clicks++;
    await url.save();
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
