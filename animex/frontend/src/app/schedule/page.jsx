'use client';

import {
  useState,
  useEffect
} from 'react';

import Link from 'next/link';

import {
  Calendar,
  Clock
} from 'lucide-react';

import { animeApi } from '@/lib/api';
import { ListItemSkeleton } from '@/components/ui/Skeleton';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

export default function SchedulePage() {
  const today =
    new Date();

  const todayDow =
    today.getDay();

  const [selected,
    setSelected] =
    useState(
      todayDow
    );

  const [schedules,
    setSchedules] =
    useState({});

  const [loading,
    setLoading] =
    useState(true);

  /*
  Build week from Sunday
  */

  const week =
    Array.from(
      {
        length: 7
      },
      (_, i) => {
        const d =
          new Date(
            today
          );

        d.setDate(
          today.getDate() -
            todayDow +
            i
        );

        return {
          dow: i,
          label:
            DAY_NAMES[
              i
            ],
          short:
            SHORT[i],
          date:
            d
              .toISOString()
              .split(
                'T'
              )[0],
          isToday:
            i ===
            todayDow
        };
      }
    );

  /*
  Load weekly schedule
  */

  useEffect(() => {
    let mounted =
      true;

    setLoading(
      true
    );

    Promise.all(
      week.map(
        async (
          day
        ) => {
          try {
            const res =
              await animeApi.getSchedule(
                day.date
              );

            return [
              day.date,
              res?.data
                ?.scheduledAnimes ||
                res?.data ||
                []
            ];
          } catch {
            return [
              day.date,
              []
            ];
          }
        }
      )
    )
      .then(
        (
          entries
        ) => {
          if (
            !mounted
          )
            return;

          setSchedules(
            Object.fromEntries(
              entries
            )
          );
        }
      )
      .finally(() => {
        if (
          mounted
        ) {
          setLoading(
            false
          );
        }
      });

    return () => {
      mounted =
        false;
    };
  }, []);

  const current =
    schedules[
      week[
        selected
      ]?.date
    ] || [];

  return (
    <div className="page-inner">
      {/* Header */}
      <div
        className="block_area-header"
        style={{
          marginBottom: 22
        }}
      >
        <h1
          className="cat-heading"
          style={{
            display:
              'flex',
            alignItems:
              'center',
            gap: 10
          }}
        >
          <Calendar
            size={22}
            style={{
              color:
                'var(--accent)'
            }}
          />

          Airing
          Schedule
        </h1>

        <p
          style={{
            fontSize: 13,
            color:
              'var(--text-3)'
          }}
        >
          Week of{' '}
          {
            week[0]
              ?.date
          }
        </p>
      </div>

      {/* Day Tabs */}
      <div
        style={{
          display:
            'flex',
          borderBottom:
            '2px solid var(--border)',
          marginBottom: 24,
          overflowX:
            'auto'
        }}
      >
        {week.map(
          (
            day
          ) => (
            <button
              key={
                day.dow
              }
              onClick={() =>
                setSelected(
                  day.dow
                )
              }
              style={{
                flexShrink: 0,
                padding:
                  '10px 18px',
                fontSize: 13,
                fontWeight: 600,
                background:
                  'none',
                border:
                  'none',
                cursor:
                  'pointer',
                color:
                  selected ===
                  day.dow
                    ? 'var(--accent)'
                    : 'var(--text-3)',
                borderBottom: `2px solid ${
                  selected ===
                  day.dow
                    ? 'var(--accent)'
                    : 'transparent'
                }`,
                marginBottom:
                  -2
              }}
            >
              {
                day.label
              }
            </button>
          )
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 14
          }}
        >
          {Array.from(
            {
              length: 6
            }
          ).map(
            (
              _,
              i
            ) => (
              <div
                key={
                  i
                }
                style={{
                  background:
                    'var(--bg-card)',
                  border:
                    '1px solid var(--border)',
                  borderRadius: 8,
                  overflow:
                    'hidden'
                }}
              >
                <ListItemSkeleton count={4} />
              </div>
            )
          )}
        </div>
      ) : current.length ===
        0 ? (
        <div className="empty-state">
          <Calendar
            size={48}
            className="empty-state-icon"
          />

          <p className="empty-state-title">
            No schedule
            available
            for{' '}
            {
              week[
                selected
              ]?.label
            }
          </p>
        </div>
      ) : (
        <div>
          <p
            style={{
              fontSize: 13,
              color:
                'var(--text-3)',
              marginBottom: 16
            }}
          >
            {
              current.length
            }{' '}
            anime
            airing on{' '}
            <strong>
              {
                week[
                  selected
                ]?.label
              }
            </strong>
          </p>

          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 10
            }}
          >
            {current.map(
              (
                anime,
                i
              ) => {
                const id =
                  anime.id ||
                  anime.mal_id ||
                  i;

                const name =
                  anime.name ||
                  anime.title ||
                  'Unknown Anime';

                const poster =
                  anime.poster ||
                  anime.images
                    ?.jpg
                    ?.image_url ||
                  '/no-poster.svg';

                return (
                  <Link
                    key={
                      id
                    }
                    href={`/anime/${id}`}
                    style={{
                      display:
                        'flex',
                      alignItems:
                        'center',
                      gap: 12,
                      background:
                        'var(--bg-card)',
                      border:
                        '1px solid var(--border)',
                      borderRadius: 8,
                      padding:
                        '10px 14px',
                      textDecoration:
                        'none'
                    }}
                  >
                    <img
                      src={
                        poster
                      }
                      alt={
                        name
                      }
                      style={{
                        width: 44,
                        height: 62,
                        objectFit:
                          'cover',
                        borderRadius: 4,
                        flexShrink: 0
                      }}
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
                          fontSize: 13,
                          fontWeight: 600,
                          marginBottom: 4
                        }}
                      >
                        {
                          name
                        }
                      </p>

                      <p
                        style={{
                          fontSize: 11,
                          color:
                            'var(--text-3)',
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap: 4
                        }}
                      >
                        <Clock size={10} />
                        Weekly
                        Release
                      </p>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}
