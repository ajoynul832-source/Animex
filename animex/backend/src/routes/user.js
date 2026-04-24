const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// All user routes require auth
router.use(auth);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Watch history
router.get('/history', userController.getHistory);
router.post('/history', userController.addToHistory);
router.delete('/history/:animeId', userController.removeFromHistory);
router.delete('/history', userController.clearHistory);

// Watchlist
router.get('/watchlist', userController.getWatchlist);
router.post('/watchlist', userController.addToWatchlist);
router.delete('/watchlist/:animeId', userController.removeFromWatchlist);
router.get('/watchlist/check/:animeId', userController.checkWatchlist);
// Watch progress
router.post(
  '/watch-progress',
  userController.saveWatchProgress
);

router.get(
  '/watch-progress/:animeId',
  userController.getWatchProgress
);
// Auto Next Preference
router.patch(
  '/preferences/auto-next',
  userController.updateAutoNextPreference
);
router.get(
  '/recently-watched',
  userController.getRecentlyWatched
);
module.exports = router;
