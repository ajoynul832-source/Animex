export const metadata = { title: 'About AnimeX' };

export default function AboutPage() {
  const features = [
    ['🎯', 'Ad-Free Experience', 'Watch anime without intrusive ads. We believe in a clean, distraction-free viewing experience.'],
    ['📺', 'HD Quality',         'All titles are available in high definition. Quality settings adapt to your connection speed.'],
    ['🌐', 'Sub & Dub',          'Choose between subtitled and dubbed versions for most titles. Raw episodes also available.'],
    ['🔄', 'Daily Updates',      'New episodes are added as soon as they air in Japan. Never miss a release again.'],
    ['📱', 'Mobile Friendly',    'Responsive design works perfectly on phones, tablets, and desktops.'],
    ['🔖', 'Watchlist & History', 'Save anime to your watchlist and track what you have already watched.'],
    ['⌨️', 'Keyboard Shortcuts', 'Full keyboard navigation for the video player. Press ? while watching to see shortcuts.'],
    ['🔍', 'Advanced Search',    'Filter by type, status, rating, season, genre and more to find exactly what you want.'],
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 60px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 52, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em', lineHeight: 1, marginBottom: 8 }}>
          ANIME<span style={{ color: 'var(--text-1)' }}>X</span>
        </div>
        <p style={{ fontSize: 16, color: 'var(--text-2)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          A free, high-quality anime streaming platform built for fans.
          Watch the latest and greatest anime without registration or payment.
        </p>
      </div>

      {/* Features grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
        {features.map(([icon, title, desc]) => (
          <div key={title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>{title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Stack */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px', marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--accent)', marginBottom: 16 }}>Tech Stack</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {[['Frontend', 'Next.js 14 (App Router)'], ['Styling', 'CSS Custom Properties'], ['Backend', 'Node.js + Express'], ['Database', 'MongoDB + Mongoose'], ['Auth', 'JWT + bcrypt'], ['Player', 'HLS.js'], ['Data', 'HiAnime API'], ['Deploy', 'Vercel + Railway']].map(([k, v]) => (
            <div key={k}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', display: 'block', marginBottom: 2 }}>{k}</span>
              <span style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 10, padding: '16px 20px' }}>
        <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--info)' }}>Disclaimer:</strong> AnimeX does not host any video files on its servers.
          All content is sourced from third-party APIs and CDNs. We respect copyright and work to remove content upon valid DMCA requests.
          Anime data is provided by <a href="https://hianime.to" target="_blank" rel="nofollow noreferrer" style={{ color: 'var(--accent)' }}>HiAnime</a>.
        </p>
      </div>
    </div>
  );
}
