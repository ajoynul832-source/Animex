import Link from 'next/link';

export default function TopRankedList({
  title,
  animes,
  viewAllHref
}) {
  if (!animes?.length) return null;

  return (
    <div
      className="anif-block"
      style={{ marginBottom: 18 }}
    >
      <div className="anif-block-header">
        {title}
      </div>

      <ul className="anif-ul">
        {animes.slice(0, 5).map((a, i) => {
          const id =
            a.mal_id ||
            a.id;

          const name =
            a.title ||
            a.name ||
            'Unknown Anime';

          const poster =
            a.images?.jpg?.image_url ||
            a.poster ||
            '/no-poster.svg';

          const type =
            a.type ||
            '';

          const episodes =
            a.episodes ||
            null;

          return (
            <li key={id || i}>
              <span className="anif-rank">
                {String(i + 1).padStart(2, '0')}
              </span>

              <img
                className="anif-poster"
                src={poster}
                alt={name}
                loading="lazy"
                onError={(e) =>
                  (e.currentTarget.src =
                    '/no-poster.svg')
                }
              />

              <div className="anif-info">
                <Link
                  href={`/anime/${id}`}
                  className="anif-name"
                >
                  {name}
                </Link>

                <div className="anif-meta">
                  {type && (
                    <span>{type}</span>
                  )}

                  {episodes?.sub != null && (
                    <span
                      style={{
                        color:
                          'var(--sub-color)',
                        fontWeight: 700
                      }}
                    >
                      SUB {episodes.sub}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="anif-more"
        >
          View Full List →
        </Link>
      )}
    </div>
  );
}
