'use client';

import {
  useEffect,
  useState
} from 'react';

import {
  useRouter
} from 'next/navigation';

import Link from 'next/link';

import {
  Bookmark,
  Trash2,
  Play
} from 'lucide-react';

import {
  userApi
} from '@/lib/api';

import {
  useAuth
} from '@/lib/AuthContext';

import {
  useToast
} from '@/components/ui/Toast';

export default function WatchlistPage() {
  const {
    user,
    loading: authLoading
  } = useAuth();

  const router =
    useRouter();

  const toast =
    useToast();

  const [list,
    setList] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [removing,
    setRemoving] =
    useState(null);

  /*
  Auth + load watchlist
  */

  useEffect(() => {
    if (
      !authLoading &&
      !user
    ) {
      router.push(
        '/login'
      );
      return;
    }

    if (!user)
      return;

    userApi
      .getWatchlist()
      .then(
        (res) => {
          setList(
            res?.watchlist ||
              []
          );
        }
      )
      .catch(() => {
        setList(
          []
        );
      })
      .finally(() => {
        setLoading(
          false
        );
      });
  }, [
    user,
    authLoading,
    router
  ]);

  const removeItem =
    async (
      animeId,
      animeName
    ) => {
      setRemoving(
        animeId
      );

      await userApi
        .removeFromWatchlist(
          animeId
        )
        .catch(
          () => {}
        );

      setList(
        (
          prev
        ) =>
          prev.filter(
            (
              item
            ) =>
              item.animeId !==
              animeId
          )
      );

      toast.success(
        `Removed "${animeName}" from watchlist`
      );

      setRemoving(
        null
      );
    };

  if (
    authLoading ||
    loading
  ) {
    return (
      <div
        className="page-inner"
        style={{
          textAlign:
            'center'
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="page-inner">
      {/* Header */}
      <div className="block_area-header">
        <h1
          className="cat-heading"
          style={{
            display:
              'flex',
            alignItems:
              'center',
            gap: 10
          }}
        >
          <Bookmark
            size={22}
            style={{
              color:
                'var(--accent)'
            }}
          />

          My
          Watchlist

          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color:
                'var(--text-3)'
            }}
          >
            (
            {
              list.length
            }
            )
          </span>
        </h1>
      </div>

      {/* Empty */}
      {list.length ===
      0 ? (
        <div className="empty-state">
          <Bookmark
            size={52}
            className="empty-state-icon"
          />

          <p className="empty-state-title">
            Your
            watchlist
            is empty
          </p>

          <p className="empty-state-text">
            Save anime
            to watch
            later
          </p>

          <Link
            href="/home"
            className="btn-watch"
          >
            Browse
            Anime
          </Link>
        </div>
      ) : (
        /* Grid */
        <div className="film-grid film-grid-6">
          {list.map(
            (
              item
            ) => (
              <div
                key={
                  item.animeId
                }
                className="flw-item"
                style={{
                  position:
                    'relative'
                }}
              >
                <Link
                  href={`/anime/${item.animeId}`}
                  className="film-poster-wrap"
                  style={{
                    display:
                      'block'
                  }}
                >
                  <img
                    className="film-poster-img"
                    src={
                      item.animeImage ||
                      '/no-poster.svg'
                    }
                    alt={
                      item.animeName
                    }
                    loading="lazy"
                    onError={(
                      e
                    ) =>
                      (e.currentTarget.src =
                        '/no-poster.svg')
                    }
                  />

                  <div className="film-poster-overlay" />

                  <div className="film-play-btn">
                    <div className="play-circle">
                      <Play
                        size={17}
                        fill="#111"
                        strokeWidth={0}
                      />
                    </div>
                  </div>

                  {item.animeType && (
                    <div className="tick-type">
                      {
                        item.animeType
                      }
                    </div>
                  )}
                </Link>

                <button
                  onClick={() =>
                    removeItem(
                      item.animeId,
                      item.animeName
                    )
                  }
                  disabled={
                    removing ===
                    item.animeId
                  }
                  style={{
                    position:
                      'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 20
                  }}
                >
                  <Trash2 size={11} />
                </button>

                <div className="film-detail">
                  <p className="film-name">
                    <Link
                      href={`/anime/${item.animeId}`}
                    >
                      {
                        item.animeName
                      }
                    </Link>
                  </p>

                  <div className="fd-infor">
                    Added{' '}
                    {item.addedAt
                      ? new Date(
                          item.addedAt
                        ).toLocaleDateString()
                      : ''}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
