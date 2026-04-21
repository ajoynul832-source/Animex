'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Play, Bookmark, BookmarkCheck, Star, Clock, Tv, ChevronDown, ChevronUp, List, Share2 } from 'lucide-react';
import { animeApi, userApi } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/Toast';
import AnimeRow from '@/components/anime/AnimeRow';

export default function AnimeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [anime,    setAnime]    = useState(null);
  const [episodes, setEps]      = useState([]);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [inList,   setInList]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [cat,      setCat]      = useState('sub');
  const [epSearch, setEpSearch] = useState('');
  const [tab,      setTab]      = useState('episodes');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([animeApi.getInfo(id), animeApi.getEpisodes(id)])
      .then(([ir, er]) => {
        setAnime(ir?.data?.anime || null);
        setEps(er?.data?.episodes || []);
        setRelated(ir?.data?.relatedAnimes || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    userApi.checkWatchlist(id).then(d => setInList(d.inWatchlist)).catch(() => {});
  }, [user, id]);

  const toggleList = async () => {
    if (!user) { toast.info('Sign in to save'); return; }
    try {
      if (inList) { await userApi.removeFromWatchlist(id); setInList(false); toast.success('Removed from watchlist'); }
      else { await userApi.addToWatchlist({ animeId:id, animeName:info?.name, animeImage:info?.poster, animeType:stats?.type }); setInList(true); toast.success('Added to watchlist!'); }
    } catch (e) { toast.error(e.message); }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: info?.name, url });
    else { await navigator.clipboard.writeText(url); toast.success('Link copied!'); }
  };

  if (loading) return <LoadSkel />;
  if (!anime)  return <div className="page-inner" style={{ textAlign:'center', color:'var(--text-3)' }}>Anime not found.</div>;

  const info     = anime.info     || {};
  const moreInfo = anime.moreInfo || {};
  const stats    = info.stats     || {};
  const synopsis = info.description || moreInfo.description || '';
  const genres   = moreInfo.genres || info.genres || [];
  const chars    = anime.characters || info.characters || [];
  const firstEp  = episodes[0];

  const filteredEps = epSearch
    ? episodes.filter(e => String(e.number).includes(epSearch) || e.title?.toLowerCase().includes(epSearch.toLowerCase()))
    : episodes;

  return (
    <div>
      {/* Backdrop */}
      <div className="anime-hero">
        <img className="anime-hero-bg" src={info.poster} alt={info.name} onError={e => e.currentTarget.style.display='none'}/>
      </div>

      <div className="anime-detail-wrap">
        <div className="anime-info-grid">
          {/* Poster + actions */}
          <div className="anime-poster-col">
            <img className="anime-poster-img" src={info.poster||'/no-poster.svg'} alt={info.name} onError={e=>e.currentTarget.src='/no-poster.svg'}/>
            <div className="anime-actions">
              {firstEp && (
                <Link href={`/watch/${id}?ep=${firstEp.episodeId}&server=${cat}`} className="btn-action btn-action-primary">
                  <Play size={13} fill="#111" strokeWidth={0}/> Watch Now
                </Link>
              )}
              <button onClick={toggleList} className={`btn-action btn-action-outline ${inList?'saved':''}`}>
                {inList ? <><BookmarkCheck size={13}/> Saved</> : <><Bookmark size={13}/> Save</>}
              </button>
              <button onClick={share} className="btn-action btn-action-outline">
                <Share2 size={13}/> Share
              </button>
            </div>
          </div>

          {/* Info */}
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:28, fontWeight:700, color:'var(--text-1)', lineHeight:1.1, marginBottom:4 }}>{info.name}</h1>
            {moreInfo.japanese && <p style={{ fontSize:12, color:'var(--text-3)', marginBottom:12 }}>{moreInfo.japanese}</p>}

            <div className="stat-badges">
              {stats.rating && <span className="stat-badge rating"><Star size={11} fill="currentColor" strokeWidth={0}/>{stats.rating}</span>}
              {[stats.type, moreInfo.status, stats.duration].filter(Boolean).map((v,i) => <span key={i} className="stat-badge">{v}</span>)}
              {stats.episodes?.sub!=null && <span className="tick-item tick-sub" style={{position:'static',float:'none',fontSize:11,padding:'3px 8px'}}>SUB {stats.episodes.sub}</span>}
              {stats.episodes?.dub!=null && <span className="tick-item tick-dub" style={{position:'static',float:'none',fontSize:11,padding:'3px 8px'}}>DUB {stats.episodes.dub}</span>}
            </div>

            {genres.length > 0 && (
              <div className="genre-tags" style={{ marginTop:10 }}>
                {genres.map(g => <Link key={g} href={`/genre/${g.toLowerCase().replace(/ /g,'-')}`} className="genre-tag">{g}</Link>)}
              </div>
            )}

            {synopsis && (
              <div style={{ marginTop:12 }}>
                <p style={{ fontSize:12, color:'var(--text-2)', lineHeight:1.75, display:'-webkit-box', WebkitLineClamp:expanded?'unset':3, WebkitBoxOrient:'vertical', overflow:expanded?'visible':'hidden' }}>{synopsis}</p>
                {synopsis.length > 200 && (
                  <button onClick={() => setExpanded(e=>!e)} style={{ marginTop:4, fontSize:11, color:'var(--accent)', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:3 }}>
                    {expanded ? <><ChevronUp size={11}/> Less</> : <><ChevronDown size={11}/> More</>}
                  </button>
                )}
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 16px', marginTop:12 }}>
              {[['Score',moreInfo.malscore],['Studios',Array.isArray(moreInfo.studios)?moreInfo.studios.join(', '):moreInfo.studios],['Aired',moreInfo.aired],['Premiered',moreInfo.premiered]].filter(([,v])=>v).map(([l,v])=>(
                <div key={l}>
                  <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-3)', display:'block' }}>{l}</span>
                  <span style={{ fontSize:12, color:'var(--text-1)', fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'2px solid var(--border)', marginTop:22, marginBottom:16 }}>
          {[['episodes',`Episodes (${episodes.length})`],['characters',`Characters (${chars.length})`],['related',`Related (${related.length})`]].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:'9px 14px', fontSize:12, fontWeight:600, background:'none', border:'none', borderBottom:`2px solid ${tab===t?'var(--accent)':'transparent'}`, color:tab===t?'var(--accent)':'var(--text-3)', cursor:'pointer', marginBottom:-2, transition:'all .15s' }}>{l}</button>
          ))}
        </div>

        {/* Episodes */}
        {tab === 'episodes' && (
          <div>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:10, flexWrap:'wrap' }}>
              <div style={{ display:'flex', borderRadius:5, overflow:'hidden', border:'1px solid var(--border)' }}>
                {['sub','dub','raw'].map(c => <button key={c} onClick={()=>setCat(c)} style={{ padding:'4px 12px', fontSize:10, fontWeight:700, textTransform:'uppercase', background:cat===c?'var(--accent)':'transparent', color:cat===c?'#111':'var(--text-3)', border:'none', cursor:'pointer' }}>{c}</button>)}
              </div>
              <input value={epSearch} onChange={e=>setEpSearch(e.target.value)} placeholder="Find ep…"
                style={{ height:28, background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:5, color:'var(--text-1)', fontSize:11, padding:'0 8px', outline:'none', width:100 }}/>
            </div>
            <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, padding:12 }}>
              <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:8 }}>{episodes.length} Episodes</div>
              <div className="ep-grid" style={{ maxHeight:260, overflowY:'auto' }}>
                {filteredEps.map(ep => (
                  <Link key={ep.episodeId} href={`/watch/${id}?ep=${ep.episodeId}&server=${cat}`}
                    className={`ep-btn ${ep.isFiller?'filler':''}`} title={ep.title||`EP ${ep.number}`}>
                    {ep.number}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Characters */}
        {tab === 'characters' && (
          chars.length > 0
            ? <div className="chars-grid">{chars.slice(0,24).map((c,i) => (<div key={i} className="char-card"><img className="char-poster" src={c.poster||c.image||'/no-poster.svg'} alt={c.name} onError={e=>e.currentTarget.src='/no-poster.svg'}/><div className="char-info"><div className="char-name">{c.name}</div>{c.cast&&<div className="char-role">{c.cast}</div>}{c.voiceActor?.name&&<div className="char-va">VA: {c.voiceActor.name}</div>}</div></div>))}</div>
            : <p style={{ color:'var(--text-3)', fontSize:12, padding:'16px 0' }}>No character data.</p>
        )}

        {/* Related */}
        {tab === 'related' && (
          related.length > 0
            ? <div className="film-grid">{related.map((a,i)=>{const AnimeCard=require('@/components/anime/AnimeCard').default;return <AnimeCard key={a?.id||i} anime={a}/>;})}</div>
            : <p style={{ color:'var(--text-3)', fontSize:12, padding:'16px 0' }}>No related anime.</p>
        )}
      </div>
    </div>
  );
}

function LoadSkel() {
  return (
    <div>
      <div className="skeleton" style={{ height:200 }}/>
      <div style={{ padding:'0 12px', marginTop:-80, display:'flex', gap:16, flexWrap:'wrap' }}>
        <div className="skeleton" style={{ width:130, height:195, borderRadius:8, flexShrink:0 }}/>
        <div style={{ flex:1, minWidth:180 }}>
          <div className="skeleton" style={{ height:28, borderRadius:5, marginBottom:8, width:'60%' }}/>
          {[100,90,80].map((w,i)=><div key={i} className="skeleton" style={{ height:11, borderRadius:3, marginBottom:6, width:`${w}%` }}/>)}
        </div>
      </div>
    </div>
  );
}
