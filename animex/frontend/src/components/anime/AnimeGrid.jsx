'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  progressMap = {},
}) {
  const pages = () => {
    const items = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    if (start > 1) {
      items.push(1);
      if (start > 2) items.push('…');
    }

    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        items.push('…');
      }
      items.push(totalPages);
    }

    return items;
  };

  return (
    <div>
      {loading ? (
        <GridSkeleton count={columns * 4} />
      ) : animes.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div
          className={`film-grid ${
            columns === 7
              ? 'film-grid-7'
              : 'film-grid-6'
          }`}
          style={{ marginBottom: 24 }}
        >
          {animes.map((a, i) => {
            const animeId =
              a?.mal_id ||
              a?.id ||
              a?.animeId;

            return (
              <AnimeCard
                key={animeId || i}
                anime={a}
                progress={
                  progressMap?.[animeId]
                }
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() =>
              onPageChange(page - 1)
            }
            disabled={page <= 1}
          >
            <ChevronLeft size={13} />
          </button>

          {pages().map((p, i) =>
            p === '…' ? (
              <span
                key={`e${i}`}
                style={{
                  color:
                    'var(--text-3)',
                  padding: '0 4px',
                  fontSize: 14
                }}
              >
                …
              </span>
            ) : (
              <button
                key={p}
                className={`page-btn ${
                  p === page
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  onPageChange(p)
                }
              >
                {p}
              </button>
            )
          )}

          <button
            className="page-btn"
            onClick={() =>
              onPageChange(page + 1)
            }
            disabled={page >= totalPages}
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
