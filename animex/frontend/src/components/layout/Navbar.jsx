'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Search, Menu, X, ChevronDown, User, LogOut, Bookmark, History, Settings,
  Tv2, Shuffle, Newspaper, MessageSquare // <-- Added new icons here
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { searchApi } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [query,    setQuery]    = useState('');
  const [sugs,     setSugs]     = useState([]);
  const [userOpen, setUserOpen] = useState(false);
  const [sbOpen,   setSbOpen]   = useState(false);
  const [avatar] = useLocalStorage('animex_avatar', '');
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

  // --- UPDATED: Toggles the invisible overlay along with the sidebar ---
  useEffect(() => {
    const sb = document.getElementById('site-sidebar');
    const ov = document.getElementById('sidebar-overlay');
    if (!sb) return;
    if (sbOpen) {
      sb.classList.add('open');
      ov?.classList.add('active');
    } else {
      sb.classList.remove('open');
      ov?.classList.remove('active');
    }
  }, [sbOpen]);

  // --- NEW: Click anywhere on the overlay to close the sidebar ---
  useEffect(() => {
    const ov = document.getElementById('sidebar-overlay');
    const handleClose = () => setSbOpen(false);
    
    if (ov) {
      ov.addEventListener('click', handleClose);
    }
    
    return () => {
      if (ov) ov.removeEventListener('click', handleClose);
    };
  }, []);

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

      {/* --- NEW: Desktop Navigation Features --- */}
      <nav className="desktop-nav-features">
        <Link href="/watch2gether" className="d-nav-link">
          <Tv2 size={16} /> <span>Watch2gether</span>
        </Link>
        <Link href="/random" className="d-nav-link">
          <Shuffle size={16} /> <span>Random</span>
        </Link>
        <div className="d-nav-link">
          <div className="m-lang-badge">EN JP</div> <span>Anime Name</span>
        </div>
        <Link href="/news" className="d-nav-link">
          <Newspaper size={16} /> <span>News</span>
        </Link>
        <Link href="/community" className="d-nav-link">
          <MessageSquare size={16} /> <span>Community</span>
        </Link>
      </nav>

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
              <div className="user-av">
                {avatar
                  ? <img src={avatar} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                  : user.name[0].toUpperCase()
                }
              </div>
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
