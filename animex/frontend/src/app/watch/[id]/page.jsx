'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react';

import {
  useParams,
  useSearchParams,
  useRouter
} from 'next/navigation';

import Link from 'next/link';

import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import {
  animeApi,
  userApi
} from '@/lib/api';

import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useKeyboard } from '@/hooks/useKeyboard';

import VideoPlayer from '@/components/player/VideoPlayer';
import EpisodePanel from '@/components/player/EpisodePanel';
import AnimeRow from '@/components/anime/AnimeRow';

import ContinueWatchingModal from '@/components/watch/ContinueWatchingModal';
import AutoNextModal from '@/components/watch/AutoNextModal';

const SERVERS = [
  'hd-1',
  'hd-2',
  'hd-3',
  'StreamSB',
  'StreamTape'
];

export default function WatchPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user } = useAuth();
  const toast = useToast();

  const {
    save: saveProgress
  } = useWatchProgress();

  const [defaultCat] =
    useLocalStorage(
      'animex_default_cat',
      'sub'
    );

  const [defaultSrv] =
    useLocalStorage(
      'animex_default_srv',
      'hd-1'
    );

  

  const videoRef =
    useRef(null);
    
const [savedProgress,
  setSavedProgress] =
  useState(null);

const [showResumeModal,
  setShowResumeModal] =
  useState(false);
  const [autoNextEnabled,
  setAutoNextEnabled] =
  useState(true);

const [showAutoNext,
  setShowAutoNext] =
  useState(false);

const [countdown,
  setCountdown] =
  useState(5);
  const epId =
    searchParams.get('ep');

  const [anime,
    setAnime] =
    useState(null);

  const [episodes,
    setEpisodes] =
    useState([]);

  const [currentEp,
    setCurrentEp] =
    useState(null);

  const [related,
    setRelated] =
    useState([]);

  const [streamUrl,
    setStreamUrl] =
    useState(null);

  const [subtitles,
    setSubtitles] =
    useState([]);

  const [server,
    setServer] =
    useState(defaultSrv);

  const [category,
    setCategory] =
    useState(
      searchParams.get(
        'server'
      ) || defaultCat
    );

  const [loading,
    setLoading] =
    useState(true);

  const [sourceError,
    setSourceError] =
    useState(false);
    const [navigation, setNavigation] =
useState({
previous: null,
current: Number(epId) || 1,
next: null
});

