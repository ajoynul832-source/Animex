'use client';

import {
  Suspense,
  useEffect,
  useState
} from 'react';

import {
  useSearchParams,
  useRouter
} from 'next/navigation';

import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

import { animeApi } from '@/lib/api';

import AnimeCard, {
  AnimeCardSkeleton
} from '@/components/anime/AnimeCard';

/*
Jikan-safe filters
Frontend keeps UI professional
even if backend ignores some filters
*/

const TYPES = [
  '',
  'TV',
  'Movie',
  'OVA',
  'ONA',
  'Special',
  'Music'
];

const STATUSES = [
  '',
  'Airing',
  'Complete',
  'Upcoming'
];

const RATINGS = [
  '',
  'G',
  'PG',
  'PG-13',
  'R',
  'R+',
  'Rx'
];

const SEASONS = [
  '',
  'Spring',
  'Summer',
  'Fall',
  'Winter'
];

const SORTS = [
  ['', 'Default'],
  ['score', 'Score'],
  ['name-az', 'Name A-Z'],
  ['released-date', 'Release Date']
];

function SearchContent() {
  const sp =
    useSearchParams();

  const router =
    useRouter();

  const keyword =
    sp.get(
      'keyword'
    ) || '';

  const page =
    parseInt(
      sp.get(
        'page'
      ) || '1'
    );

  const [query,
    setQuery] =
    useState(
      keyword
    );

  const [results,
    setResults] =
    useState([]);

  const [total,
    setTotal] =
    useState(1);

  const [loading,
    setLoading] =
    useState(false);

  const [showFilters,
    setShowFilters] =
    useState(false);

  const [filters,
    setFilters] =
    useState({
      type: '',
      status: '',
      rated: '',
      season: '',
      sort: ''
    });

  /*
  Load search
  */

  useEffect(() => {
    if (!keyword)
      return;

    setLoading(
      true
    );

    animeApi
      .searchAnime(
        keyword,
        page
      )
      .then(
        (res) => {
          let items =
            res?.data
              ?.animes ||
            [];

          /*
          Optional frontend filters
          because Jikan backend may ignore
          advanced filters
          */

          if (
            filters.type
          ) {
            items =
              items.filter(
                (
                  a
                ) =>
                  a.type ===
                  filters.type
              );
          }

          if (
            filters.sort ===
            'score'
          ) {
            items =
              [
                ...items
              ].sort(
                (
                  a,
                  b
                ) =>
                  (b.score ||
                    b.rating ||
                    0) -
                  (a.score ||
                    a.rating ||
                    0)
              );
          }

          if (
            filters.sort ===
            'name-az'
          ) {
            items =
              [
                ...items
              ].sort(
                (
                  a,
                  b
                ) =>
                  (
                    a.title ||
                    a.name ||
                    ''
                  ).localeCompare(
                    b.title ||
                      b.name ||
                      ''
                  )
              );
          }

          setResults(
            items
          );

          setTotal(
            res?.data
              ?.totalPages ||
              1
          );
        }
      )
      .catch(
        () => {
          setResults(
            []
          );
          setTotal(
            1
          );
        }
      )
      .finally(() => {
        setLoading(
          false
        );
      });
  }, [
    keyword,
    page,
    filters
  ]);

  const submit =
    (e) => {
      e.preventDefault();

      const q =
        query.trim();

      if (!q)
        return;

      router.push(
        `/search?keyword=${encodeURIComponent(
          q
        )}&page=1`
      );
    };

  const goPage =
    (p) => {
      if (
        p < 1 ||
        p > total
      )
        return;

      router.push(
        `/search?keyword=${encodeURIComponent(
          keyword
        )}&page=${p}`
      );
    };

  const setFilter =
    (
      key,
      value
    ) => {
      setFilters(
        (
          prev
        ) => ({
          ...prev,
          [key]:
            value
        })
      );
    };

  const resetFilters =
    () => {
      setFilters({
        type: '',
        status: '',
        rated: '',
        season: '',
        sort: ''
      });
    };

  const hasFilters =
    Object.values(
      filters
    ).some(
      Boolean
    );

  return (
    <div className="page-inner">
      {/* Search Bar */}
      <form
        onSubmit={
          submit
        }
        style={{
          maxWidth: 640,
          marginBottom: 20,
          position:
            'relative'
        }}
      >
        <input
          value={
            query
          }
          onChange={(
            e
          ) =>
            setQuery(
              e.target
                .value
            )
          }
          placeholder="Search anime..."
          style={{
            width:
              '100%',
            height: 44,
            background:
              'var(--bg-card)',
            border:
              '1px solid var(--border)',
            borderRadius: 8,
            color:
              'var(--text-1)',
            fontSize: 14,
            padding:
              '0 90px 0 16px',
            outline:
              'none'
          }}
        />

        <div
          style={{
            position:
              'absolute',
            right: 8,
            top: '50%',
            transform:
              'translateY(-50%)',
            display:
              'flex',
            gap: 6
          }}
        >
          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (
                  v
                ) =>
                  !v
              )
            }
            style={{
              width: 30,
              height: 30,
              border:
                '1px solid var(--border)',
              borderRadius: 6,
              background:
                showFilters
                  ? 'var(--accent-dim)'
                  : 'none',
              cursor:
                'pointer'
            }}
          >
            <SlidersHorizontal size={14} />
          </button>

          <button
            type="submit"
            style={{
              width: 30,
              height: 30,
              border:
                'none',
              borderRadius: 6,
              background:
                'var(--accent)',
              cursor:
                'pointer'
            }}
          >
            <Search size={14} />
          </button>
        </div>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="search-filters">
          <div
            style={{
              display:
                'flex',
              justifyContent:
                'space-between',
              alignItems:
                'center',
              marginBottom: 12
            }}
          >
            <strong>
              Advanced
              Filters
            </strong>

            {hasFilters && (
              <button
                onClick={
                  resetFilters
                }
              >
                <X size={13} />
                Reset
              </button>
            )}
          </div>

          <div className="filter-grid">
            {[
              [
                'Type',
                'type',
                TYPES
              ],
              [
                'Status',
                'status',
                STATUSES
              ],
              [
                'Rating',
                'rated',
                RATINGS
              ],
              [
                'Season',
                'season',
                SEASONS
              ]
            ].map(
              ([
                label,
                key,
                options
              ]) => (
                <div
                  key={
                    key
                  }
                >
                  <label>
                    {
                      label
                    }
                  </label>

                  <select
                    value={
                      filters[
                        key
                      ]
                    }
                    onChange={(
                      e
                    ) =>
                      setFilter(
                        key,
                        e
                          .target
                          .value
                      )
                    }
                  >
                    {options.map(
                      (
                        item
                      ) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                        >
                          {item ||
                            `Any ${label}`}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )
            )}

            <div>
              <label>
                Sort
              </label>

              <select
                value={
                  filters.sort
                }
                onChange={(
                  e
                ) =>
                  setFilter(
                    'sort',
                    e
                      .target
                      .value
                  )
                }
              >
                {SORTS.map(
                  ([
                    v,
                    l
                  ]) => (
                    <option
                      key={
                        v
                      }
                      value={
                        v
                      }
                    >
                      {l}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Result text */}
      {keyword && (
        <p
          style={{
            marginBottom: 18
          }}
        >
          Results for{' '}
          <strong>
            "
            {
              keyword
            }
            "
          </strong>

          {!loading && (
            <>
              {' '}
              —{' '}
              {
                results.length
              }{' '}
              shown
            </>
          )}
        </p>
      )}

      {/* Results */}
      <div
        className="film-grid film-grid-6"
        style={{
          marginBottom: 30
        }}
      >
        {loading
          ? Array.from(
              {
                length: 18
              }
            ).map(
              (
                _,
                i
              ) => (
                <AnimeCardSkeleton
                  key={
                    i
                  }
                />
              )
            )
          : results.map(
              (
                anime,
                i
              ) => (
                <AnimeCard
                  key={
                    anime?.id ||
                    anime?.mal_id ||
                    i
                  }
                  anime={
                    anime
                  }
                />
              )
            )}
      </div>

      {/* Empty */}
      {!loading &&
        !keyword && (
          <div>
            Search for
            anime
          </div>
        )}

      {!loading &&
        keyword &&
        results.length ===
          0 && (
          <div>
            No results
            found
          </div>
        )}

      {/* Pagination */}
      {total > 1 && (
        <div className="pagination">
          <button
            onClick={() =>
              goPage(
                page - 1
              )
            }
            disabled={
              page <= 1
            }
          >
            <ChevronLeft size={13} />
          </button>

          {Array.from(
            {
              length:
                Math.min(
                  total,
                  7
                )
            },
            (
              _,
              i
            ) => {
              const p =
                page <=
                4
                  ? i + 1
                  : page -
                    3 +
                    i;

              if (
                p < 1 ||
                p >
                  total
              )
                return null;

              return (
                <button
                  key={
                    p
                  }
                  onClick={() =>
                    goPage(
                      p
                    )
                  }
                >
                  {p}
                </button>
              );
            }
          )}

          <button
            onClick={() =>
              goPage(
                page + 1
              )
            }
            disabled={
              page >=
              total
            }
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div>
          Loading...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
