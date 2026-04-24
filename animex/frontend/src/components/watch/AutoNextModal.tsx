'use client';

interface Props {
  nextEpisode: number;
  countdown: number;
  onCancel: () => void;
  onPlayNext: () => void;
}

export default function AutoNextModal({
  nextEpisode,
  countdown,
  onCancel,
  onPlayNext
}: Props) {
  return (
    <div className="rounded-2xl border p-5 space-y-4">
      <h3 className="text-lg font-semibold">
        Up Next
      </h3>

      <p>
        Episode {nextEpisode} starts in {countdown}s
      </p>

      <div className="flex gap-3">
        <button
          onClick={onPlayNext}
          className="px-4 py-2 rounded-xl border"
        >
          Play Now
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
