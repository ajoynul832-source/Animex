export const metadata = { title: 'Support AnimeX' };

export default function DonatePage() {
  const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px', marginBottom: 16 };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px 60px' }}>
      <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>
        ❤️ Support AnimeX
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 32, lineHeight: 1.7 }}>
        AnimeX is free to use and we want to keep it that way. If you enjoy the service,
        consider supporting us to keep the servers running and the content flowing.
      </p>

      <div style={card}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>What your support pays for</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['🖥️', 'Server hosting costs'],
            ['🌐', 'CDN and bandwidth fees'],
            ['🔒', 'SSL and security services'],
            ['⚡', 'API access and rate limit upgrades'],
            ['🛠️', 'Development and maintenance time'],
          ].map(([icon, text]) => (
            <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--text-2)' }}>
              <span style={{ fontSize: 18 }}>{icon}</span> {text}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ ...card, borderColor: 'rgba(202,233,98,0.3)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>Ways to support</h2>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16, lineHeight: 1.65 }}>
          The best way to support us right now is to:
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            '⭐ Star our GitHub repository',
            '📢 Share AnimeX with friends who love anime',
            '🐛 Report bugs so we can improve',
            '💡 Suggest features you want to see',
          ].map(item => (
            <li key={item} style={{ fontSize: 13, color: 'var(--text-2)', paddingLeft: 8 }}>{item}</li>
          ))}
        </ul>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', marginTop: 24 }}>
        Thank you for using AnimeX! Your support means everything to us.
      </p>
    </div>
  );
}
