// All skeleton loaders in one place

export function CardSkeleton() {
  return (
    <div className="flw-item">
      <div className="skeleton" style={{ paddingBottom: '140%', borderRadius: 6 }} />
      <div className="film-detail">
        <div className="skeleton" style={{ height: 12, borderRadius: 3, marginBottom: 5, width: '85%' }} />
        <div className="skeleton" style={{ height: 10, borderRadius: 3, width: '50%' }} />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="deslide-item skeleton" style={{ height: 500 }} />;
}

export function AnimeInfoSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ height: 280 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', marginTop: -140, display: 'flex', gap: 24 }}>
        <div className="skeleton" style={{ width: 200, height: 290, borderRadius: 8, flexShrink: 0 }} />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <div className="skeleton" style={{ height: 40, borderRadius: 6, marginBottom: 10, width: '55%' }} />
          <div className="skeleton" style={{ height: 13, borderRadius: 3, marginBottom: 14, width: '35%' }} />
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[70, 80, 60].map((w, i) => <div key={i} className="skeleton" style={{ height: 28, borderRadius: 5, width: w }} />)}
          </div>
          {[100, 95, 88, 80].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 12, borderRadius: 3, marginBottom: 7, width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ListItemSkeleton({ count = 5 }) {
  return (
    <div style={{ padding: '12px 14px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
          <div className="skeleton" style={{ width: 36, height: 50, borderRadius: 3, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 11, borderRadius: 3, marginBottom: 5, width: '80%' }} />
            <div className="skeleton" style={{ height: 10, borderRadius: 3, width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 4, widths }) {
  const w = widths || [100, 95, 88, 70];
  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 13, borderRadius: 3, marginBottom: 7, width: `${w[i % w.length]}%` }} />
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 12 }) {
  return (
    <div className="film-grid film-grid-6">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
