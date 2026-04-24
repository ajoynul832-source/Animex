'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import {
  animeApi,
  userApi
} from '@/lib/api';

import HeroSlider from '@/components/anime/HeroSlider';
import AnimeRow from '@/components/anime/AnimeRow';
import TopRankedList from '@/components/anime/TopRankedList';
import ScheduleWidget from '@/components/anime/ScheduleWidget';

import { useAuth } from '@/lib/AuthContext';
import { useWatchProgress } from '@/hooks/useWatchProgress';

export default function HomePage() {
  const { user } =
    useAuth();

  const { progress } =
    useWatchProgress();

  const [home, setHome] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const [history,
    setHistory] =
    useState([]);

  useEffect(() => {
    animeApi
      .getHome()
      .then((res) => {
        setHome(
          res?.data || null
        );
      })
      .catch(
        console.error
      )
      .finally(() => {
        setLoading(
          false
        );
      });
  }, []);

  useEffect(() => {
    if (!user) return;

    userApi
      .getHistory()
      .then((res) => {
        setHistory(
          (
            res?.history ||
            []
          ).slice(0, 12)
        );
      })
      .catch(() => {});
  }, [user]);

  /*
  Safe normalized data
  */

  const spotlight =
    home?.spotlightAnimes ||
    [];

  const trending =
    home?.trendingAnimes ||
    [];

  const latest =
    home?.latestEpisodeAnimes ||
    [];

  const airing =
    home?.topAiringAnimes ||
    [];

  const popular =
    home?.mostPopularAnimes ||
    [];

  const favorite =
    home?.mostFavoriteAnimes ||
    [];

  const completed =
    home?.latestCompletedAnimes ||
    [];

  return (
    <div>
      {/* Hero */}
      <HeroSlider
        slides={
          spotlight
        }
        loading={
          loading
        }
      />

      {/* Trending Strip */}
      {!loading &&
        trending.length >
          0 && (
          <div className="trending-strip">
            <span className="trending-label">
              🔥 Trending
            </span>

            <div className="trending-items">
              {trending
                .slice(
                  0,
                  14
                )
                .map(
                  (
                    anime,
                    i
                  ) => {
                    const id =
                      anime?.id ||
                      anime?.mal_id;

                    if (!id)
                      return null;

                    const name =
                      anime?.name ||
                      anime?.title ||
                      'Unknown';

                    const poster =
                      anime?.poster ||
                      anime?.images
                        ?.jpg
                        ?.large_image_url ||
                      anime?.images
                        ?.jpg
                        ?.image_url ||
                      '/no-poster.svg';

                    return (
                      <Link
                        key={
                          id ||
                          i
                        }
                        href={`/anime/${id}`}
                        className="trending-pill"
                      >
                        <span className="trending-num">
                          {
                            i +
                            1
                          }
                        </span>

                        <img
                          src={
                            poster
                          }
                          alt={
                            name
                          }
                          onError={(
                            e
                          ) => {
                            e.currentTarget.style.display =
                              'none';
                          }}
                        />

                        {
                          name
                        }
                      </Link>
                    );
                  }
                )}
            </div>
          </div>
        )}

      {/* Main Layout */}
      <div
        style={{
          display:
            'flex',
          gap: 0
        }}
      >
        {/* Left */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding:
              '20px 20px 20px 24px'
          }}
        >
          {/* Continue Watching */}
          {user &&
            history.length >
              0 && (
              <AnimeRow
                title="Continue Watching"
                animes={history.map(
                  (
                    item
                  ) => ({
                    id:
                      item.animeId,
                    name:
                      item.animeTitle,
                    poster:
                      item.animeImage,
                    type:
                      item.animeType,
                    animeId:
                      item.animeId
                  })
                )}
                loading={
                  false
                }
                viewAllHref="/history"
                progressMap={
                  progress
                }
              />
            )}

          <AnimeRow
            title="Latest Episodes"
            animes={
              latest
            }
            loading={
              loading
            }
            viewAllHref="/latest/subbed"
          />

          <AnimeRow
            title="Top Airing"
            animes={
              airing
            }
            loading={
              loading
            }
            viewAllHref="/top-airing"
          />

          <AnimeRow
            title="Most Popular"
            animes={
              popular
            }
            loading={
              loading
            }
            viewAllHref="/popular"
          />

          <AnimeRow
            title="Most Favorite"
            animes={
              favorite
            }
            loading={
              loading
            }
            viewAllHref="/most-favorite"
          />

          <AnimeRow
            title="Recently Completed"
            animes={
              completed
            }
            loading={
              loading
            }
            viewAllHref="/completed"
          />
        </div>

        {/* Right Sidebar */}
        <aside
          className="home-right-sidebar"
          style={{
            width: 296,
            minWidth: 296,
            flexShrink: 0,
            padding:
              '20px 20px 20px 0',
            borderLeft:
              '1px solid var(--border)'
          }}
        >
          <ScheduleWidget />

          <TopRankedList
            title="Top Airing"
            animes={
              airing
            }
            viewAllHref="/top-airing"
          />

          <TopRankedList
            title="Most Popular"
            animes={
              popular
            }
            viewAllHref="/popular"
          />

          <GenreCloud />
        </aside>
      </div>
    </div>
  );
}

function GenreCloud() {
  const genres = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Isekai',
    'Magic',
    'Mecha',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Shounen',
    'Slice of Life',
    'Sports',
    'Supernatural'
  ];

  return (
    <div className="anif-block">
      <div className="anif-block-header">
        Browse Genres
      </div>

      <div
        style={{
          padding:
            '12px 14px',
          display:
            'flex',
          flexWrap:
            'wrap',
          gap: 6
        }}
      >
        {genres.map(
          (genre) => (
            <Link
              key={
                genre
              }
              href={`/genre/${genre
                .toLowerCase()
                .replace(
                  / /g,
                  '-'
                )}`}
              style={{
                fontSize: 11,
                color:
                  'var(--text-3)',
                background:
                  'var(--bg-card-alt)',
                border:
                  '1px solid var(--border)',
                borderRadius: 4,
                padding:
                  '4px 9px',
                textDecoration:
                  'none'
              }}
            >
              {genre}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
