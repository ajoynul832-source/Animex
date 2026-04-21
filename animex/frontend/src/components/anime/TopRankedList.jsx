import Link from 'next/link';

export default function TopRankedList({ title, animes, viewAllHref }) {
  if (!animes?.length) return null;
  return (
    <div className="anif-block" style={{ marginBottom:18 }}>
      <div className="anif-block-header">{title}</div>
      <ul className="anif-ul">
        {animes.slice(0,5).map((a,i) => (
          <li key={a.id||i}>
            <span className="anif-rank">{String(i+1).padStart(2,'0')}</span>
            <img className="anif-poster" src={a.poster||'/no-poster.svg'} alt={a.name} loading="lazy" onError={e=>e.currentTarget.src='/no-poster.svg'}/>
            <div className="anif-info">
              <Link href={`/anime/${a.id}`} className="anif-name">{a.name}</Link>
              <div className="anif-meta">
                {a.type && <span>{a.type}</span>}
                {a.episodes?.sub!=null && <span style={{ color:'var(--sub-color)', fontWeight:700 }}>SUB {a.episodes.sub}</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {viewAllHref && <Link href={viewAllHref} className="anif-more">View Full List →</Link>}
    </div>
  );
}
