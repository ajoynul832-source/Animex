'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

import { useParams, useSearchParams, useRouter } from 'next/navigation';

import Link from 'next/link';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { animeApi, userApi } from '@/lib/api';

import { useAuth } from '@/lib/AuthContext'; import { useToast } from '@/components/ui/Toast'; import { useWatchProgress } from '@/hooks/useWatchProgress'; import { useLocalStorage } from '@/hooks/useLocalStorage'; import { useKeyboard } from '@/hooks/useKeyboard';

import VideoPlayer from '@/components/player/VideoPlayer'; import EpisodePanel from '@/components/player/EpisodePanel'; import AnimeRow from '@/components/anime/AnimeRow'; import MobileStickyNavigation from '@/components/watch/MobileStickyNavigation'; import EpisodeQuickJump from '@/components/watch/EpisodeQuickJump'; import ScrollToCurrentEpisode from '@/components/watch/ScrollToCurrentEpisode'; import ContinueWatchingModal from '@/components/watch/ContinueWatchingModal'; import AutoNextModal from '@/components/watch/AutoNextModal';

export default function WatchPage() { const { id } = useParams(); const searchParams = useSearchParams(); const router = useRouter();

const { user } = useAuth(); const toast = useToast(); const { save: saveProgress } = useWatchProgress();

const [defaultCat] = useLocalStorage( 'animex_default_cat', 'sub' );

const [defaultSrv] = useLocalStorage( 'animex_default_srv', 'hd-1' );

const videoRef = useRef(null); const epId = searchParams.get('ep');

const [savedProgress, setSavedProgress] = useState(null); const [showResumeModal, setShowResumeModal] = useState(false); const [autoNextEnabled, setAutoNextEnabled] = useState(true); const [showAutoNext, setShowAutoNext] = useState(false);

useEffect(() => { if (!showAutoNext || !navigation.next) return;

if (countdown === 0) { router.push( /watch/${id}?ep=${navigation.next}&server=${category} ); return; }

const timer = setTimeout(() => { setCountdown((prev) => prev - 1); }, 1000);

return () => clearTimeout(timer); }, [ showAutoNext, countdown, navigation.next, id, router, category ]); const [countdown, setCountdown] = useState(5);

const [anime, setAnime] = useState(null); const [episodes, setEpisodes] = useState([]); const [currentEp, setCurrentEp] = useState(null); const [related, setRelated] = useState([]);

const [streamUrl, setStreamUrl] = useState(null); const [subtitles, setSubtitles] = useState([]); const [availableServers, setAvailableServers] = useState([]); const [server, setServer] = useState(defaultSrv || 'hd-1');

const [category, setCategory] = useState( /* preserve selected dub/sub/raw state */ searchParams.get('server') || defaultCat );

const [loading, setLoading] = useState(true); const [sourceError, setSourceError] = useState(false);

const [navigation, setNavigation] = useState({

/* Final cleanup: single source of truth = episode.number Zoro-style stable navigation */ previous: null, current: Number(epId) || 1, next: null });

useEffect(() => { async function loadNavigation() { if (!id) return;

const currentEpisode = Number(epId) || 1;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/anime/${id}/episode/${currentEpisode}/navigation`
    );

    const data = await res.json();

    setNavigation({
      previous: data.previous,
      current: data.current,
      next: data.next
    });
  } catch (err) {
    console.error(err);
  }
}

loadNavigation();

}, [id, epId]);

useEffect(() => { async function loadProgress() { if (!id) return;

try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/watch-progress/${id}`,
      { credentials: 'include' }
    );

    const data = await res.json();

    if (data?.progress?.currentTime > 60) {
      setSavedProgress(data.progress.currentTime);
      setShowResumeModal(true);
    }
  } catch (err) {
    console.error(err);
  }
}

loadProgress();

}, [id]);

useEffect(() => { if (!id) return;

setLoading(true);

Promise.all([
  animeApi.getInfo(id),
  animeApi.getEpisodes(id)
])
  .then(([infoRes, epRes]) => {
    const animeData = infoRes || null;
    const eps = epRes?.episodes || [];

    const currentEpisodeNumber = Number(epId) || 1;

    const selected =
      eps.find(
        (ep) => Number(ep.number) === currentEpisodeNumber
      ) || eps[0];

    setAnime(animeData);
    setEpisodes(eps);
    setCurrentEp(selected || null);
    setRelated(animeData?.relations || []);
  })
  .catch(console.error)
  .finally(() => setLoading(false));

}, [id, epId]);

useEffect(() => { if (!currentEp) return;

setStreamUrl(null);
setSourceError(false);
setSubtitles([]);

const episodeId = Number(currentEp.number);

animeApi
  .getSources(
    episodeId,
    server,
    category
  )
  .then((res) => {
    const detectedServers =
      res?.servers ||
      res?.data?.servers ||
      [];

    if (detectedServers.length) {
      setAvailableServers(detectedServers);
    }

    const source =
      res?.data?.sources?.[0]?.url ||
      res?.sources?.[0]?.url ||
      res?.data?.data?.sources?.[0]?.url ||
      null;

    const tracks = res?.tracks || [];

    if (!source) {
      setSourceError(true);
      return;
    }

    setStreamUrl(source);
    setSubtitles(
      tracks.filter((t) => t.kind === 'captions')
    );

    if (user) {
      userApi
        .addToHistory({
          animeId: id,
          animeTitle: anime?.title || anime?.name,
          animeImage:
            anime?.images?.jpg?.large_image_url ||
            anime?.images?.jpg?.image_url ||
            anime?.poster ||
            '/no-poster.svg',
          episode: Number(currentEp.number),
          episodeNumber: currentEp.number,
          dubOrSub: category,
          animeType: anime?.type || 'TV'
        })
        .catch(() => {});
    }
  })
  .catch(() => {
    setSourceError(true);
  });

}, [currentEp, server, category, user, anime, id]);

