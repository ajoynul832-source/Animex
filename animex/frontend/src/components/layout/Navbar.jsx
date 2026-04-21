'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronDown, User, LogOut, Bookmark, History, Settings } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { searchApi } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [query,    setQuery]    = useState('');
  const [sugs,     setSugs]     = useState([]);
  const [userOpen, setUserOpen] = useState(false);
  const [sbOpen,   setSbOpen]   = useState(false);
  const debouncedQuery = useDebounce(query, 280);
  const userRef = useRef(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setSugs([]); return; }
    searchApi.getSuggestions(debouncedQuery)
      .then(d => setSugs(d?.data?.suggestions?.slice(0, 7) || []))
      .catch(() => setSugs([]));
  }, [debouncedQuery]);

  useEffect(() => {
    const fn = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    const sb = document.getElementById('site-sidebar');
    if (!sb) return;
    if (sbOpen) sb.classList.add('open'); else sb.classList.remove('open');
  }, [sbOpen]);

  useEffect(() => { setUserOpen(false); setSugs([]); setSbOpen(false); }, [pathname]);

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?keyword=${encodeURIComponent(q)}`);
    setQuery(''); setSugs([]);
  };

  return (
    <header id="site-header">
      <button className="hdr-icon" onClick={() => setSbOpen(o => !o)} aria-label="Menu" style={{ flexShrink: 0 }}>
        {sbOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <Link href="/home" className="header-logo">ANIME<span>X</span></Link>

      <div className="header-search" style={{ flex: 1, maxWidth: 520 }}>
        <form onSubmit={search} style={{ position: 'relative' }}>
          <input
            className="header-search-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search anime…"
            autoComplete="off"
          />
          <button type="submit" className="header-search-btn"><Search size={15} /></button>
        </form>
        {sugs.length > 0 && (
          <div className="search-suggestions">
            {sugs.map((s, i) => (
              <Link key={i} href={`/anime/${s.id}`} className="sug-item"
                onClick={() => { setQuery(''); setSugs([]); }}>
                {s.poster && <img src={s.poster} alt={s.name} onError={e => e.currentTarget.style.display = 'none'} />}
                <div>
                  <div className="sug-item-name">{s.name}</div>
                  {s.jname && <div className="sug-item-jname">{s.jname}</div>}
                </div>
                {s.type && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-4)', background: 'var(--bg-card)', padding: '2px 5px', borderRadius: 3, flexShrink: 0 }}>{s.type}</span>}
              </Link>
            ))}
            <Link href={`/search?keyword=${encodeURIComponent(query)}`} className="sug-item"
              style={{ justifyContent: 'center', color: 'var(--accent)', fontWeight: 600 }}
              onClick={() => { setQuery(''); setSugs([]); }}>
              See all results for &quot;{query}&quot;
            </Link>
          </div>
        )}
      </div>

      <div className="header-right">
        {user ? (
          <div className="user-menu" ref={userRef}>
            <button className="user-trigger" onClick={() => setUserOpen(o => !o)}>
              <div className="user-av">{user.name[0].toUpperCase()}</div>
              <span className="user-trigger-name">{user.name}</span>
              <ChevronDown size={12} style={{ color: 'var(--text-4)', transition: 'transform .2s', transform: userOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
            </button>
            {userOpen && (
              <div className="user-dropdown animate-scale-in">
                <div className="user-dropdown-header">
                  <div className="user-dropdown-name">{user.name}</div>
                  <div className="user-dropdown-email">{user.email}</div>
                </div>
                <Link href="/profile"   className="dropdown-item" onClick={() => setUserOpen(false)}><User size={14} /> Profile</Link>
                <Link href="/watchlist" className="dropdown-item" onClick={() => setUserOpen(false)}><Bookmark size={14} /> Watchlist</Link>
                <Link href="/history"   className="dropdown-item" onClick={() => setUserOpen(false)}><History size={14} /> History</Link>
                <Link href="/settings"  className="dropdown-item" onClick={() => setUserOpen(false)}><Settings size={14} /> Settings</Link>
                <button className="dropdown-item danger" onClick={() => { logout(); setUserOpen(false); router.push('/home'); }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login"><button className="hdr-btn">Login</button></Link>
            <Link href="/register"><button className="hdr-btn-primary">Sign Up</button></Link>
          </>
        )}
      </div>
    </header>
  );
}
