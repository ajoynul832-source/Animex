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

/*
Normalize Jikan -> old frontend format
*/
function normalizeAnime(a) {
  if (!a) return null;

  return {
    id: a.mal_id || a.id,

    name:
      a.title ||
      a.name ||
      'Unknown Anime',

    poster:
      a.images?.jpg?.large_image_url ||
      a.images?.jpg?.image_url ||
      a.poster ||
      '/no-poster.svg',

    type:
      a.type ||
      '',

    rating:
      a.score ||
      a.rating ||
      null,

    duration:
      a.duration ||
      '',

    description:
      a.synopsis ||
      a.description ||
      '',

    episodes: {
      sub:
        typeof a.episodes === 'number'
          ? a.episodes
          : null,
      dub: null
    }
  };
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

    const topData =
      (top?.data || []).map(normalizeAnime);

    const seasonData =
      (season?.data || []).map(normalizeAnime);

    res.json({
      data: {
        spotlightAnimes: topData.slice(0, 10),
        trendingAnimes: topData.slice(0, 20),

        latestEpisodeAnimes:
          seasonData.slice(0, 24),

        topAiringAnimes:
          seasonData.slice(0, 24),

        mostPopularAnimes:
          topData.slice(0, 24),

        mostFavoriteAnimes:
          topData.slice(0, 24),

        latestCompletedAnimes:
          topData.slice(0, 24)
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
    const {
      keyword = '',
      page = 1
    } = req.query;

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
          `${API}/anime?q=${encodeURIComponent(
            keyword
          )}&page=${page}`
        )
    );

    res.json({
      data: {
        animes:
          (data?.data || []).map(normalizeAnime),

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