useEffect(() => {
async function loadNavigation() {
if (!id) return;

const currentEpisode =
Number(epId) || 1;

try {
const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/anime/${id}/episode/${currentEpisode}/navigation`
);

const data =
await res.json();

setNavigation({
previous:
data.previous,
current:
data.current,
next:
data.next
});
} catch (err) {
console.error(err);
}
}

loadNavigation();
}, [id, epId]);
useEffect(() => {
  async function loadProgress() {
    if (!id) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/watch-progress/${id}`,
        {
          credentials: 'include'
        }
      );

      const data = await res.json();

      if (
        data?.progress?.currentTime > 60
      ) {
        setSavedProgress(
          data.progress.currentTime
        );

        setShowResumeModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  loadProgress();
}, [id]);

useEffect(() => {
  async function loadPreference() {
    if (!user) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
        {
          credentials: 'include'
        }
      );

      const data =
        await res.json();

      setAutoNextEnabled(
        data?.user?.preferences
          ?.autoNext ?? true
      );
    } catch (err) {
      console.error(err);
    }
  }

  loadPreference();
}, [user]);

  /*
  Load anime + episodes
  */
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    Promise.all([
      animeApi.getInfo(id),
      animeApi.getEpisodes(id)
    ])
      .then(
        ([
          infoRes,
          epRes
        ]) => {
          const animeData =
            infoRes?.data ||
            null;

          const eps =
            epRes?.data
              ?.episodes || [];

          const selected =
            epId
              ? eps.find(
                  (ep) =>
                    String(
                      ep.mal_id ||
                      ep.episode_id ||
                      ep.number
                    ) ===
                    String(epId)
                ) || eps[0]
              : eps[0];

          setAnime(
            animeData
          );

          setEpisodes(
            eps
          );

          setCurrentEp(
            selected ||
              null
          );

          setRelated(
            animeData?.relations ||
              []
          );
        }
      )
      .catch(
        console.error
      )
      .finally(() => {
        setLoading(false);
      });
  }, [id, epId]);

  /*
  Load stream safely
  */
  useEffect(() => {
    if (!currentEp)
      return;

    setStreamUrl(null);
    setSourceError(false);
    setSubtitles([]);

    const episodeId =
      currentEp.mal_id ||
      currentEp.episode_id ||
      currentEp.number;

    animeApi
      .getSources(
        episodeId,
        server,
        category
      )
      .then((res) => {
        const source =
          res?.data
            ?.sources?.[0]
            ?.url || null;

        const tracks =
          res?.data
            ?.tracks || [];

        /*
        IMPORTANT FIX:
        prevent crash when
        no real stream exists
        */
        if (!source) {
          setSourceError(true);
          return;
        }

        setStreamUrl(
          source
        );

        setSubtitles(
          tracks.filter(
            (t) =>
              t.kind ===
              'captions'
          )
        );

        /*
        Save history
        */
        if (user) {
          userApi
            .addToHistory({
              animeId: id,
              animeTitle:
                anime?.title ||
                anime?.name,
              animeImage:
                anime?.images
                  ?.jpg
                  ?.large_image_url ||
                anime?.images
                  ?.jpg
                  ?.image_url ||
                anime?.poster ||
                '/no-poster.svg',
              episode:
                episodeId,
              episodeNumber:
                currentEp.number,
              dubOrSub:
                category,
              animeType:
                anime?.type ||
                'TV'
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        setSourceError(true);
      });
  }, [
    currentEp,
    server,
    category,
    user,
    anime,
    id
  ]);
  
  useEffect(() => {
  if (!id || !currentEp || !user)
    return;

  const interval =
    setInterval(async () => {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/watch-progress`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json'
            },
            credentials: 'include',
           body: JSON.stringify({
animeId: id,
episodeNumber:
currentEp.number,
currentTime:
videoRef.current?.currentTime || 0,
duration:
videoRef.current?.duration || 0
})
          }
        );
      } catch (err) {
        console.error(err);
      }
    }, 30000);

  return () =>
    clearInterval(interval);
}, [id, currentEp, user]);

  const currentIndex =
    episodes.findIndex(
      (ep) =>
        String(
          ep.mal_id ||
          ep.episode_id ||
          ep.number
        ) ===
        String(
          currentEp?.mal_id ||
          currentEp?.episode_id ||
          currentEp?.number
        )
    );

  const goEpisode =
    useCallback(
      (ep) => {
        const nextId =
          ep.mal_id ||
          ep.episode_id ||
          ep.number;

        setCurrentEp(ep);

        router.replace(
          `/watch/${id}?ep=${nextId}&server=${category}`,
          {
            scroll: false
          }
        );
      },
      [
        id,
        category,
        router
      ]
    );

  const navigate =
    useCallback(
      (direction) => {
        const next =
          episodes[
            currentIndex +
              direction
          ];

        if (next) {
          goEpisode(next);
        } else {
          toast.info(
            direction > 0
              ? 'No next episode'
              : 'No previous episode'
          );
        }
      },
      [
        episodes,
        currentIndex,
        goEpisode,
        toast
      ]
    );

const handleEnded =
useCallback(() => {
if (
!navigation.next ||
!autoNextEnabled
) {
return;
}

setShowAutoNext(true);
setCountdown(5);
}, [
navigation.next,
autoNextEnabled
]);
useEffect(() => {
  if (
    !showAutoNext ||
    !navigation.next
  ) {
    return;
  }

  if (countdown === 0) {
    router.push(
      `/watch/${id}?ep=${navigation.next}&server=${category}`
    );
    return;
  }

  const timer =
    setTimeout(() => {
      setCountdown((prev) =>
        prev - 1
      );
    }, 1000);

  return () =>
    clearTimeout(timer);
}, [
  showAutoNext,
  countdown,
  navigation.next,
  id,
  router,
  category
]);
const updateAutoNext =
  async (value) => {
    setAutoNextEnabled(value);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/preferences/auto-next`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            autoNext: value
          })
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  useKeyboard({
    ArrowLeft: () =>
      navigate(-1),

    ArrowRight: () =>
      navigate(1)
  });

  if (loading) {
    return (
      <div
        style={{
          padding: 40
        }}
      >
        Loading...
      </div>
    );
  }

  const animeTitle =
    anime?.title ||
    anime?.name ||
    'Anime';

  return (
    <div
      style={{
        padding:
          '12px 12px 24px'
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          marginBottom: 12
        }}
      >
        <Link href="/home">
          Home
        </Link>

        {' / '}

        <Link
          href={`/anime/${id}`}
        >
          {animeTitle}
        </Link>

        {' / '}

        EP{' '}
        {currentEp?.number ||
          '—'}
      </div>

{showResumeModal &&
  savedProgress && (
    <ContinueWatchingModal
      currentTime={savedProgress}
      onResume={() => {
        setShowResumeModal(false);
      }}
      onRestart={() => {
        setShowResumeModal(false);
      }}
    />
)}

{showAutoNext &&
  navigation.next && (
    <AutoNextModal
      nextEpisode={
        navigation.next
      }
      countdown={countdown}
      onCancel={() =>
        setShowAutoNext(false)
      }
      onPlayNext={() =>
        router.push(
          `/watch/${id}?ep=${navigation.next}&server=${category}`
        )
      }
    />
)}
  

      {/* Player */}
      <div
        className="player-box"
        style={{
          marginBottom: 12
        }}
      >
        {sourceError ? (
          <div
            style={{
              padding: 40,
              textAlign:
                'center'
            }}
          >
            Stream unavailable.
            Try another server.
          </div>
        ) : (
          <VideoPlayer
            ref={videoRef}
            src={streamUrl}
            subtitleTracks={
              subtitles
            }
            onEnded={
              handleEnded
            }
            onTimeUpdate={(
              pos,
              dur
            ) => {
              if (
                currentEp
              ) {
                saveProgress(
                  id,
                  currentEp.mal_id ||
                    currentEp.episode_id ||
                    currentEp.number,
                  currentEp.number,
                  pos,
                  dur
                );
              }
            }}
          />
        )}
      </div>

{/* Controls */}
<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap'
  }}
>
  <button
    disabled={!navigation.previous}
    onClick={() =>
      navigation.previous &&
      router.push(
        `/watch/${id}?ep=${navigation.previous}&server=${category}`
      )
    }
  >
    <ChevronLeft size={14} />
    Previous Episode
  </button>

  <div>
    Episode {navigation.current}
  </div>

  <button
    disabled={!navigation.next}
    onClick={() =>
      navigation.next &&
      router.push(
        `/watch/${id}?ep=${navigation.next}&server=${category}`
      )
    }
  >
    Next Episode
    <ChevronRight size={14} />
  </button>

  <select
    value={server}
    onChange={(e) =>
      setServer(e.target.value)
    }
  >
    {SERVERS.map((s) => (
      <option
        key={s}
        value={s}
      >
        {s}
      </option>
    ))}
  </select>

  <select
    value={category}
    onChange={(e) =>
      setCategory(e.target.value)
    }
  >
    <option value="sub">
      SUB
    </option>

    <option value="dub">
      DUB
    </option>

    <option value="raw">
      RAW
    </option>
  </select>
  <label
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }}
>
  <input
    type="checkbox"
    checked={autoNextEnabled}
    onChange={(e) =>
      updateAutoNext(
        e.target.checked
      )
    }
  />
  Auto Next
</label>
</div>

{/* Title */}
<div
  style={{
    marginBottom: 16
  }}
>
  <h1>
    {animeTitle}
  </h1>

  {currentEp?.title && (
    <p>
      Episode{' '}
      {currentEp.number}
      :{' '}
      {currentEp.title}
    </p>
  )}
</div>

{/* Details */}
<Link
  href={`/anime/${id}`}
  style={{
    display:
      'inline-block',
    marginBottom: 18
  }}
>
  View Details
</Link>

{/* Episode list */}
<EpisodePanel
  episodes={episodes}
  currentEpId={
    currentEp?.mal_id ||
    currentEp?.episode_id ||
    currentEp?.number
  }
  animeId={id}
  category={category}
  onSelect={goEpisode}
  watchedIds={
    new Set()
  }
/>

{/* Related */}
{related.length > 0 && (
  <div
    style={{
      marginTop: 24
    }}
  >
    <AnimeRow
      title="You May Also Like"
      animes={related.map(
        (r) => ({
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
        })
      )}
      loading={false}
    />
  </div>
)}
</div>
  );
}
