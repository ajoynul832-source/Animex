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
  animes,
  loading,
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
            onClick={() => scroll(-1)}
            style={{
              background:
                'var(--bg-card-alt)',
              border:
                '1px solid var(--border)',
              borderRadius: 5,
              width: 26,
              height: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-3)'
            }}
          >
            <ChevronLeft size={13} />
          </button>

          <button
            onClick={() => scroll(1)}
            style={{
              background:
                'var(--bg-card-alt)',
              border:
                '1px solid var(--border)',
              borderRadius: 5,
              width: 26,
              height: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-3)'
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
          Array.from({ length: 8 }).map(
            (_, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: 150
                }}
              >
                <AnimeCardSkeleton />
              </div>
            )
          )
        ) : (
          animes?.map((a, i) => {
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
          })
        )}
      </div>
    </div>
  );
}
