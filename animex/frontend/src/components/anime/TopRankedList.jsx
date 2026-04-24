import Link from 'next/link';

export default function TopRankedList({
  title,
  animes = [],
  viewAllHref
}) {
  /*
  Supports:
  - Jikan
  - old backend
  - normalized homepage data
  */

  const cleaned =
    Array.isArray(animes)
      ? animes.filter(Boolean)
      : [];

  if (!cleaned.length) {
    return null;
  }

  return (
    <div
      className="anif-block"
      style={{
        marginBottom: 18
      }}
    >
      <div className="anif-block-header">
        {title}
      </div>

      <ul className="anif-ul">
        {cleaned
          .slice(0, 5)
          .map((anime, i) => {
            const id =
              anime?.id ||
              anime?.mal_id ||
              anime?.animeId ||
              anime?.entry?.mal_id;

            if (!id) return null;

            const name =
              anime?.name ||
              anime?.title ||
              anime?.title_english ||
              anime?.animeName ||
              anime?.entry?.name ||
              'Unknown Anime';

            const poster =
              anime?.poster ||
              anime?.images?.jpg
                ?.large_image_url ||
              anime?.images?.jpg
                ?.image_url ||
              anime?.image ||
              anime?.animeImage ||
              anime?.entry?.images?.jpg
                ?.large_image_url ||
              anime?.entry?.images?.jpg
                ?.image_url ||
              '/no-poster.svg';

            const type =
              anime?.type ||
              anime?.animeType ||
              '';

            /*
            SAFE episodes handling
            prevents React error #31
            */
            const episodes =
              anime?.episodes?.sub != null
                ? anime.episodes.sub
                : typeof anime?.episodes === 'number'
                ? anime.episodes
                : null;

            const score =
              anime?.rating ||
              anime?.score ||
              null;

            return (
              <li
                key={id || i}
              >
                <span className="anif-rank">
                  {String(
                    i + 1
                  ).padStart(
                    2,
                    '0'
                  )}
                </span>

                <img
                  className="anif-poster"
                  src={poster}
                  alt={name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      '/no-poster.svg';
                  }}
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
                      <span>
                        {type}
                      </span>
                    )}

                    {episodes != null && (
                      <span
                        style={{
                          color:
                            'var(--sub-color)',
                          fontWeight: 700
                        }}
                      >
                        EP {episodes}
                      </span>
                    )}

                    {episodes == null &&
                      score && (
                        <span>
                          ★{' '}
                          {Number(
                            score
                          ).toFixed(
                            1
                          )}
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
