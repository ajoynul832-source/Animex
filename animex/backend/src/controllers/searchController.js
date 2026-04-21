const fetch = require('node-fetch');
const { cachedFetch, TTL } = require('../cache');

const API = process.env.ANIWATCH_API || 'https://aniwatch-api1-two.vercel.app';

exports.search = async (req, res) => {
  try {
    const { keyword, page = 1, type, status, rated, score, season, language, start_date, end_date, sort } = req.query;
    if (!keyword?.trim()) return res.status(400).json({ error: 'keyword is required' });

    // Build query string with all optional filters
    const params = new URLSearchParams({ q: keyword, page });
    if (type)       params.set('type', type);
    if (status)     params.set('status', status);
    if (rated)      params.set('rated', rated);
    if (score)      params.set('score', score);
    if (season)     params.set('season', season);
    if (language)   params.set('language', language);
    if (start_date) params.set('start_date', start_date);
    if (end_date)   params.set('end_date', end_date);
    if (sort)       params.set('sort', sort);

    const cacheKey = `search:${params.toString()}`;
    const data = await cachedFetch(cacheKey, TTL.SEARCH,
      async () => {
        const r = await fetch(`${API}/api/v2/hianime/search?${params.toString()}`, { timeout: 10000 });
        if (!r.ok) throw new Error(`Upstream ${r.status}`);
        return r.json();
      }
    );
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Search failed', detail: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword?.trim()) return res.status(400).json({ error: 'keyword is required' });

    const cacheKey = `suggest:${keyword.toLowerCase()}`;
    const data = await cachedFetch(cacheKey, TTL.SUGGEST,
      async () => {
        const r = await fetch(`${API}/api/v2/hianime/search/suggestion?q=${encodeURIComponent(keyword)}`, { timeout: 6000 });
        if (!r.ok) throw new Error(`Upstream ${r.status}`);
        return r.json();
      }
    );
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Suggestions failed' });
  }
};
