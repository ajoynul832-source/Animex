'use client';

import { useState } from 'react';
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
  const [rawSearch,
    setRawSearch] =
    useState('');

  const search =
    useDebounce(
      rawSearch,
      200
    );

  /*
  Safe support for:
  - Jikan episodes
  - old backend
  - normalized episode objects
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
              ep.episodeId ||
              ep.mal_id ||
              ep.episode_id ||
              ep.id ||
              ep.number ||
              i + 1,
            safeNumber:
              ep.number ||
              ep.mal_id ||
              ep.episode_number ||
              i + 1,
            safeTitle:
              ep.title ||
              ep.name ||
              `Episode ${i + 1}`
          }))
      : [];

  const filtered =
    search
      ? normalized.filter(
          (ep) =>
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
        )
      : normalized;

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
      </div>

      {/* Range info */}
      {normalized.length >
        100 && (
        <div
          style={{
            padding:
              '6px 12px',
            fontSize: 11,
            color:
              'var(--text-3)',
            borderBottom:
              '1px solid var(--border)',
            background:
              'var(--bg-card-alt)'
          }}
        >
          Showing{' '}
          {
            filtered.length
          }{' '}
          of{' '}
          {
            normalized.length
          }
        </div>
      )}

      {/* Episode Grid */}
      <div className="ep-panel-body">
        <div className="ep-grid">
          {filtered.map(
            (ep) => {
              const isActive =
                String(
                  ep.safeId
                ) ===
                String(
                  currentEpId
                );

              const isWatched =
                watchedIds.has(
                  ep.safeId
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
                  href={`/watch/${animeId}?ep=${ep.safeId}&server=${category}`}
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

        {/* Empty */}
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
