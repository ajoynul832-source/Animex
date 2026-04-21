const User = require('../models/User');

exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(avatar && { avatar }) },
      { new: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ── Watch History ────────────────────────────────────────────────

exports.getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('watchHistory');
    const history = user.watchHistory.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

exports.addToHistory = async (req, res) => {
  try {
    const { animeId, animeTitle, animeImage, episode, episodeNumber, dubOrSub, animeType } = req.body;

    if (!animeId) return res.status(400).json({ error: 'animeId is required' });

    // Remove existing entry for same episode
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { watchHistory: { animeId } }
    });

    // Add fresh entry at front
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        watchHistory: {
          $each: [{ animeId, animeTitle, animeImage, episode, episodeNumber, dubOrSub, animeType, watchedAt: new Date() }],
          $position: 0,
          $slice: 100 // keep last 100
        }
      }
    });

    res.json({ message: 'History updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to history' });
  }
};

exports.removeFromHistory = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { watchHistory: { animeId: req.params.animeId } }
    });
    res.json({ message: 'Removed from history' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from history' });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { watchHistory: [] } });
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
};

// ── Watchlist ────────────────────────────────────────────────────

exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('watchlist');
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { animeId, animeName, animeImage, animeType } = req.body;
    if (!animeId) return res.status(400).json({ error: 'animeId is required' });

    const user = await User.findById(req.user._id);
    const exists = user.watchlist.some(w => w.animeId === animeId);
    if (exists) return res.status(409).json({ error: 'Already in watchlist' });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { watchlist: { animeId, animeName, animeImage, animeType, addedAt: new Date() } }
    });
    res.status(201).json({ message: 'Added to watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { watchlist: { animeId: req.params.animeId } }
    });
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
};

exports.checkWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('watchlist');
    const inList = user.watchlist.some(w => w.animeId === req.params.animeId);
    res.json({ inWatchlist: inList });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check watchlist' });
  }
};