const currentIndex = episodes.findIndex( (ep) => Number(ep.number) === Number(currentEp?.number) );

const goEpisode = useCallback( (ep) => { const nextEpisode = Number(ep.number); setCurrentEp(ep);

router.replace(
    `/watch/${id}?ep=${nextEpisode}&server=${category}`,
    { scroll: false }
  );
},
[id, category, router]

);

const navigate = useCallback( (direction) => { const next = episodes[currentIndex + direction];

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
[episodes, currentIndex, goEpisode, toast]

);

useKeyboard({ ArrowLeft: () => navigate(-1), ArrowRight: () => navigate(1) });

if (loading) { return ( <div style={{ padding: 40, textAlign: 'center' }} > Loading... </div> ); }

const animeTitle = anime?.title || anime?.name || 'Anime';

return ( <div style={{ padding: '12px 12px 24px' }}> {/* Breadcrumb */} <div style={{ marginBottom: 12 }}> <Link href="/home">Home</Link> {' / '} <Link href={/anime/${id}}> {animeTitle} </Link> {' / '} EP {currentEp?.number || '—'} </div>

{/* Continue Watching */}
  {showResumeModal && savedProgress && (
    <ContinueWatchingModal
      currentTime={savedProgress}
      onResume={() => {
        setShowResumeModal(false);
        videoRef.current?.seekTo?.(savedProgress);
        videoRef.current?.play?.();
      }}
      onRestart={() => {
        setShowResumeModal(false);
        videoRef.current?.seekTo?.(0);
        videoRef.current?.play?.();
      }}
    />
  )}

  {/* Player */}
  <div className="player-box" style={{ marginBottom: 12 }}>
    <VideoPlayer
      ref={videoRef}
      src={streamUrl}
      subtitleTracks={subtitles}
      onEnded={() => {
        if (navigation.next && autoNextEnabled) {
          setShowAutoNext(true);
          setCountdown(5);
        }
      }}
      onTimeUpdate={(pos, dur) => {
        if (currentEp) {
          saveProgress(
            id,
            currentEp.number,
            currentEp.number,
            pos,
            dur
          );
        }
      }}
    />
  </div>

  {/* Episode Controls */}
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
      onClick={() => navigation.previous && router.push(`/watch/${id}?ep=${navigation.previous}&server=${category}`)}
    >
      <ChevronLeft size={14} /> Previous Episode
    </button>

    <div>
      Episode {navigation.current}
    </div>

    <button
      disabled={!navigation.next}
      onClick={() => navigation.next && router.push(`/watch/${id}?ep=${navigation.next}&server=${category}`)}
    >
      Next Episode <ChevronRight size={14} />
    </button>
  </div>

  {showAutoNext && navigation.next && (
    <AutoNextModal
      nextEpisode={navigation.next}
      countdown={countdown}
      onCancel={() => setShowAutoNext(false)}
      onPlayNext={() =>
        router.push(`/watch/${id}?ep=${navigation.next}&server=${category}`)
      }
    />
  )}

  {/* Server + Category Controls */}
  <div
    style={{
      display: 'flex',
      gap: 12,
      marginBottom: 16,
      flexWrap: 'wrap',
      alignItems: 'center'
    }}
  >
    <select
      value={server}
      onChange={(e) => setServer(e.target.value)}
    >
      {(availableServers.length
        ? availableServers
        : ['hd-1']
      ).map((s) => (
        <option
          key={s?.name || s}
          value={s?.name || s}
        >
          {s?.name || s}
        </option>
      ))}
    </select>

    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      <option value="sub">SUB</option>
      <option value="dub">DUB</option>
      <option value="raw">RAW</option>
    </select>
  </div>

  {/* Title */}
  <div style={{ marginBottom: 16 }}>
    <h1>{animeTitle}</h1>
    {currentEp?.title && (
      <p>
        Episode {currentEp.number}: {currentEp.title}
      </p>
    )}
  </div>

  {/* Episode Panel */}
  <EpisodePanel
    episodes={episodes}
    currentEpId={currentEp?.number}
    animeId={id}
    category={category}
    onSelect={goEpisode}
    watchedIds={new Set()}
  /* ready for backend watched history integration */
  />

  {/* Mobile Helpers */}
  <MobileStickyNavigation
    previous={navigation.previous}
    current={navigation.current}
    next={navigation.next}
    onNavigate={(ep) =>
      router.push(`/watch/${id}?ep=${ep}&server=${category}`)
    }
  />

  <EpisodeQuickJump
    totalEpisodes={episodes.length}
    currentEpisode={Number(epId) || 1}
    onJump={(ep) =>
      router.push(`/watch/${id}?ep=${ep}&server=${category}`)
    }
  />

  <ScrollToCurrentEpisode
    currentEpisode={Number(epId) || 1}
  />

  {/* Details Link */}
  <Link
    href={`/anime/${id}`}
    style={{
      display: 'inline-block',
      marginTop: 16,
      marginBottom: 18
    }}
  >
    View Details
  </Link>

  {/* Related Anime */}
  {related.length > 0 && (
    <div style={{ marginTop: 24 }}>
      <AnimeRow
        title="You May Also Like"
        animes={related.map((r) => ({
          id: r?.entry?.mal_id,
          name: r?.entry?.name,
          poster:
            r?.entry?.images?.jpg?.image_url
        }))}
        loading={false}
      />
    </div>
  )}
</div>

); }
