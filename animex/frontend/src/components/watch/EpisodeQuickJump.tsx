'use client';

import { useState } from 'react';

interface Props {
  totalEpisodes: number;
  currentEpisode: number;
  onJump: (episode: number) => void;
}

export default function EpisodeQuickJump({
  totalEpisodes,
  currentEpisode,
  onJump,
}: Props) {
  const [value, setValue] = useState(currentEpisode);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Quick Jump</h3>

      <div className="flex gap-2">
        <input
          type="number"
          min={1}
          max={totalEpisodes}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="px-4 py-2 rounded-xl border w-full"
        />

        <button
          onClick={() => onJump(value)}
          className="px-4 py-2 rounded-xl border"
        >
          Go
        </button>
      </div>
    </div>
  );
}
