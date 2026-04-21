'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { History, Play, Trash2 } from 'lucide-react';
import { userApi } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function HistoryPage() {
  const { user, loading:authLoading } = useAuth();
  const router = useRouter(); const toast = useToast();
  const [hist, setHist]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [confirm, setConfirm]   = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!user) return;
    userApi.getHistory().then(d=>setHist(d.history||[])).catch(()=>setHist([])).finally(()=>setLoading(false));
  }, [user, authLoading]);

  const remove = async (id) => {
    setRemoving(id); await userApi.removeFromHistory(id).catch(()=>{});
    setHist(h=>h.filter(x=>x.animeId!==id)); setRemoving(null);
  };
  const clearAll = async () => {
    setClearing(true); await userApi.clearHistory().catch(()=>{});
    setHist([]); setConfirm(false); setClearing(false); toast.success('History cleared');
  };

  if (authLoading||loading) return <div className="page-inner" style={{ textAlign:'center' }}><div className="spinner spinner-lg" style={{ display:'inline-block' }}/></div>;

  return (
    <div className="page-inner">
      <div className="block_area-header">
        <h1 className="cat-heading" style={{ display:'flex', alignItems:'center', gap:10 }}><History size={22} style={{ color:'var(--accent)' }}/> Watch History <span style={{ fontSize:14, fontWeight:400, color:'var(--text-3)' }}>({hist.length})</span></h1>
        {hist.length > 0 && (
          confirm
            ? <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12, color:'var(--text-3)' }}>Clear all?</span>
                <button onClick={clearAll} disabled={clearing} style={{ padding:'4px 12px', background:'rgba(248,113,113,0.15)', border:'1px solid rgba(248,113,113,0.4)', color:'var(--error)', borderRadius:5, fontSize:12, fontWeight:600, cursor:'pointer' }}>{clearing?'…':'Yes'}</button>
                <button onClick={()=>setConfirm(false)} style={{ padding:'4px 12px', background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-3)', borderRadius:5, fontSize:12, cursor:'pointer' }}>No</button>
              </div>
            : <button onClick={()=>setConfirm(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', background:'transparent', border:'1px solid rgba(248,113,113,0.3)', color:'var(--error)', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}><Trash2 size={12}/> Clear All</button>
        )}
      </div>
      {hist.length === 0 ? (
        <div className="empty-state"><History size={52} className="empty-state-icon"/><p className="empty-state-title">No watch history</p><p className="empty-state-text">Anime you watch will appear here</p><Link href="/home" className="btn-watch" style={{ display:'inline-flex', alignItems:'center', gap:7 }}>Start Watching</Link></div>
      ) : (
        <div className="film-grid film-grid-6">
          {hist.map(item => (
            <div key={item.animeId} className="flw-item" style={{ position:'relative' }}>
              <Link href={`/watch/${item.animeId}?ep=${item.episode}&server=${item.dubOrSub}`} className="film-poster-wrap" style={{ display:'block' }}>
                <img className="film-poster-img" src={item.animeImage||'/no-poster.svg'} alt={item.animeTitle} loading="lazy" onError={e=>e.currentTarget.src='/no-poster.svg'}/>
                <div className="film-poster-overlay"/>
                <div className="film-play-btn"><div className="play-circle"><Play size={17} fill="#111" strokeWidth={0}/></div></div>
                <div className="tick"><span className="tick-item tick-eps">EP {item.episodeNumber}</span><span className={`tick-item ${item.dubOrSub==='dub'?'tick-dub':'tick-sub'}`} style={{ position:'static',float:'none' }}>{item.dubOrSub?.toUpperCase()}</span></div>
              </Link>
              <button onClick={()=>remove(item.animeId)} disabled={removing===item.animeId}
                style={{ position:'absolute', top:7, left:6, width:26, height:26, borderRadius:5, background:'rgba(0,0,0,0.78)', border:'1px solid var(--border)', color:'var(--error)', cursor:'pointer', display:'none', alignItems:'center', justifyContent:'center', zIndex:20 }}
                className="hist-rm-btn">
                <Trash2 size={11}/>
              </button>
              <div className="film-detail">
                <p className="film-name"><Link href={`/anime/${item.animeId}`}>{item.animeTitle}</Link></p>
                <div className="fd-infor">{new Date(item.watchedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx global>{`.flw-item:hover .hist-rm-btn { display:flex !important; }`}</style>
    </div>
  );
}
