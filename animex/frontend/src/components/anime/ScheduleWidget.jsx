'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ChevronRight
} from 'lucide-react';
import { animeApi } from '@/lib/api';

const SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

export default function ScheduleWidget() {
  const today = new Date();
  const todayDow = today.getDay();

  const [tab, setTab] = useState(todayDow);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const days = Array.from(
    { length: 7 },
    (_, i) => {
      const d = new Date(today);

      d.setDate(
        today.getDate() - todayDow + i
      );

      return {
        dow: i,
        label:
          i === todayDow
            ? 'Today'
            : SHORT[i],
        date: d
          .toISOString()
          .split('T')[0],
        isToday: i === todayDow
      };
    }
  );

  useEffect(() => {
    (async () => {
      const result = {};

      await Promise.all(
        days.map(async (d) => {
          try {
            const res =
              await animeApi.getSchedule(
                d.date
              );

            /*
              Jikan-safe fallback
            */
            result[d.date] =
              res?.data?.scheduledAnimes ||
              res?.data ||
              [];
          } catch {
            result[d.date] = [];
          }
        })
      );

      setData(result);
      setLoading(false);
    })();
  }, []);

  const items =
    data[days[tab]?.date] || [];

  return (
    <div
      style={{
        background:
          'var(--bg-card)',
        border:
          '1px solid var(--border)',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 0
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom:
            '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between'
        }}
      >
        <div
          style={{
            fontFamily:
              'Rajdhani, sans-serif',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: 7
          }}
        >
          <Calendar size={14} />
          Schedule
        </div>

        <Link
          href="/schedule"
          style={{
            fontSize: 11,
            color: 'var(--text-3)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            textDecoration: 'none'
          }}
        >
          Full
          <ChevronRight size={11} />
        </Link>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom:
            '1px solid var(--border)',
          overflowX: 'auto'
        }}
      >
        {days.map((d) => (
          <button
            key={d.dow}
            onClick={() =>
              setTab(d.dow)
            }
            style={{
              flexShrink: 0,
              padding: '7px 10px',
              fontSize: 11,
              fontWeight: 700,
              textTransform:
                'uppercase',
              color:
                tab === d.dow
                  ? 'var(--accent)'
                  : 'var(--text-3)',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${
                tab === d.dow
                  ? 'var(--accent)'
                  : 'transparent'
              }`,
              cursor: 'pointer'
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div
        style={{
          maxHeight: 340,
          overflowY: 'auto'
        }}
      >
        {loading ? (
          <div
            style={{
              padding: '14px'
            }}
          >
            Loading...
          </div>
        ) : items.length === 0 ? (
          <p
            style={{
              padding: '18px 14px',
              fontSize: 12,
              color: 'var(--text-3)',
              textAlign: 'center'
            }}
          >
            No schedule for{' '}
            {days[tab]?.label}
          </p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}
          >
            {items
              .slice(0, 12)
              .map((anime, i) => {
                const id =
                  anime.mal_id ||
                  anime.id;

                const name =
                  anime.title ||
                  anime.name ||
                  'Unknown Anime';

                const poster =
                  anime.images?.jpg
                    ?.image_url ||
                  anime.poster ||
                  '/no-poster.svg';

                const score =
                  anime.score ||
                  anime.rating ||
                  null;

                return (
                  <li
                    key={id || i}
                    style={{
                      borderBottom:
                        '1px solid var(--border)'
                    }}
                  >
                    <Link
                      href={`/anime/${id}`}
                      style={{
                        display:
                          'flex',
                        alignItems:
                          'center',
                        gap: 10,
                        padding:
                          '9px 14px',
                        textDecoration:
                          'none'
                      }}
                    >
                      <img
                        src={poster}
                        alt={name}
                        style={{
                          width: 36,
                          minWidth: 36,
                          height: 50,
                          objectFit:
                            'cover',
                          borderRadius: 3
                        }}
                        loading="lazy"
                        onError={(
                          e
                        ) =>
                          (e.currentTarget.src =
                            '/no-poster.svg')
                        }
                      />

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0
                        }}
                      >
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color:
                              'var(--text-2)',
                            marginBottom: 4
                          }}
                        >
                          {name}
                        </p>

                        <div
                          style={{
                            display:
                              'flex',
                            alignItems:
                              'center',
                            gap: 6
                          }}
                        >
                          {score && (
                            <span
                              style={{
                                fontSize: 10,
                                color:
                                  'var(--accent)',
                                fontWeight: 700
                              }}
                            >
                              Score{' '}
                              {score}
                            </span>
                          )}

                          <span
                            style={{
                              fontSize: 10,
                              color:
                                'var(--text-3)',
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap: 3
                            }}
                          >
                            <Clock size={9} />
                            Weekly
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}
