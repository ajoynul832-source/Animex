const fetch = require('node-fetch');
const PageView = require('../models/PageView');
const { cachedFetch, TTL } = require('../cache');

const API = process.env.ANIWATCH_API || 'https://aniwatch-api1-two.vercel.app';

async function apiFetch(url) {
  const res = await fetch(url, { timeout: 12000 });
  if (!res.ok) throw Object.assign(new Error(`Upstream API error ${res.status}`), { status: res.status });
  return res.json();
}

// ── Home ──────────────────────────────────────────────────────────
exports.getHome = async (req, res) => {
  try {
    const data = await cachedFetch('home', TTL.HOME, () => apiFetch(`${API}/api/v2/hianime/home`));
    res.json(data);
  } catch (err) { res.status(502).json({ error: err.message }); }
};

// ── Schedule ──────────────────────────────────────────────────────
exports.getSchedule = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const data = await cachedFetch(`schedule:${date}`, TTL.SCHEDULE,
      () => apiFetch(`${API}/api/v2/hianime/schedule?date=${date}`));
    res.json(data);
  } catch (err) { res.status(502).json({ error: err.message }); }
};

// ── Anime info ────────────────────────────────────────────────────
exports.getAnimeInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await cachedFetch(`info:${id}`, TTL.ANIME_INFO,
      () => apiFetch(`${API}/api/v2/hianime/anime/${id}`));
    res.json(data);
  } catch (err) { res.status(502).json({ error: err.message }); }
};

// ── Episodes ──────────────────────────────────────────────────────
exports.getEpisodes = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await cachedFetch(`episodes:${id}`, TTL.EPISODES,
      () => apiFetch(`${API}/api/v2/hianime/anime/${id}/episodes`));
    res.json(data);
  } catch (err) { res.status(502).json({ error: err.message }); }
};

// ── Streaming sources (short TTL — URLs expire) ───────────────────
exports.getSources = async (req, res) => {
  try {
    const { episodeId, server = 'hd-1', category = 'sub' } = req.query;
    if (!episodeId) return res.status(400).json({ error: 'episodeId required' });
    const cacheKey = `sources:${episodeId}:${server}:${category}`;
    const data = await cachedFetch(cacheKey, TTL.SOURCES,
      () => apiFetch(`${API}/api/v2/hianime/episode/sources?animeEpisodeId=${episodeId}&server=${server}&category=${category}`));
    res.json(data);
  } catch (err) { res.status(502).json({ error: err.message }); }
};

// ── Generic category fetch helper ────────────────────────────────
async function browseEndpoint(res, cacheKey, url) {
  try {
    const data = await cachedFetch(cacheKey, TTL.BROWSE, () => apiFetch(url));
    res.json(data);
  } catch (err) { res.status(502).json({ error: err.message }); }
}

exports.getTopAiring   = (req, res) => browseEndpoint(res, `top-airing:${req.query.page||1}`,   `${API}/api/v2/hianime/category/top-airing?page=${req.query.page||1}`);
exports.getMostPopular = (req, res) => browseEndpoint(res, `most-popular:${req.query.page||1}`, `${API}/api/v2/hianime/category/most-popular?page=${req.query.page||1}`);
exports.getMostFavorite= (req, res) => browseEndpoint(res, `most-fav:${req.query.page||1}`,     `${API}/api/v2/hianime/category/most-favorite?page=${req.query.page||1}`);
exports.getMovies      = (req, res) => browseEndpoint(res, `movies:${req.query.page||1}`,       `${API}/api/v2/hianime/category/movie?page=${req.query.page||1}`);
exports.getTvSeries    = (req, res) => browseEndpoint(res, `tv:${req.query.page||1}`,           `${API}/api/v2/hianime/category/tv?page=${req.query.page||1}`);
exports.getNewSeason   = (req, res) => browseEndpoint(res, `new-season:${req.query.page||1}`,   `${API}/api/v2/hianime/category/new-season?page=${req.query.page||1}`);
exports.getCompleted   = (req, res) => browseEndpoint(res, `completed:${req.query.page||1}`,    `${API}/api/v2/hianime/category/completed?page=${req.query.page||1}`);
exports.getOngoing     = (req, res) => browseEndpoint(res, `ongoing:${req.query.page||1}`,      `${API}/api/v2/hianime/category/top-airing?page=${req.query.page||1}`);

exports.getByGenre = (req, res) => {
  const { genre } = req.params;
  const page = req.query.page || 1;
  browseEndpoint(res, `genre:${genre}:${page}`, `${API}/api/v2/hianime/genre/${genre}?page=${page}`);
};

exports.getAzList = (req, res) => {
  const { letter = 'all', page = 1 } = req.query;
  browseEndpoint(res, `az:${letter}:${page}`, `${API}/api/v2/hianime/az-list?letter=${letter}&page=${page}`);
};

// ── Stats / views / reactions ─────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const stats = await PageView.findOne({ pageId: req.params.pageId }).lean();
    res.json(stats || { pageId: req.params.pageId, totalViews: 0, likeCount: 0, dislikeCount: 0 });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.incrementView = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { animeId } = req.body;
    const stats = await PageView.findOneAndUpdate(
      { pageId },
      { $inc: { totalViews: 1 }, $setOnInsert: { animeId: animeId || pageId } },
      { upsert: true, new: true }
    );
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.setReaction = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { reaction, animeId } = req.body;
    if (!['like', 'dislike'].includes(reaction)) return res.status(400).json({ error: 'reaction must be like or dislike' });
    const field = reaction === 'like' ? 'likeCount' : 'dislikeCount';
    const stats = await PageView.findOneAndUpdate(
      { pageId },
      { $inc: { [field]: 1 }, $setOnInsert: { animeId: animeId || pageId } },
      { upsert: true, new: true }
    );
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── Cache admin ───────────────────────────────────────────────────
exports.getCacheStats = (req, res) => {
  const { cache } = require('../cache');
  res.json(cache.stats());
};

exports.clearCache = (req, res) => {
  const { cache } = require('../cache');
  cache.clear();
  res.json({ message: 'Cache cleared' });
};
