'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Sparkles, Heart, CheckCircle, AlignJustify, Film, Tv, ChevronDown, Shuffle, Clock } from 'lucide-react';

const GENRES  = ['Action','Adventure','Cars','Comedy','Dementia','Demons','Drama','Ecchi','Fantasy','Game','Harem','Historical','Horror','Josei','Kids','Magic','Martial Arts','Mecha','Military','Music','Mystery','Parody','Police','Psychological','Romance','Samurai','School','Sci-Fi','Seinen','Shoujo','Shounen','Slice of Life','Space','Sports','Super Power','Supernatural','Thriller','Vampire'];
const TYPES   = ['Movies','TV Series','OVA','ONA','Special'];
const STATUS  = ['Completed','Ongoing'];
const LATEST  = ['Subbed','Dubbed','Chinese'];
const SEASONS = ['Fall','Summer','Spring','Winter'];

function Group({ label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <button className={`sb-group-btn ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        <span>{label}</span>
        <ChevronDown size={13} className="chevron" />
      </button>
      <div className={`sb-sub ${open ? 'open' : ''}`}>{children}</div>
    </>
  );
}

export default function Sidebar() {
  const p = usePathname();
  const a = (href) => p === href || p.startsWith(href + '/') ? 'active' : '';

  return (
    <nav id="site-sidebar">
      <div className="sb-section">
        <div className="sb-label">Main</div>
        <Link href="/home"         className={`sb-link ${a('/home')}`}><Home size={14} /> Home</Link>
        <Link href="/popular"      className={`sb-link ${a('/popular')}`}><TrendingUp size={14} /> Most Popular</Link>
        <Link href="/new-season"   className={`sb-link ${a('/new-season')}`}><Sparkles size={14} /> New Season</Link>
        <Link href="/most-favorite"className={`sb-link ${a('/most-favorite')}`}><Heart size={14} /> Most Favorite</Link>
        <Link href="/top-airing"   className={`sb-link ${a('/top-airing')}`}><Clock size={14} /> Top Airing</Link>
        <Link href="/schedule"     className={`sb-link ${a('/schedule')}`}><AlignJustify size={14} /> Schedule</Link>
        <Link href="/random"       className={`sb-link ${a('/random')}`}><Shuffle size={14} /> Random</Link>
      </div>

      <div className="sb-section">
        <Group label="Types" defaultOpen>
          {TYPES.map(t => <Link key={t} href={`/${t.toLowerCase().replace(/ /g, '-')}`} className="sb-sub-link">{t}</Link>)}
        </Group>
      </div>

      <div className="sb-section">
        <Group label="Status" defaultOpen>
          {STATUS.map(s => <Link key={s} href={`/${s.toLowerCase()}`} className="sb-sub-link">{s}</Link>)}
        </Group>
      </div>

      <div className="sb-section">
        <Group label="Latest" defaultOpen>
          {LATEST.map(l => <Link key={l} href={`/latest/${l.toLowerCase()}`} className="sb-sub-link">{l}</Link>)}
        </Group>
      </div>

      <div className="sb-section">
        <Group label="Season">
          {SEASONS.map(s => <Link key={s} href={`/sub-category/${s.toLowerCase()}-anime`} className="sb-sub-link">{s}</Link>)}
        </Group>
      </div>

      <div className="sb-section">
        <Group label="Genres">
          {GENRES.map(g => <Link key={g} href={`/genre/${g.toLowerCase().replace(/ /g, '-')}`} className="sb-sub-link">{g}</Link>)}
        </Group>
      </div>

      <div className="sb-section">
        <div className="sb-label">Browse</div>
        <Link href="/az-list" className={`sb-link ${a('/az-list')}`}><AlignJustify size={14} /> A-Z List</Link>
      </div>
    </nav>
  );
}
