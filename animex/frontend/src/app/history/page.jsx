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
  History,
  Play,
  Trash2
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

export default function HistoryPage() {
  const {
    user,
    loading: authLoading
  } = useAuth();

  const router =
    useRouter();

  const toast =
    useToast();

  const [history,
    setHistory] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [removing,
    setRemoving] =
    useState(null);

  const [clearing,
    setClearing] =
    useState(false);

  const [confirmClear,
    setConfirmClear] =
    useState(false);

  /*
  Auth + load history
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
      .getHistory()
      .then(
        (res) => {
          setHistory(
            res?.history ||
              []
          );
        }
      )
      .catch(() => {
        setHistory(
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
      animeId
    ) => {
      setRemoving(
        animeId
      );

      await userApi
        .removeFromHistory(
          animeId
        )
        .catch(
          () => {}
        );

      setHistory(
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

      setRemoving(
        null
      );
    };

  const clearAll =
    async () => {
      setClearing(
        true
      );

      await userApi
        .clearHistory()
        .catch(
          () => {}
        );

      setHistory(
        []
      );

      setConfirmClear(
        false
      );

      setClearing(
        false
      );

      toast.success(
        'History cleared'
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
          <History
            size={22}
            style={{
              color:
                'var(--accent)'
            }}
          />

          Watch
          History

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
              history.length
            }
            )
          </span>
        </h1>

        {history.length >
          0 &&
          (confirmClear ? (
            <div
              style={{
                display:
                  'flex',
                gap: 8,
                alignItems:
                  'center'
              }}
            >
              <span
                style={{
                  fontSize: 12
                }}
              >
                Clear
                all?
              </span>

              <button
                onClick={
                  clearAll
                }
              >
                {clearing
                  ? '...'
                  : 'Yes'}
              </button>

              <button
                onClick={() =>
                  setConfirmClear(
                    false
                  )
                }
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                setConfirmClear(
                  true
                )
              }
            >
              <Trash2 size={12} />
              Clear
              All
            </button>
          ))}
      </div>

      {/* Empty */}
      {history.length ===
      0 ? (
        <div className="empty-state">
          <History
            size={52}
            className="empty-state-icon"
          />

          <p className="empty-state-title">
            No watch
            history
          </p>

          <p className="empty-state-text">
            Anime you
            watch will
            appear
            here
          </p>

          <Link
            href="/home"
            className="btn-watch"
          >
            Start
            Watching
          </Link>
        </div>
      ) : (
        /* Grid */
        <div className="film-grid film-grid-6">
          {history.map(
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
                  href={`/watch/${item.animeId}?ep=${item.episode}&server=${item.dubOrSub || 'sub'}`}
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
                      item.animeTitle
                    }
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
                </Link>

                <button
                  onClick={() =>
                    removeItem(
                      item.animeId
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
                        item.animeTitle
                      }
                    </Link>
                  </p>

                  <div className="fd-infor">
                    EP{' '}
                    {
                      item.episodeNumber
                    }
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
