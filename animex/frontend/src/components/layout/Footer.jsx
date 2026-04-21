import Link from 'next/link';

export default function Footer() {
  const links = [
    ['Home', '/home'], ['Popular', '/popular'], ['New Season', '/new-season'],
    ['Movies', '/movies'], ['TV Series', '/tv-series'], ['Schedule', '/schedule'],
    ['A-Z List', '/az-list'], ['About', '/about'], ['Terms', '/terms'], ['DMCA', '/dmca'],
  ];

  return (
    <footer style={{
      background: 'var(--bg-header)', borderTop: '1px solid var(--border)',
      padding: '20px 14px 28px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>
          ANIME<span style={{ color: 'var(--text-1)' }}>X</span>
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 14px', marginBottom: 16 }}>
        {links.map(([label, href]) => (
          <Link key={href} href={href} style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'none' }}>
            {label}
          </Link>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-4)', textAlign: 'center', lineHeight: 1.6 }}>
        © {new Date().getFullYear()} AnimeX. We do not host any files.{' '}
        <a href="https://hianime.to" target="_blank" rel="nofollow noreferrer" style={{ color: 'var(--accent)' }}>Data: HiAnime</a>
      </p>
    </footer>
  );
}
