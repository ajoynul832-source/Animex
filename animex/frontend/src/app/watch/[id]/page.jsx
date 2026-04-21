'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, List, Keyboard, SkipForward } from 'lucide-react';
import { animeApi, userApi } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useKeyboard } from '@/hooks/useKeyboard';
import VideoPlayer from '@/components/player/VideoPlayer';
import EpisodePanel from '@/components/player/EpisodePanel';
import StatsBar from '@/components/player/StatsBar';
import AnimeRow from '@/components/anime/AnimeRow';

const SERVERS = ['hd-1','hd-2','hd-3','StreamSB','StreamTape'];

export default function WatchPage() {
  const { id }  = useParams();
  const sp      = useSearchParams();
  const router  = useRouter();
  const { user } = useAuth();
  const toast   = useToast();
  const { save: saveProgress, get: getProgress } = useWatchProgress();
  const [defaultCat] = useLocalStorage('animex_default_cat', 'sub');
  const [defaultSrv] = useLocalStorage('animex_default_srv', 'hd-1');
  const [autoNext]   = useLocalStorage('animex_auto_next', true);

  const epId = sp.get('ep');
  const catP = sp.get('server') || defaultCat;
  const videoRef  = useRef(null);
  const saveTimer = useRef(null);

  const [episodes,  setEpisodes] = useState([]);
  const [anime,     setAnime]    = useState(null);
  const [related,   setRelated]  = useState([]);
  const [currentEp, setCurrent]  = useState(null);
  const [streamUrl, setStream]   = useState(null);
  const [subtitles, setSubs]     = useState([]);
  const [cat,       setCat]      = useState(catP);
  const [srv,       setSrv]      = useState(defaultSrv);
  const [stats,     setStats]    = useState({ likeCount:0, dislikeCount:0, totalViews:0 });
  const [inList,    setInList]   = useState(false);
  const [reacted,   setReacted]  = useState(null);
  const [showKeys,  setShowKeys] = useState(false);
  const [srcError,  setSrcError] = useState(false);
  const [watchedIds,setWatched]  = useState(new Set());

  // Load anime + episodes
  useEffect(() => {
    if (!id) return;
    Promise.all([animeApi.getInfo(id), animeApi.getEpisodes(id)])
      .then(([ir, er]) => {
        setAnime(ir?.data?.anime?.info || ir?.data || null);
        setRelated(ir?.data?.relatedAnimes || []);
        const eps = er?.data?.episodes || [];
        setEpisodes(eps);
        const ep = epId ? (eps.find(e => e.episodeId === epId) || eps[0]) : eps[0];
        setCurrent(ep || null);
      }).catch(console.error);
  }, [id]);

  // Load sources
  useEffect(() => {
    if (!currentEp) return;
    setStream(null); setSrcError(false); setSubs([]);
    animeApi.getSources(currentEp.episodeId, srv, cat)
      .then(d => {
        setStream(d?.data?.sources?.[0]?.url || null);
        setSubs(d?.data?.tracks?.filter(t => t.kind === 'captions') || []);
        animeApi.incrementView(currentEp.episodeId, id).catch(() => {});
        setWatched(prev => new Set([...prev, currentEp.episodeId]));
      })
      .catch(() => setSrcError(true));
  }, [currentEp, srv, cat]);

  // Restore saved position
  useEffect(() => {
    if (!currentEp || !videoRef.current || !streamUrl) return;
    const saved = getProgress(id);
    if (saved?.episodeId === currentEp.episodeId && saved.positionSeconds > 10) {
      setTimeout(() => {
        if (videoRef.current) videoRef.current.currentTime = saved.positionSeconds;
      }, 500);
    }
  }, [streamUrl]);

  // Save history
  useEffect(() => {
    if (!currentEp || !anime) return;
    if (user) userApi.addToHistory({ animeId:id, animeTitle:anime.name, animeImage:anime.poster, episode:currentEp.episodeId, episodeNumber:currentEp.number, dubOrSub:cat, animeType:anime.stats?.type||'TV' }).catch(()=>{});
  }, [currentEp]);

  // Periodic progress save
  useEffect(() => {
    if (saveTimer.current) clearInterval(saveTimer.current);
    saveTimer.current = setInterval(() => {
      const v = videoRef.current;
      if (!v || v.paused || !currentEp) return;
      saveProgress(id, currentEp.episodeId, currentEp.number, v.currentTime, v.duration);
    }, 8000);
    return () => clearInterval(saveTimer.current);
  }, [currentEp]);

  // Stats + watchlist
  useEffect(() => {
    if (!currentEp) return;
    animeApi.getStats(currentEp.episodeId).then(s => setStats(s)).catch(() => {});
  }, [currentEp]);
  useEffect(() => {
    if (!user || !id) return;
    userApi.checkWatchlist(id).then(d => setInList(d.inWatchlist)).catch(() => {});
  }, [user, id]);

  const currentIdx = episodes.findIndex(e => e.episodeId === currentEp?.episodeId);

  const goEp = useCallback((ep) => {
    setCurrent(ep);
    router.replace(`/watch/${id}?ep=${ep.episodeId}&server=${cat}`, { scroll: false });
  }, [id, cat]);

  const navigate = useCallback((dir) => {
    const next = episodes[currentIdx + dir];
    if (next) goEp(next);
    else toast.info(dir > 0 ? 'No next episode' : 'No previous episode');
  }, [episodes, currentIdx, goEp]);

  const handleEnded = useCallback(() => {
    if (autoNext && episodes[currentIdx + 1]) {
      const next = episodes[currentIdx + 1];
      toast.info(`Playing Episode ${next.number}…`);
      goEp(next);
    }
  }, [autoNext, episodes, currentIdx, goEp]);

  const react = async (type) => {
    if (reacted) return;
    await animeApi.setReaction(currentEp?.episodeId, type, id).catch(() => {});
    setStats(s => ({ ...s, [type==='like'?'likeCount':'dislikeCount']: (s[type==='like'?'likeCount':'dislikeCount']||0)+1 }));
    setReacted(type);
    toast.success(type === 'like' ? '👍 Liked!' : '👎 Disliked');
  };

  const toggleList = async () => {
    if (!user) { toast.info('Sign in to save'); return; }
    if (inList) { await userApi.removeFromWatchlist(id).catch(()=>{}); setInList(false); toast.success('Removed from watchlist'); }
    else { await userApi.addToWatchlist({ animeId:id, animeName:anime?.name, animeImage:anime?.poster }).catch(()=>{}); setInList(true); toast.success('Saved!'); }
  };

  useKeyboard({
    ' ':          () => videoRef.current?.paused ? videoRef.current.play() : videoRef.current?.pause(),
    'k':          () => videoRef.current?.paused ? videoRef.current.play() : videoRef.current?.pause(),
    'ArrowLeft':  () => navigate(-1),
    'ArrowRight': () => navigate(1),
    'f':          () => videoRef.current?.closest('.player-box')?.requestFullscreen?.(),
    'm':          () => { if (videoRef.current) videoRef.current.muted = !videoRef.current.muted; },
    '?':          () => setShowKeys(k => !k),
  });

  return (
    <div style={{ padding: '10px 10px 24px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: 10 }}>
        <Link href="/home">Home</Link>
        <span className="sep">/</span>
        {anime && <Link href={`/anime/${id}`} style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{anime.name}</Link>}
        <span className="sep">/</span>
        <span className="current">EP {currentEp?.number || '—'}</span>
      </div>

      {/* Player */}
      <div className="player-box" style={{ marginBottom: 10 }}>
        {srcError ? (
          <div className="player-error">
            <div style={{ fontSize:28 }}>⚠️</div>
            <p style={{ fontSize:12, color:'var(--error)', textAlign:'center' }}>Stream unavailable. Try another server.</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'center', marginTop:8 }}>
              {SERVERS.filter(s=>s!==srv).slice(0,3).map(s => (
                <button key={s} className="ctrl-btn" onClick={() => setSrv(s)}>Try {s}</button>
              ))}
            </div>
          </div>
        ) : (
          <VideoPlayer ref={videoRef} src={streamUrl} subtitleTracks={subtitles}
            onEnded={handleEnded}
            onTimeUpdate={(pos,dur) => { if (currentEp) saveProgress(id, currentEp.episodeId, currentEp.number, pos, dur); }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="player-controls" style={{ marginBottom: 10 }}>
        <button className="ctrl-btn" onClick={() => navigate(-1)} disabled={currentIdx <= 0}><ChevronLeft size={13}/> Prev</button>
        <span style={{ fontSize:11, color:'var(--text-3)', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:5, padding:'4px 8px', whiteSpace:'nowrap' }}>
          {currentEp?.number||'—'} / {episodes.length}
        </span>
        <button className="ctrl-btn" onClick={() => navigate(1)} disabled={currentIdx >= episodes.length-1}>Next <ChevronRight size={13}/></button>
        <div className="cat-toggle">
          {['sub','dub','raw'].map(c => <button key={c} className={`cat-toggle-btn ${cat===c?'active':''}`} onClick={() => setCat(c)}>{c.toUpperCase()}</button>)}
        </div>
        <select className="server-select" value={srv} onChange={e => setSrv(e.target.value)}>
          {SERVERS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {autoNext && currentIdx < episodes.length-1 && (
          <button className="ctrl-btn" onClick={() => navigate(1)}><SkipForward size={12}/> Skip</button>
        )}
        <button className="ctrl-btn" onClick={() => setShowKeys(k=>!k)}><Keyboard size={12}/></button>
      </div>

      {/* Stats */}
      <div style={{ marginBottom: 12 }}>
        <StatsBar stats={stats} onReact={react} reacted={reacted} inList={inList} onToggleList={toggleList} animeTitle={anime?.name}/>
      </div>

      {/* Title */}
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:700, color:'var(--text-1)', marginBottom:2 }}>{anime?.name||'—'}</h1>
        {currentEp?.title && <p style={{ fontSize:12, color:'var(--text-3)' }}>Episode {currentEp.number}: {currentEp.title}</p>}
        <p style={{ fontSize:11, color:'var(--text-4)', marginTop:2 }}>{(stats.totalViews||0).toLocaleString()} views</p>
      </div>

      <Link href={`/anime/${id}`} className="ctrl-btn" style={{ display:'inline-flex', textDecoration:'none', marginBottom:20 }}>
        <List size={12}/> Details & Episodes
      </Link>

      {/* Episode panel */}
      <EpisodePanel episodes={episodes} currentEpId={currentEp?.episodeId} animeId={id} category={cat} onSelect={goEp} watchedIds={watchedIds}/>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <AnimeRow title="You May Also Like" animes={related} loading={false}/>
        </div>
      )}

      {/* Keyboard shortcuts */}
      {showKeys && (
        <div className="shortcuts-overlay" onClick={() => setShowKeys(false)}>
          <div className="shortcuts-box" onClick={e => e.stopPropagation()}>
            <h2>⌨️ Shortcuts</h2>
            {[['Space/K','Play/Pause'],['←','Previous Episode'],['→','Next Episode'],['F','Fullscreen'],['M','Mute'],['?','This menu']].map(([k,d]) => (
              <div key={k} className="shortcut-row">
                <span className="shortcut-desc">{d}</span>
                <span className="shortcut-key">{k}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
