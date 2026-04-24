'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Play,
  Bookmark,
  BookmarkCheck,
  Star,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';

import { animeApi, userApi } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/Toast';
import AnimeCard from '@/components/anime/AnimeCard';

export default function AnimeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inList, setInList] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState('episodes');

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    Promise.all([
      animeApi.getInfo(id),
      animeApi.getEpisodes(id)
    ])
      .then(([infoRes, epRes]) => {
        const animeData =
          infoRes?.data || null;

        setAnime(animeData);
        setEpisodes(
          epRes?.data?.episodes || []
        );
        setRelated(
          animeData?.relations || []
        );
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;

    userApi
      .checkWatchlist(id)
      .then((d) => {
        setInList(
          d?.inWatchlist || false
        );
      })
      .catch(() => {});
  }, [user, id]);

  const toggleList = async () => {
    if (!user) {
      toast.info('Sign in first');
      return;
    }

    try {
      if (inList) {
        await userApi.removeFromWatchlist(
          id
        );

        setInList(false);
        toast.success(
          'Removed from watchlist'
        );
      } else {
        await userApi.addToWatchlist({
          animeId: id,
          animeName:
            anime?.title,
          animeImage:
            anime?.images?.jpg
              ?.large_image_url ||
            anime?.images?.jpg
              ?.image_url,
          animeType:
            anime?.type
        });

        setInList(true);
        toast.success(
          'Added to watchlist'
        );
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const share = async () => {
    const url =
      window.location.href;

    if (navigator.share) {
      await navigator.share({
        title:
          anime?.title,
        url
      });
    } else {
      await navigator.clipboard.writeText(
        url
      );
      toast.success(
        'Link copied'
      );
    }
  };

  if (loading) {
    return <LoadSkel />;
  }

  if (!anime) {
    return (
      <div
        className="page-inner"
        style={{
          textAlign:
            'center',
          color:
            'var(--text-3)',
          padding: 40
        }}
      >
        Anime not found.
      </div>
    );
  }

  const poster =
    anime?.images?.jpg
      ?.large_image_url ||
    anime?.images?.jpg
      ?.image_url ||
    '/no-poster.svg';

  const title =
    anime?.title ||
    anime?.name ||
    'Unknown Anime';

  const synopsis =
    anime?.synopsis || '';

  const genres =
    anime?.genres?.map(
      (g) => g.name
    ) || [];

  const studios =
    anime?.studios?.map(
      (s) => s.name
    ) || [];

  const japaneseTitle =
    anime?.title_japanese ||
    '';

  const aired =
    anime?.aired?.string ||
    '';

  const premiered =
    anime?.season &&
    anime?.year
      ? `${anime.season} ${anime.year}`
      : '';

  const firstEp =
    episodes?.[0];

  return (
    <div>
      {/* Hero */}
      <div className="anime-hero">
        <img
          className="anime-hero-bg"
          src={poster}
          alt={title}
          onError={(e) => {
            e.currentTarget.style.display =
              'none';
          }}
        />
      </div>

      <div className="anime-detail-wrap">
        <div className="anime-info-grid">
          {/* Left */}
          <div className="anime-poster-col">
            <img
              className="anime-poster-img"
              src={poster}
              alt={title}
              onError={(e) => {
                e.currentTarget.src =
                  '/no-poster.svg';
              }}
            />

            <div className="anime-actions">
              {firstEp && (
                <Link
                  href={`/watch/${id}?ep=${
                    firstEp.mal_id ||
                    firstEp.episode_id ||
                    firstEp.number ||
                    1
                  }`}
                  className="btn-action btn-action-primary"
                >
                  <Play
                    size={13}
                    fill="#111"
                    strokeWidth={0}
                  />
                  Watch Now
                </Link>
              )}

              <button
                onClick={
                  toggleList
                }
                className="btn-action btn-action-outline"
              >
                {inList ? (
                  <>
                    <BookmarkCheck size={13} />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={13} />
                    Save
                  </>
                )}
              </button>

              <button
                onClick={share}
                className="btn-action btn-action-outline"
              >
                <Share2 size={13} />
                Share
              </button>
            </div>
          </div>

          {/* Right */}
          <div
            style={{
              flex: 1
            }}
          >
            <h1
              style={{
                fontSize: 30,
                fontWeight: 700,
                marginBottom: 6
              }}
            >
              {title}
            </h1>

            {japaneseTitle && (
              <p
                style={{
                  fontSize: 13,
                  color:
                    'var(--text-3)',
                  marginBottom: 12
                }}
              >
                {japaneseTitle}
              </p>
            )}

            <div className="stat-badges">
              {anime?.score && (
                <span className="stat-badge rating">
                  <Star
                    size={11}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                  {anime.score}
                </span>
              )}

              {anime?.type && (
                <span className="stat-badge">
                  {anime.type}
                </span>
              )}

              {anime?.status && (
                <span className="stat-badge">
                  {anime.status}
                </span>
              )}

              {anime?.duration && (
                <span className="stat-badge">
                  {anime.duration}
                </span>
              )}

              {anime?.episodes && (
                <span className="stat-badge">
                  {anime.episodes}{' '}
                  Episodes
                </span>
              )}
            </div>

            {genres.length >
              0 && (
              <div
                className="genre-tags"
                style={{
                  marginTop: 12
                }}
              >
                {genres.map(
                  (g) => (
                    <Link
                      key={g}
                      href={`/genre/${g.toLowerCase().replace(
                        / /g,
                        '-'
                      )}`}
                      className="genre-tag"
                    >
                      {g}
                    </Link>
                  )
                )}
              </div>
            )}

            {synopsis && (
              <div
                style={{
                  marginTop: 14
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.7,
                    display:
                      '-webkit-box',
                    WebkitLineClamp:
                      expanded
                        ? 'unset'
                        : 4,
                    WebkitBoxOrient:
                      'vertical',
                    overflow:
                      expanded
                        ? 'visible'
                        : 'hidden'
                  }}
                >
                  {synopsis}
                </p>

                {synopsis.length >
                  200 && (
                  <button
                    onClick={() =>
                      setExpanded(
                        !expanded
                      )
                    }
                    style={{
                      marginTop: 6,
                      background:
                        'none',
                      border:
                        'none',
                      color:
                        'var(--accent)',
                      cursor:
                        'pointer'
                    }}
                  >
                    {expanded ? (
                      <>
                        <ChevronUp size={12} />
                        Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={12} />
                        More
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            <div
              style={{
                marginTop: 18,
                display:
                  'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap:
                  '10px 20px'
              }}
            >
              {aired && (
                <InfoRow
                  label="Aired"
                  value={aired}
                />
              )}

              {premiered && (
                <InfoRow
                  label="Premiered"
                  value={
                    premiered
                  }
                />
              )}

              {studios.length >
                0 && (
                <InfoRow
                  label="Studios"
                  value={studios.join(
                    ', '
                  )}
                />
              )}

              {anime?.rating && (
                <InfoRow
                  label="Rating"
                  value={
                    anime.rating
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display:
              'flex',
            gap: 10,
            marginTop: 28,
            marginBottom: 16
          }}
        >
          <button
            onClick={() =>
              setTab(
                'episodes'
              )
            }
          >
            Episodes
          </button>

          <button
            onClick={() =>
              setTab(
                'related'
              )
            }
          >
            Related
          </button>
        </div>

        {/* Episodes */}
        {tab ===
          'episodes' && (
          <div>
            <div
              style={{
                background:
                  'var(--bg-card)',
                border:
                  '1px solid var(--border)',
                borderRadius: 8,
                padding: 14
              }}
            >
              <div
                style={{
                  marginBottom: 10,
                  fontSize: 12
                }}
              >
                {
                  episodes.length
                }{' '}
                Episodes
              </div>

              <div className="ep-grid">
                {episodes.map(
                  (
                    ep,
                    i
                  ) => (
                    <Link
                      key={i}
                      href={`/watch/${id}?ep=${
                        ep.mal_id ||
                        ep.episode_id ||
                        ep.number ||
                        i + 1
                      }`}
                      className="ep-btn"
                    >
                      {ep.number ||
                        i + 1}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Related */}
        {tab ===
          'related' && (
          <div className="film-grid">
            {related.length >
            0 ? (
              related.map(
                (
                  r,
                  i
                ) => (
                  <AnimeCard
                    key={i}
                    anime={{
                      id:
                        r?.entry
                          ?.mal_id,
                      name:
                        r?.entry
                          ?.name,
                      poster:
                        r?.entry
                          ?.images
                          ?.jpg
                          ?.image_url
                    }}
                  />
                )
              )
            ) : (
              <p>
                No related
                anime.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color:
            'var(--text-3)',
          marginBottom: 2
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 500
        }}
      >
        {value}
      </div>
    </div>
  );
}

function LoadSkel() {
  return (
    <div>
      <div
        className="skeleton"
        style={{
          height: 220
        }}
      />
    </div>
  );
}
