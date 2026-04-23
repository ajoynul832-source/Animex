const fetch = require('node-fetch');
const PageView = require('../models/PageView');
const { cachedFetch, TTL } = require('../cache');

const API = process.env.ANIWATCH_API || 'https://api-consumet.vercel.app';

async function apiFetch(url) {
  const res = await fetch(url, { timeout: 15000 });

  if (!res.ok) {
    throw Object.assign(
      new Error(`Upstream API error ${res.status}`),
      { status: res.status }
    );
  }

  return res.json();
}

/* ───────── HOME ───────── */

exports.getHome = async (req, res) => {
  try {
    const data = await cachedFetch(
      'home',
      TTL.HOME,
      () => apiFetch(`${API}/gogoanime/home`)
    );

    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};

/* ───────── SEARCH ───────── */

exports.searchAnime = async (req, res) => {
  try {
    const { keyword = '', page = 1 } = req.query;

    if (!keyword.trim()) {
      return res.json({
        data: {
          animes: [],
          totalPages: 1
        }
      });
    }

    const data = await cachedFetch(
      `search:${keyword}:${page}`,
      TTL.BROWSE,
      () =>
        apiFetch(
          `${API}/gogoanime/${encodeURIComponent(keyword)}?page=${page}`
        )
    );

    res.json({
      data: {
        animes: data?.results || [],
        totalPages: data?.hasNextPage ? Number(page) + 1 : Number(page)
      }
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};

/* ───────── A-Z LIST ───────── */

exports.getAzList = async (req, res) => {
  try {
    const { letter = 'all', page = 1 } = req.query;

    let query = '';

    if (letter !== 'all') {
      query = letter;
    }

    const data = await cachedFetch(
      `az:${letter}:${page}`,
      TTL.BROWSE,
      () =>
        apiFetch(
          `${API}/gogoanime/${encodeURIComponent(query)}?page=${page}`
        )
    );

    res.json({
      data: {
        animes: data?.results || [],
        totalPages: data?.hasNextPage ? Number(page) + 1 : Number(page)
      }
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};

/* ───────── INFO ───────── */

exports.getAnimeInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await cachedFetch(
      `info:${id}`,
      TTL.ANIME_INFO,
      () => apiFetch(`${API}/gogoanime/info/${id}`)
    );

    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};

/* ───────── EPISODES ───────── */

exports.getEpisodes = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await cachedFetch(
      `episodes:${id}`,
      TTL.EPISODES,
      () => apiFetch(`${API}/gogoanime/info/${id}`)
    );

    res.json({
      data: {
        episodes: data?.episodes || []
      }
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};

/* ───────── SOURCES ───────── */

exports.getSources = async (req, res) => {
  try {
    const { episodeId } = req.query;

    if (!episodeId) {
      return res.status(400).json({
        error: 'episodeId required'
      });
    }

    const data = await cachedFetch(
      `sources:${episodeId}`,
      TTL.SOURCES,
      () => apiFetch(`${API}/gogoanime/watch/${episodeId}`)
    );

    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};

/* ───────── CATEGORY HELPER ───────── */

async function browseSearch(res, cacheKey, keyword, page = 1) {
  try {
    const data = await cachedFetch(
      cacheKey,
      TTL.BROWSE,
      () =>
        apiFetch(
          `${API}/gogoanime/${encodeURIComponent(keyword)}?page=${page}`
        )
    );

    res.json({
      data: {
        animes: data?.results || [],
        totalPages: data?.hasNextPage ? Number(page) + 1 : Number(page)
      }
    });
  } catch (err) {
    res.status(502).json({
      error: err.message
    });
  }
}

exports.getTopAiring = (req, res) =>
  browseSearch(
    res,
    `top:${req.query.page || 1}`,
    'top-airing',
    req.query.page || 1
  );

exports.getMostPopular = (req, res) =>
  browseSearch(
    res,
    `popular:${req.query.page || 1}`,
    'popular',
    req.query.page || 1
  );

exports.getMostFavorite = (req, res) =>
  browseSearch(
    res,
    `favorite:${req.query.page || 1}`,
    'favorite',
    req.query.page || 1
  );

exports.getMovies = (req, res) =>
  browseSearch(
    res,
    `movies:${req.query.page || 1}`,
    'movie',
    req.query.page || 1
  );

exports.getTvSeries = (req, res) =>
  browseSearch(
    res,
    `tv:${req.query.page || 1}`,
    'tv',
    req.query.page || 1
  );

exports.getNewSeason = (req, res) =>
  browseSearch(
    res,
    `new:${req.query.page || 1}`,
    'new-season',
    req.query.page || 1
  );

exports.getCompleted = (req, res) =>
  browseSearch(
    res,
    `completed:${req.query.page || 1}`,
    'completed',
    req.query.page || 1
  );

exports.getOngoing = (req, res) =>
  browseSearch(
    res,
    `ongoing:${req.query.page || 1}`,
    'ongoing',
    req.query.page || 1
  );

/* ───────── STATS ───────── */

exports.getStats = async (req, res) => {
  try {
    const stats = await PageView.findOne({
      pageId: req.params.pageId
    }).lean();

    res.json(
      stats || {
        pageId: req.params.pageId,
        totalViews: 0,
        likeCount: 0,
        dislikeCount: 0
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.incrementView = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { animeId } = req.body;

    const stats = await PageView.findOneAndUpdate(
      { pageId },
      {
        $inc: { totalViews: 1 },
        $setOnInsert: {
          animeId: animeId || pageId
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setReaction = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { reaction, animeId } = req.body;

    if (!['like', 'dislike'].includes(reaction)) {
      return res.status(400).json({
        error: 'reaction must be like or dislike'
      });
    }

    const field =
      reaction === 'like'
        ? 'likeCount'
        : 'dislikeCount';

    const stats = await PageView.findOneAndUpdate(
      { pageId },
      {
        $inc: {
          [field]: 1
        },
        $setOnInsert: {
          animeId: animeId || pageId
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ───────── CACHE ───────── */

exports.getCacheStats = (req, res) => {
  const { cache } = require('../cache');
  res.json(cache.stats());
};

exports.clearCache = (req, res) => {
  const { cache } = require('../cache');
  cache.clear();

  res.json({
    message: 'Cache cleared'
  });
};
