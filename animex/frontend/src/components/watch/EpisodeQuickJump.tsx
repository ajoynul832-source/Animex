'use client';

import { useState } from 'react';

export default function EpisodeQuickJump({
  totalEpisodes,
  currentEpisode,
  onJump
}) {
  const [value, setValue] =
    useState(currentEpisode);

  return (
    <div
      style={{
        marginBottom: 18,
        padding: 16,
        border: '1px solid var(--border)',
        borderRadius: 16,
        background: 'var(--bg-card)'
      }}
    >
      <h3
        style={{
          marginBottom: 12,
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text-1)'
        }}
      >
        Quick Jump
      </h3>

      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center'
        }}
      >
        <input
          type="number"
          min={1}
          max={totalEpisodes}
          value={value}
          onChange={(e) =>
            setValue(
              Number(e.target.value)
            )
          }
          placeholder="Episode #"
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text-1)',
            outline: 'none'
          }}
        />

        <button
          onClick={() =>
            onJump(value)
          }
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--bg-card-alt)',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
}
