const express = require('express');
const router  = express.Router();
const c       = require('../controllers/animeController');
const { optionalAuth } = require('../middleware/auth');

// Home + schedule
router.get('/home',      c.getHome);
router.get('/schedule',  c.getSchedule);

// Anime detail
router.get('/info/:id',     c.getAnimeInfo);
router.get('/episodes/:id', c.getEpisodes);
router.get('/sources',      c.getSources);

// Browse categories
router.get('/top-airing',    c.getTopAiring);
router.get('/most-popular',  c.getMostPopular);
router.get('/most-favorite', c.getMostFavorite);
router.get('/movies',        c.getMovies);
router.get('/tv-series',     c.getTvSeries);
router.get('/new-season',    c.getNewSeason);
router.get('/completed',     c.getCompleted);
router.get('/ongoing',       c.getOngoing);
router.get('/genre/:genre',  c.getByGenre);
router.get('/az-list',       c.getAzList);

// Stats + reactions
router.get('/stats/:pageId',       c.getStats);
router.post('/stats/:pageId/view', optionalAuth, c.incrementView);
router.post('/stats/:pageId/react',optionalAuth, c.setReaction);

// Cache management (internal)
router.get('/cache/stats', c.getCacheStats);
router.delete('/cache',    c.clearCache);

module.exports = router;
