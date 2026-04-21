'use client';
import { useLocalStorage } from './useLocalStorage';

const MAX_HISTORY = 50;

/**
 * Tracks watch progress (episode number + position) per anime.
 * Stored in localStorage so it persists without auth.
 */
export function useWatchProgress() {
  const [progress, setProgress] = useLocalStorage('animex_progress', {});

  const save = (animeId, episodeId, episodeNumber, positionSeconds = 0, durationSeconds = 0) => {
    setProgress(prev => {
      const updated = { ...prev };
      updated[animeId] = {
        episodeId,
        episodeNumber,
        positionSeconds,
        durationSeconds,
        percent: durationSeconds > 0 ? Math.round((positionSeconds / durationSeconds) * 100) : 0,
        updatedAt: Date.now(),
      };
      // Keep only last MAX_HISTORY entries by date
      const entries = Object.entries(updated).sort((a, b) => b[1].updatedAt - a[1].updatedAt);
      return Object.fromEntries(entries.slice(0, MAX_HISTORY));
    });
  };

  const get = (animeId) => progress[animeId] || null;

  const clear = (animeId) => {
    setProgress(prev => {
      const updated = { ...prev };
      delete updated[animeId];
      return updated;
    });
  };

  const clearAll = () => setProgress({});

  return { save, get, clear, clearAll, progress };
}
