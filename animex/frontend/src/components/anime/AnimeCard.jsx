import Link from 'next/link';
import { Play, Star } from 'lucide-react';

export default function AnimeCard({
  anime,
  progress
}) {
  if (!anime) return null;

  /*
  Full safe mapping:
  supports Jikan + old data + history/watchlist
  */

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
    anime?.images?.jpg?.large_image_url ||
    anime?.images?.jpg?.image_url ||
    anime?.image ||
    anime?.animeImage ||
    anime?.entry?.images?.jpg?.large_image_url ||
    anime?.entry?.images?.jpg?.image_url ||
    '/no-poster.svg';

  const type =
    anime?.type ||
    anime?.animeType ||
    anime?.media_type ||
    '';

  const rating =
    anime?.rating ||
    anime?.score ||
    anime?.scored ||
    null;

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

  const progressPercent =
    progress?.percent || 0;

  const watchHref =
    progress?.episodeId
      ? `/watch/${id}?ep=${progress.episodeId}`
      : `/anime/${id}`;

  return (
    <div className="flw-item">
      <Link
        href={watchHref}
        className="film-poster-wrap"
        style={{
          display: 'block'
        }}
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
            {Number(rating).toFixed(1)}
          </div>
        )}

        {type && (
          <div className="tick-type">
            {type}
          </div>
        )}

        {episodes != null && (
          <div
            className="tick-item tick-sub"
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8
            }}
          >
            EP {episodes}
          </div>
        )}

        {progressPercent > 0 && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(
                  progressPercent,
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
          {type && (
            <span>{type}</span>
          )}

          {episodes != null && (
            <span>
              • EP {episodes}
            </span>
          )}
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
