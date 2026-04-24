'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { List } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function EpisodePanel({
  episodes = [],
  currentEpId,
  animeId,
  category = 'sub',
  onSelect,
  watchedIds = new Set()
}) {
  const [rawSearch, setRawSearch] =
    useState('');

  const [range, setRange] =
    useState(1);

  const search =
    useDebounce(
      rawSearch,
      200
    );

  /*
  IMPORTANT FIX:
  Use ONLY episode.number
  as the main identity

  No more:
  - mal_id
  - episode_id
  - mixed IDs
  */

  const normalized =
    Array.isArray(
      episodes
    )
      ? episodes
          .filter(Boolean)
          .map((ep, i) => ({
            ...ep,

            safeId:
              Number(
                ep.number
              ) || i + 1,

            safeNumber:
              Number(
                ep.number
              ) || i + 1,

            safeTitle:
              ep.title ||
              ep.name ||
              `Episode ${i + 1}`
          }))
      : [];

  /*
  Zoro-style:
  50 episode range selector
  */

  const totalRanges =
    Math.ceil(
      normalized.length /
        50
    ) || 1;

  const filtered =
    useMemo(() => {
      const start =
        (range - 1) *
          50 +
        1;

      const end =
        range * 50;

      return normalized
        .filter(
          (ep) =>
            ep.safeNumber >=
              start &&
            ep.safeNumber <=
              end
        )
        .filter((ep) => {
          if (!search)
            return true;

          return (
            String(
              ep.safeNumber
            ).includes(
              search
            ) ||
            ep.safeTitle
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );
        });
    }, [
      normalized,
      range,
      search
    ]);

  return (
    <div className="ep-panel">
      {/* Header */}
      <div className="ep-panel-header">
        <span className="ep-panel-title">
          <List
            size={13}
            style={{
              color:
                'var(--accent)'
            }}
          />

          Episodes

          <span
            style={{
              fontSize: 11,
              color:
                'var(--text-3)',
              fontWeight: 400
            }}
          >
            (
            {
              normalized.length
            }
            )
          </span>
        </span>

        <div
          style={{
            display:
              'flex',
            gap: 8,
            flexWrap:
              'wrap'
          }}
        >
          <input
            className="ep-search"
            type="text"
            value={
              rawSearch
            }
            onChange={(
              e
            ) =>
              setRawSearch(
                e.target
                  .value
              )
            }
            placeholder="Ep #..."
          />

          {totalRanges >
            1 && (
            <select
              value={
                range
              }
              onChange={(
                e
              ) =>
                setRange(
                  Number(
                    e.target
                      .value
                  )
                )
              }
              className="ep-search"
            >
              {Array.from(
                {
                  length:
                    totalRanges
                },
                (_, i) => {
                  const start =
                    i *
                      50 +
                    1;

                  const end =
                    Math.min(
                      (i +
                        1) *
                        50,
                      normalized.length
                    );

                  return (
                    <option
                      key={
                        i + 1
                      }
                      value={
                        i + 1
                      }
                    >
                      {start}
                      -
                      {end}
                    </option>
                  );
                }
              )}
            </select>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="ep-panel-body">
        <div className="ep-grid">
          {filtered.map(
            (ep) => {
              const isActive =
                Number(
                  ep.safeNumber
                ) ===
                Number(
                  currentEpId
                );

              const isWatched =
                watchedIds.has(
                  ep.safeNumber
                );

              const classes =
                `ep-btn ${
                  isActive
                    ? 'active'
                    : ''
                } ${
                  ep.isFiller
                    ? 'filler'
                    : ''
                } ${
                  isWatched &&
                  !isActive
                    ? 'watched'
                    : ''
                }`;

              /*
              Real current episode
              highlight support
              */

              if (
                onSelect
              ) {
                return (
                  <button
                    key={
                      ep.safeId
                    }
                    id={`episode-${ep.safeNumber}`}
                    onClick={() =>
                      onSelect(
                        ep
                      )
                    }
                    className={
                      classes
                    }
                    title={
                      ep.safeTitle
                    }
                    style={{
                      border:
                        'none',
                      cursor:
                        'pointer'
                    }}
                  >
                    {
                      ep.safeNumber
                    }
                  </button>
                );
              }

              return (
                <Link
                  key={
                    ep.safeId
                  }
                  id={`episode-${ep.safeNumber}`}
                  href={`/watch/${animeId}?ep=${ep.safeNumber}&server=${category}`}
                  className={
                    classes
                  }
                  title={
                    ep.safeTitle
                  }
                >
                  {
                    ep.safeNumber
                  }
                </Link>
              );
            }
          )}
        </div>

        {filtered.length ===
          0 && (
          <p
            style={{
              textAlign:
                'center',
              color:
                'var(--text-3)',
              padding:
                '16px 0',
              fontSize: 12
            }}
          >
            No episodes
            match.
          </p>
        )}
      </div>
    </div>
  );
}
