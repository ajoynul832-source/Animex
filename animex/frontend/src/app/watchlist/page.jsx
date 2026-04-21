'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, Trash2, Play } from 'lucide-react';
import { userApi } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function WatchlistPage() {
  const { user, loading:authLoading } = useAuth();
  const router = useRouter(); const toast = useToast();
  const [list, setList]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!user) return;
    userApi.getWatchlist().then(d => setList(d.watchlist||[])).catch(()=>setList([])).finally(()=>setLoading(false));
  }, [user, authLoading]);

  const remove = async (id, name) => {
    setRemoving(id);
    await userApi.removeFromWatchlist(id).catch(()=>{});
    setList(l => l.filter(x=>x.animeId!==id));
    toast.success(`Removed "${name}" from watchlist`);
    setRemoving(null);
  };

  if (authLoading||loading) return <div className="page-inner" style={{ textAlign:'center' }}><div className="spinner spinner-lg" style={{ display:'inline-block' }}/></div>;

  return (
    <div className="page-inner">
      <div className="block_area-header">
        <h1 className="cat-heading" style={{ display:'flex', alignItems:'center', gap:10 }}><Bookmark size={22} style={{ color:'var(--accent)' }}/> My Watchlist <span style={{ fontSize:14, fontWeight:400, color:'var(--text-3)' }}>({list.length})</span></h1>
      </div>
      {list.length === 0 ? (
        <div className="empty-state"><Bookmark size={52} className="empty-state-icon"/><p className="empty-state-title">Your watchlist is empty</p><p className="empty-state-text">Save anime to watch later</p><Link href="/home" className="btn-watch" style={{ display:'inline-flex', alignItems:'center', gap:7 }}>Browse Anime</Link></div>
      ) : (
        <div className="film-grid film-grid-6">
          {list.map(item => (
            <div key={item.animeId} className="flw-item" style={{ position:'relative' }}>
              <Link href={`/anime/${item.animeId}`} className="film-poster-wrap" style={{ display:'block' }}>
                <img className="film-poster-img" src={item.animeImage||'/no-poster.svg'} alt={item.animeName} loading="lazy" onError={e=>e.currentTarget.src='/no-poster.svg'}/>
                <div className="film-poster-overlay"/>
                <div className="film-play-btn"><div className="play-circle"><Play size={17} fill="#111" strokeWidth={0}/></div></div>
                {item.animeType && <div className="tick-type">{item.animeType}</div>}
              </Link>
              <button onClick={() => remove(item.animeId, item.animeName)} disabled={removing===item.animeId}
                style={{ position:'absolute', top:7, left:6, width:26, height:26, borderRadius:5, background:'rgba(0,0,0,0.78)', border:'1px solid var(--border)', color:'var(--error)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:20, opacity: removing===item.animeId?.6:1 }}>
                <Trash2 size={11}/>
              </button>
              <div className="film-detail">
                <p className="film-name"><Link href={`/anime/${item.animeId}`}>{item.animeName}</Link></p>
                <div className="fd-infor">{new Date(item.addedAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
