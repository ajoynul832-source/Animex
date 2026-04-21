'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { animeApi } from '@/lib/api';

const SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleWidget() {
  const today    = new Date();
  const todayDow = today.getDay();
  const [tab,     setTab]     = useState(todayDow);
  const [data,    setData]    = useState({});
  const [loading, setLoading] = useState(true);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    return {
      dow:     i,
      label:   i === todayDow ? 'Today' : SHORT[i],
      date:    d.toISOString().split('T')[0],
      isToday: i === todayDow,
    };
  });

  useEffect(() => {
    (async () => {
      const r = {};
      await Promise.all(days.map(async d => {
        try {
          const res = await animeApi.getSchedule(d.date);
          r[d.date] = res?.data?.scheduledAnimes || [];
        } catch { r[d.date] = []; }
      }));
      setData(r);
      setLoading(false);
    })();
  }, []);

  const items = data[days[tab]?.date] || [];

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <Calendar size={14} /> Schedule
        </div>
        <Link href="/schedule" style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', transition: 'color .15s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >
          Full <ChevronRight size={11} />
        </Link>
      </div>

      {/* Day tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {days.map(d => (
          <button
            key={d.dow}
            onClick={() => setTab(d.dow)}
            style={{
              flexShrink: 0,
              padding: '7px 10px',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: tab === d.dow ? 'var(--accent)' : 'var(--text-3)',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${tab === d.dow ? 'var(--accent)' : 'transparent'}`,
              marginBottom: -1,
              cursor: 'pointer',
              transition: 'all .15s',
              fontFamily: 'Montserrat, sans-serif',
              position: 'relative',
            }}
          >
            {d.label}
            {d.isToday && (
              <span style={{ position: 'absolute', top: 5, right: 4, width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ maxHeight: 340, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '10px 14px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 36, height: 50, borderRadius: 3, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 11, borderRadius: 3, marginBottom: 5, width: '80%' }} />
                  <div className="skeleton" style={{ height: 10, borderRadius: 3, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p style={{ padding: '18px 14px', fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
            No schedule for {days[tab]?.label}.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.slice(0, 12).map((anime, i) => (
              <li key={anime.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                <Link
                  href={`/anime/${anime.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', textDecoration: 'none', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-alt)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <img
                    src={anime.poster || '/no-poster.svg'}
                    alt={anime.name}
                    style={{ width: 36, minWidth: 36, height: 50, objectFit: 'cover', borderRadius: 3 }}
                    loading="lazy"
                    onError={e => e.currentTarget.src = '/no-poster.svg'}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 3 }}>
                      {anime.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {anime.time && (
                        <span style={{ fontSize: 10, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={9} /> {anime.time}
                        </span>
                      )}
                      {anime.episode && (
                        <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700 }}>
                          EP {anime.episode}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
