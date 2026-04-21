'use client';
import { useState } from 'react';
import Link from 'next/link';
import { List } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function EpisodePanel({ episodes = [], currentEpId, animeId, category = 'sub', onSelect, watchedIds = new Set() }) {
  const [rawSearch, setRawSearch] = useState('');
  const search = useDebounce(rawSearch, 200);

  const filtered = search
    ? episodes.filter(e =>
        String(e.number).includes(search) ||
        e.title?.toLowerCase().includes(search.toLowerCase())
      )
    : episodes;

  return (
    <div className="ep-panel">
      <div className="ep-panel-header">
        <span className="ep-panel-title">
          <List size={13} style={{ color: 'var(--accent)' }} />
          Episodes
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 400 }}>
            ({episodes.length})
          </span>
        </span>
        <input
          className="ep-search"
          type="text"
          value={rawSearch}
          onChange={e => setRawSearch(e.target.value)}
          placeholder="Ep #…"
        />
      </div>

      {/* Range indicator when many episodes */}
      {episodes.length > 100 && (
        <div style={{ padding: '6px 12px', fontSize: 11, color: 'var(--text-3)', borderBottom: '1px solid var(--border)', background: 'var(--bg-card-alt)' }}>
          Showing {filtered.length} of {episodes.length}
        </div>
      )}

      <div className="ep-panel-body">
        <div className="ep-grid">
          {filtered.map(ep => {
            const isActive  = ep.episodeId === currentEpId;
            const isWatched = watchedIds.has(ep.episodeId);

            if (onSelect) {
              return (
                <button
                  key={ep.episodeId}
                  onClick={() => onSelect(ep)}
                  className={`ep-btn ${isActive ? 'active' : ''} ${ep.isFiller ? 'filler' : ''} ${isWatched && !isActive ? 'watched' : ''}`}
                  title={ep.title || `Episode ${ep.number}`}
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  {ep.number}
                </button>
              );
            }

            return (
              <Link
                key={ep.episodeId}
                href={`/watch/${animeId}?ep=${ep.episodeId}&server=${category}`}
                className={`ep-btn ${isActive ? 'active' : ''} ${ep.isFiller ? 'filler' : ''} ${isWatched && !isActive ? 'watched' : ''}`}
                title={ep.title || `Episode ${ep.number}`}
              >
                {ep.number}
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '16px 0', fontSize: 12 }}>
            No episodes match.
          </p>
        )}
      </div>
    </div>
  );
}
