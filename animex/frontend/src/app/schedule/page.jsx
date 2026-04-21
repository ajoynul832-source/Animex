'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { animeApi } from '@/lib/api';
import { ListItemSkeleton } from '@/components/ui/Skeleton';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT     = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SchedulePage() {
  const today   = new Date();
  const todayDow = today.getDay();
  const [selected, setSelected] = useState(todayDow);
  const [schedules, setSchedules] = useState({});
  const [loading,   setLoading]   = useState(true);

  // Build a week starting from Sunday of this week
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    return {
      dow:   i,
      label: DAY_NAMES[i],
      short: SHORT[i],
      date:  d.toISOString().split('T')[0],
      isToday: i === todayDow,
    };
  });

  useEffect(() => {
    setLoading(true);
    Promise.all(week.map(async d => {
      try {
        const res = await animeApi.getSchedule(d.date);
        return [d.date, res?.data?.scheduledAnimes || []];
      } catch { return [d.date, []]; }
    })).then(entries => {
      setSchedules(Object.fromEntries(entries));
      setLoading(false);
    });
  }, []);

  const current = schedules[week[selected]?.date] || [];

  return (
    <div className="page-inner">
      <div className="block_area-header" style={{ marginBottom: 20 }}>
        <h1 className="cat-heading" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Calendar size={22} style={{ color: 'var(--accent)' }} /> Airing Schedule
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Week of {week[0]?.date}</p>
      </div>

      {/* Day tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border)', marginBottom: 24, overflowX: 'auto' }}>
        {week.map(d => (
          <button
            key={d.dow}
            onClick={() => setSelected(d.dow)}
            style={{
              flexShrink: 0, padding: '10px 18px',
              fontSize: 13, fontWeight: 600,
              fontFamily: 'Montserrat, sans-serif',
              background: 'none', border: 'none',
              color: selected === d.dow ? 'var(--accent)' : 'var(--text-3)',
              borderBottom: `2px solid ${selected === d.dow ? 'var(--accent)' : 'transparent'}`,
              marginBottom: -2, cursor: 'pointer',
              transition: 'all .15s',
              position: 'relative',
            }}
          >
            {d.label}
            {d.isToday && (
              <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
            )}
          </button>
        ))}
      </div>

      {/* Schedule list */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <ListItemSkeleton count={4} />
            </div>
          ))}
        </div>
      ) : current.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} className="empty-state-icon" />
          <p className="empty-state-title">No schedule available for {week[selected]?.label}</p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
            {current.length} anime airing on <strong style={{ color: 'var(--text-1)' }}>{week[selected]?.label}</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10 }}>
            {current.map((anime, i) => (
              <Link
                key={anime.id || i}
                href={`/anime/${anime.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', transition: 'border-color .15s, background .15s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-card-alt)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
              >
                <img
                  src={anime.poster || '/no-poster.svg'}
                  alt={anime.name}
                  style={{ width: 44, height: 62, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                  onError={e => e.currentTarget.src = '/no-poster.svg'}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 4 }}>
                    {anime.name}
                  </p>
                  {anime.time && (
                    <p style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} /> {anime.time}
                    </p>
                  )}
                  {anime.episode && (
                    <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginTop: 2 }}>
                      Episode {anime.episode}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
