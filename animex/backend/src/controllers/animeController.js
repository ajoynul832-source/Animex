const fetch = require('node-fetch');
const PageView = require('../models/PageView');
const { cachedFetch, TTL } = require('../cache');

/*
Stable professional source:
Jikan API (MyAnimeList)
*/
const API = 'https://api.jikan.moe/v4';

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

/* ───────────────── HOME ───────────────── */

exports.getHome = async (req, res) => {
  try {
    const top = await cachedFetch(
      'home:top',
      TTL.HOME,
      () => apiFetch(`${API}/top/anime?page=1`)
    );

    const season = await cachedFetch(
      'home:season',
      TTL.HOME,
      () => apiFetch(`${API}/seasons/now?page=1`)
    );

    const topData = top?.data || [];
    const seasonData = season?.data || [];

    /*
      Return old frontend structure
      so existing frontend works
    */

    res.json({
      data: {
        spotlightAnimes: topData.slice(0, 10),
        trendingAnimes: topData.slice(0, 20),

        latestEpisodeAnimes: seasonData.slice(0, 24),
        topAiringAnimes: seasonData.slice(0, 24),

        mostPopularAnimes: topData.slice(0, 24),
        mostFavoriteAnimes: topData.slice(0, 24),

        latestCompletedAnimes: topData.slice(0, 24)
      }
    });
  } catch (err) {
    res.status(502).json({
      error: err.message
    });
  }
};

/* ───────────────── SCHEDULE ───────────────── */

exports.getSchedule = async (req, res) => {
  try {
    const data = await cachedFetch(
      'schedule',
      TTL.HOME,
      () => apiFetch(`${API}/schedules`)
    );

    res.json({
      data: {
        scheduledAnimes: data?.data || []
      }
    });
  } catch (err) {
    res.status(502).json({
      error: err.message
    });
  }
};

/* ───────────────── SEARCH ───────────────── */

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
          `${API}/anime?q=${encodeURIComponent(keyword)}&page=${page}`
        )
    );

    res.json({
      data: {
        animes: data?.data || [],
        totalPages:
          data?.pagination?.last_visible_page || 1
      }
    });
  } catch (err) {
    res.status(502).json({
      error: err.message
    });
  }
};

/* ───────────────── A-Z LIST ───────────────── */

exports.getAzList = async (req, res) => {
  try {
    const {
      letter = 'all',
      page = 1
    } = req.query;

    let url = `${API}/top/anime?page=${page}`;

    if (letter !== 'all') {
      url = `${API}/anime?q=${letter}&page=${page}`;
    }

    const data = await cachedFetch(
      `az:${letter}:${page}`,
      TTL.BROWSE,
      () => apiFetch(url)
    );

    res.json({
      data: {
        animes: data?.data || [],
        totalPages:
          data?.pagination?.last_visible_page || 1
      }
    });
  } catch (err) {
    res.status(502).json({
      error: err.message
    });
  }
};

/* ───────────────── GENRE ───────────────── */

exports.getByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const page = req.query.page || 1;

    const data = await cachedFetch(
      `genre:${genre}:${page}`,
      TTL.BROWSE,
      () =>
        apiFetch(
          `${API}/anime?q=${encodeURIComponent(
            genre
          )}&page=${page}`
        )
    );

    res.json({
      data: {
        animes: data?.data || [],
        totalPages:
          data?.pagination?.last_visible_page || 1
      }
    });
  } catch (err) {
    res.status(502).json({
      error: err.message
    });
  }
};

/* ───────────────── INFO ───────────────── */

exports.getAnimeInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await cachedFetch(
      `info:${id}`,
      TTL.ANIME_INFO,
      () => apiFetch(`${API}/anime/${id}/full`)
    );

    res.json(data);
  } catch (err) {
    res.status(502).json({
      error: err.message
    });
  }
};

/* ───────────────── EPISODES ───────────────── */

exports.getEpisodes = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await cachedFetch(
      `episodes:${id}`,
      TTL.EPISODES,
      () => apiFetch(`${API}/anime/${id}/episodes`)
    );

    res.json({
      data: {
        episodes: data?.data || []
      }
    });
  } catch (err) {
    res.status(502).json({
      error: err.message
    });
  }
};

/* ───────────────── SOURCES ───────────────── */

exports.getSources = async (req, res) => {
  res.json({
    data: {
      sources: [],
      note:
        'Streaming sources removed in Jikan backend'
    }
  });
};

/* ───────────────── CATEGORY HELPERS ───────────────── */

async function browseTop(
  res,
  cacheKey,
  page = 1
) {
  try {
    const data = await cachedFetch(
      cacheKey,
      TTL.BROWSE,
      () => apiFetch(`${API}/top/anime?page=${page}`)
    );

    res.json({
      data: {
        animes: data?.data || [],
        totalPages:
          data?.pagination?.last_visible_page || 1
      }
    });
  } catch (err) {
    res.status(502).json({
      error: err.message
    });
  }
}

exports.getTopAiring = (req, res) =>
  browseTop(
    res,
    `top:${req.query.page || 1}`,
    req.query.page || 1
  );

exports.getMostPopular = (req, res) =>
  browseTop(
    res,
    `popular:${req.query.page || 1}`,
    req.query.page || 1
  );

exports.getMostFavorite = (req, res) =>
  browseTop(
    res,
    `favorite:${req.query.page || 1}`,
    req.query.page || 1
  );

exports.getMovies = (req, res) =>
  browseTop(
    res,
    `movies:${req.query.page || 1}`,
    req.query.page || 1
  );

exports.getTvSeries = (req, res) =>
  browseTop(
    res,
    `tv:${req.query.page || 1}`,
    req.query.page || 1
  );

exports.getNewSeason = (req, res) =>
  browseTop(
    res,
    `new:${req.query.page || 1}`,
    req.query.page || 1
  );

exports.getCompleted = (req, res) =>
  browseTop(
    res,
    `completed:${req.query.page || 1}`,
    req.query.page || 1
  );

exports.getOngoing = (req, res) =>
  browseTop(
    res,
    `ongoing:${req.query.page || 1}`,
    req.query.page || 1
  );

/* ───────────────── STATS ───────────────── */

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
    res.status(500).json({
      error: err.message
    });
  }
};

exports.incrementView = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { animeId } = req.body;

    const stats =
      await PageView.findOneAndUpdate(
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
    res.status(500).json({
      error: err.message
    });
  }
};

exports.setReaction = async (req, res) => {
  try {
    const { pageId } = req.params;
    const {
      reaction,
      animeId
    } = req.body;

    if (
      !['like', 'dislike'].includes(
        reaction
      )
    ) {
      return res.status(400).json({
        error:
          'reaction must be like or dislike'
      });
    }

    const field =
      reaction === 'like'
        ? 'likeCount'
        : 'dislikeCount';

    const stats =
      await PageView.findOneAndUpdate(
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
    res.status(500).json({
      error: err.message
    });
  }
};

/* ───────────────── CACHE ───────────────── */

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
