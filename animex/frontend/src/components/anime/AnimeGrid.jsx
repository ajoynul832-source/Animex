'use client';

import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import AnimeCard from '@/components/anime/AnimeCard';
import { GridSkeleton } from '@/components/ui/Skeleton';

export default function AnimeGrid({
  animes = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  emptyMessage = 'No anime found.',
  columns = 6,
  progressMap = {}
}) {
  /*
  Safe normalize
  */

  const safeAnimes =
    Array.isArray(
      animes
    )
      ? animes.filter(
          Boolean
        )
      : [];

  /*
  Smart pagination
  */

  const getPages =
    () => {
      const items =
        [];

      const start =
        Math.max(
          1,
          page - 2
        );

      const end =
        Math.min(
          totalPages,
          page + 2
        );

      if (
        start > 1
      ) {
        items.push(
          1
        );

        if (
          start > 2
        ) {
          items.push(
            '...'
          );
        }
      }

      for (
        let i =
          start;
        i <= end;
        i++
      ) {
        items.push(
          i
        );
      }

      if (
        end <
        totalPages
      ) {
        if (
          end <
          totalPages -
            1
        ) {
          items.push(
            '...'
          );
        }

        items.push(
          totalPages
        );
      }

      return items;
    };

  const handlePage =
    (
      nextPage
    ) => {
      if (
        !onPageChange
      )
        return;

      if (
        nextPage <
          1 ||
        nextPage >
          totalPages
      )
        return;

      onPageChange(
        nextPage
      );
    };

  return (
    <div>
      {/* Loading */}
      {loading ? (
        <GridSkeleton
          count={
            columns * 4
          }
        />
      ) : safeAnimes.length ===
        0 ? (
        /* Empty */
        <div className="empty-state">
          <p className="empty-state-title">
            {
              emptyMessage
            }
          </p>
        </div>
      ) : (
        /* Grid */
        <div
          className={`film-grid ${
            columns ===
            7
              ? 'film-grid-7'
              : 'film-grid-6'
          }`}
          style={{
            marginBottom: 26
          }}
        >
          {safeAnimes.map(
            (
              anime,
              i
            ) => {
              const animeId =
                anime?.id ||
                anime?.mal_id ||
                anime?.animeId ||
                i;

              return (
                <AnimeCard
                  key={
                    animeId
                  }
                  anime={
                    anime
                  }
                  progress={
                    progressMap?.[
                      animeId
                    ]
                  }
                />
              );
            }
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading &&
        totalPages >
          1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() =>
                handlePage(
                  page - 1
                )
              }
              disabled={
                page <= 1
              }
            >
              <ChevronLeft size={13} />
            </button>

            {getPages().map(
              (
                p,
                i
              ) =>
                p ===
                '...' ? (
                  <span
                    key={`ellipsis-${i}`}
                    style={{
                      color:
                        'var(--text-3)',
                      padding:
                        '0 6px',
                      fontSize: 14
                    }}
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn ${
                      p ===
                      page
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      handlePage(
                        p
                      )
                    }
                  >
                    {p}
                  </button>
                )
            )}

            <button
              className="page-btn"
              onClick={() =>
                handlePage(
                  page + 1
                )
              }
              disabled={
                page >=
                totalPages
              }
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}
    </div>
  );
}
