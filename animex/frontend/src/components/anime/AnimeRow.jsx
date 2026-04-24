'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

import AnimeCard, {
  AnimeCardSkeleton
} from './AnimeCard';

export default function AnimeRow({
  title,
  animes = [],
  loading = false,
  viewAllHref,
  progressMap = {}
}) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    rowRef.current?.scrollBy({
      left: direction * 620,
      behavior: 'smooth'
    });
  };

  /*
  safer support for:
  - Jikan
  - old backend
  - history/watchlist
  - related anime
  */

  const cleaned =
    Array.isArray(animes)
      ? animes.filter(Boolean)
      : [];

  if (!loading && cleaned.length === 0) {
    return null;
  }

  return (
    <div className="block_area">
      <div className="block_area-header">
        <h2 className="cat-heading">
          {title}
        </h2>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          <button
            onClick={() =>
              scroll(-1)
            }
            style={{
              background:
                'var(--bg-card-alt)',
              border:
                '1px solid var(--border)',
              borderRadius: 5,
              width: 26,
              height: 26,
              display: 'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              cursor: 'pointer',
              color:
                'var(--text-3)'
            }}
          >
            <ChevronLeft size={13} />
          </button>

          <button
            onClick={() =>
              scroll(1)
            }
            style={{
              background:
                'var(--bg-card-alt)',
              border:
                '1px solid var(--border)',
              borderRadius: 5,
              width: 26,
              height: 26,
              display: 'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              cursor: 'pointer',
              color:
                'var(--text-3)'
            }}
          >
            <ChevronRight size={13} />
          </button>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="view-more"
            >
              All
              <ChevronRight size={12} />
            </Link>
          )}
        </div>
      </div>

      <div
        className="film-row"
        ref={rowRef}
      >
        {loading ? (
          Array.from({
            length: 8
          }).map((_, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: 150
              }}
            >
              <AnimeCardSkeleton />
            </div>
          ))
        ) : (
          cleaned.map(
            (anime, i) => {
              const animeId =
                anime?.id ||
                anime?.mal_id ||
                anime?.animeId ||
                anime?.entry
                  ?.mal_id;

              return (
                <div
                  key={
                    animeId || i
                  }
                  style={{
                    flexShrink: 0,
                    width: 150
                  }}
                >
                  <AnimeCard
                    anime={anime}
                    progress={
                      progressMap?.[
                        animeId
                      ]
                    }
                  />
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
}
