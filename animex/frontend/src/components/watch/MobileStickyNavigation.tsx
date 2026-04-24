'use client';

export default function MobileStickyNavigation({
  previous,
  current,
  next,
  onNavigate
}) {
  return (
    <div
      className="mobile-sticky-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '12px',
        borderTop: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <button
          disabled={!previous}
          onClick={() =>
            previous &&
            onNavigate(previous)
          }
          style={{
            padding: '10px 16px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            cursor: previous ? 'pointer' : 'not-allowed',
            opacity: previous ? 1 : 0.5
          }}
        >
          Prev
        </button>

        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--text-1)'
          }}
        >
          Episode {current}
        </div>

        <button
          disabled={!next}
          onClick={() =>
            next &&
            onNavigate(next)
          }
          style={{
            padding: '10px 16px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            cursor: next ? 'pointer' : 'not-allowed',
            opacity: next ? 1 : 0.5
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
