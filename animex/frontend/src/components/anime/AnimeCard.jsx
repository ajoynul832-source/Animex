import Link from 'next/link';
import { Play, Star } from 'lucide-react';

export default function AnimeCard({ anime, progress }) {
  if (!anime) return null;

  const id =
    anime.id ||
    anime.mal_id ||
    anime.animeId;

  const name =
    anime.name ||
    anime.title ||
    anime.animeName ||
    'Unknown Anime';

  const poster =
    anime.poster ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    anime.animeImage ||
    '/no-poster.svg';

  const type =
    anime.type ||
    anime.animeType ||
    '';

  const rating =
    anime.rating ||
    anime.score ||
    null;

  const pct =
    progress?.percent || 0;

  return (
    <div className="flw-item">
      <Link
        href={`/anime/${id}`}
        className="film-poster-wrap"
        style={{ display: 'block' }}
      >
        <img
          className="film-poster-img"
          src={poster}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              '/no-poster.svg';
          }}
        />

        <div className="film-poster-overlay" />

        <div className="film-play-btn">
          <div className="play-circle">
            <Play
              size={18}
              fill="#111"
              strokeWidth={0}
            />
          </div>
        </div>

        {rating && (
          <div className="tick-rate">
            <Star
              size={10}
              fill="currentColor"
              strokeWidth={0}
            />
            {rating}
          </div>
        )}

        {type && (
          <div className="tick-type">
            {type}
          </div>
        )}

        {pct > 0 && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(
                  pct,
                  100
                )}%`
              }}
            />
          </div>
        )}
      </Link>

      <div className="film-detail">
        <h3 className="film-name">
          <Link href={`/anime/${id}`}>
            {name}
          </Link>
        </h3>

        <div className="fd-infor">
          {type && <span>{type}</span>}
        </div>
      </div>
    </div>
  );
}

export function AnimeCardSkeleton() {
  return (
    <div className="flw-item">
      <div
        className="skeleton"
        style={{
          paddingBottom: '140%',
          borderRadius: 6
        }}
      />

      <div className="film-detail">
        <div
          className="skeleton"
          style={{
            height: 12,
            borderRadius: 3,
            marginBottom: 5,
            width: '85%'
          }}
        />

        <div
          className="skeleton"
          style={{
            height: 10,
            borderRadius: 3,
            width: '50%'
          }}
        />
      </div>
    </div>
  );
}
