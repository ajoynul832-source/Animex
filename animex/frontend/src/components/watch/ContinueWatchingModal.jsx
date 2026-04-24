'use client';

export default function ContinueWatchingModal({
  currentTime,
  onResume,
  onRestart
}) {
  return (
    <div
      style={{
        padding: 20,
        border: '1px solid #333',
        borderRadius: 16,
        marginBottom: 16
      }}
    >
      <h3>
        Continue Watching
      </h3>

      <p>
        Resume from{' '}
        {Math.floor(currentTime / 60)}
        m ?
      </p>

      <div
        style={{
          display: 'flex',
          gap: 12
        }}
      >
        <button
          onClick={onResume}
        >
          Resume
        </button>

        <button
          onClick={onRestart}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
