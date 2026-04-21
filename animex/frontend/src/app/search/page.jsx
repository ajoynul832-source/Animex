'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { searchApi } from '@/lib/api';
import AnimeCard, { AnimeCardSkeleton } from '@/components/anime/AnimeCard';

const TYPES    = ['','TV','Movie','OVA','ONA','Special','Music'];
const STATUSES = ['','Airing','Complete','Upcoming'];
const RATINGS  = ['','G','PG','PG-13','R','R+','Rx'];
const SEASONS  = ['','Spring','Summer','Fall','Winter'];
const SORTS    = [['','Default'],['recently-added','Recently Added'],['recently-updated','Recently Updated'],['score','Score'],['name-az','Name A-Z'],['released-date','Release Date'],['most-watched','Most Watched']];

export default function SearchPage() {
  const sp     = useSearchParams();
  const router = useRouter();
  const keyword = sp.get('keyword') || '';
  const page    = parseInt(sp.get('page') || '1');

  const [results, setResults]   = useState([]);
  const [total, setTotal]       = useState(1);
  const [loading, setLoading]   = useState(false);
  const [query, setQuery]       = useState(keyword);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters]   = useState({ type:'', status:'', rated:'', season:'', sort:'' });

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);
    const f = {};
    Object.entries(filters).forEach(([k,v]) => { if (v) f[k] = v; });
    searchApi.search(keyword, page, f)
      .then(d => { setResults(d?.data?.animes||[]); setTotal(d?.data?.totalPages||1); })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [keyword, page, filters]);

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?keyword=${encodeURIComponent(q)}&page=1`);
  };
  const goPage = (p) => router.push(`/search?keyword=${encodeURIComponent(keyword)}&page=${p}`);
  const setFilter = (k,v) => setFilters(f => ({...f,[k]:v}));
  const resetFilters = () => setFilters({type:'',status:'',rated:'',season:'',sort:''});
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="page-inner">
      {/* Search bar */}
      <form onSubmit={submit} style={{ maxWidth:600, marginBottom:20, position:'relative' }}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search anime..."
          style={{ width:'100%', height:44, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text-1)', fontSize:14, padding:'0 90px 0 16px', outline:'none' }} />
        <div style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', display:'flex', gap:6 }}>
          <button type="button" onClick={() => setShowFilters(f=>!f)} title="Filters"
            style={{ width:30, height:30, background: showFilters?'var(--accent-dim)':'none', border:'1px solid var(--border)', borderRadius:6, color: showFilters?'var(--accent)':'var(--text-3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <SlidersHorizontal size={14}/>
          </button>
          <button type="submit" style={{ width:30, height:30, background:'var(--accent)', border:'none', borderRadius:6, color:'#111', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <Search size={14}/>
          </button>
        </div>
      </form>

      {/* Filters panel */}
      {showFilters && (
        <div className="search-filters animate-fade-in">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text-1)' }}>Advanced Filters</span>
            {hasFilters && <button className="filter-reset" onClick={resetFilters}><X size={13}/> Reset</button>}
          </div>
          <div className="filter-grid">
            {[
              ['Type',   'type',   TYPES],
              ['Status', 'status', STATUSES],
              ['Rating', 'rated',  RATINGS],
              ['Season', 'season', SEASONS],
            ].map(([label, key, opts]) => (
              <div key={key}>
                <label className="filter-label">{label}</label>
                <select className="filter-select" value={filters[key]} onChange={e=>setFilter(key,e.target.value)}>
                  {opts.map(o => <option key={o} value={o}>{o||`Any ${label}`}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="filter-label">Sort By</label>
              <select className="filter-select" value={filters.sort} onChange={e=>setFilter('sort',e.target.value)}>
                {SORTS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {keyword && (
        <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:18 }}>
          Results for <strong style={{ color:'var(--accent)' }}>"{keyword}"</strong>
          {!loading && <span> — {results.length} shown</span>}
          {hasFilters && <span style={{ color:'var(--info)' }}> (filtered)</span>}
        </p>
      )}

      <div className="film-grid film-grid-6" style={{ marginBottom:32 }}>
        {loading ? Array.from({length:18}).map((_,i) => <AnimeCardSkeleton key={i}/>)
          : results.map((a,i) => <AnimeCard key={a?.id||i} anime={a}/>)}
      </div>

      {!loading && !keyword && (
        <div className="empty-state">
          <Search size={52} className="empty-state-icon"/>
          <p className="empty-state-title">Search for anime</p>
          <p className="empty-state-text">Type a title, genre, or character name</p>
        </div>
      )}

      {!loading && keyword && results.length === 0 && (
        <div className="empty-state">
          <Search size={52} className="empty-state-icon"/>
          <p className="empty-state-title">No results for "{keyword}"</p>
          <p className="empty-state-text">Try different keywords or clear filters</p>
        </div>
      )}

      {total > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => goPage(page-1)} disabled={page<=1}><ChevronLeft size={13}/></button>
          {Array.from({length:Math.min(total,7)},(_,i) => {
            const p = page<=4 ? i+1 : page-3+i;
            if (p<1||p>total) return null;
            return <button key={p} className={`page-btn ${p===page?'active':''}`} onClick={() => goPage(p)}>{p}</button>;
          })}
          <button className="page-btn" onClick={() => goPage(page+1)} disabled={page>=total}><ChevronRight size={13}/></button>
        </div>
      )}
    </div>
  );
}
