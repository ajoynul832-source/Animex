const API =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://animex-dhhs.onrender.com/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function req(path, opts = {}) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('animex_token')
      : null;

  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}),
      ...opts.headers
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data.error || 'Request failed',
      res.status
    );
  }

  return data;
}

const post = (p, b, o) =>
  req(p, {
    method: 'POST',
    body: JSON.stringify(b),
    ...o
  });

const put = (p, b, o) =>
  req(p, {
    method: 'PUT',
    body: JSON.stringify(b),
    ...o
  });

const del = (p, o) =>
  req(p, {
    method: 'DELETE',
    ...o
  });

export const animeApi = {
  getHome: () =>
    req('/anime/home'),

  getSchedule: (date) =>
    req(
      `/anime/schedule${
        date ? `?date=${date}` : ''
      }`
    ),

  getInfo: (id) =>
    req(`/anime/info/${id}`),

  getEpisodes: (id) =>
    req(`/anime/episodes/${id}`),

  getSources: (
    epId,
    srv = 'hd-1',
    cat = 'sub'
  ) =>
    req(
      `/anime/sources?episodeId=${epId}&server=${encodeURIComponent(
        srv
      )}&category=${cat}`
    ),

  getTopAiring: (p = 1) =>
    req(`/anime/top-airing?page=${p}`),

  getMostPopular: (p = 1) =>
    req(`/anime/most-popular?page=${p}`),

  getMostFavorite: (p = 1) =>
    req(`/anime/most-favorite?page=${p}`),

  getMovies: (p = 1) =>
    req(`/anime/movies?page=${p}`),

  getTvSeries: (p = 1) =>
    req(`/anime/tv-series?page=${p}`),

  getNewSeason: (p = 1) =>
    req(`/anime/new-season?page=${p}`),

  getCompleted: (p = 1) =>
    req(`/anime/completed?page=${p}`),

  getOngoing: (p = 1) =>
    req(`/anime/ongoing?page=${p}`),

  getByGenre: (g, p = 1) =>
    req(
      `/anime/genre/${encodeURIComponent(
        g
      )}?page=${p}`
    ),

  getAzList: (l = 'all', p = 1) =>
    req(
      `/anime/az-list?letter=${l}&page=${p}`
    ),

  getStats: (pid) =>
    req(`/anime/stats/${pid}`),

  incrementView: (pid, aid) =>
    post(
      `/anime/stats/${pid}/view`,
      { animeId: aid }
    ),

  setReaction: (pid, r, aid) =>
    post(
      `/anime/stats/${pid}/react`,
      {
        reaction: r,
        animeId: aid
      }
    )
};

export const searchApi = {
  search: (
    kw,
    p = 1,
    filters = {}
  ) =>
    req(
      `/search?keyword=${encodeURIComponent(
        kw
      )}&page=${p}&${new URLSearchParams(
        filters
      )}`
    ),

  getSuggestions: (kw) =>
    req(
      `/search/suggestions?keyword=${encodeURIComponent(
        kw
      )}`
    )
};

export const authApi = {
  register: (d) =>
    post('/auth/register', d),

  login: (d) =>
    post('/auth/login', d),

  getMe: () =>
    req('/auth/me'),

  changePassword: (d) =>
    put('/auth/change-password', d)
};

export const userApi = {
  getProfile: () =>
    req('/user/profile'),

  getHistory: () =>
    req('/user/history'),

  addToHistory: (d) =>
    post('/user/history', d),

  removeFromHistory: (id) =>
    del(`/user/history/${id}`),

  clearHistory: () =>
    del('/user/history'),

  getWatchlist: () =>
    req('/user/watchlist'),

  addToWatchlist: (d) =>
    post('/user/watchlist', d),

  removeFromWatchlist: (id) =>
    del(`/user/watchlist/${id}`),

  checkWatchlist: (id) =>
    req(
      `/user/watchlist/check/${id}`
    )
};

export { ApiError };
