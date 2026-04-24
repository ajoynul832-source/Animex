'use client';

import {
  useEffect,
  useState,
  useCallback
} from 'react';

import AnimeGrid from '@/components/anime/AnimeGrid';

export default function BrowsePage({
  title,
  fetchFn,
  icon
}) {
  const [animes,
    setAnimes] =
    useState([]);

  const [page,
    setPage] =
    useState(1);

  const [totalPages,
    setTotalPages] =
    useState(1);

  const [loading,
    setLoading] =
    useState(true);

  /*
  Safe loader for:
  - genre
  - top airing
  - popular
  - favorite
  - completed
  - ongoing
  - movies
  - tv
  */

  const loadData =
    useCallback(
      async (
        pageNumber
      ) => {
        setLoading(
          true
        );

        try {
          const res =
            await fetchFn(
              pageNumber
            );

          const data =
            res?.data ||
            {};

          /*
          Support multiple backend response shapes
          */

          const items =
            data.animes ||
            data.topAiringAnimes ||
            data.mostPopularAnimes ||
            data.mostFavoriteAnimes ||
            data.latestEpisodeAnimes ||
            data.latestCompletedAnimes ||
            data.movies ||
            data.series ||
            data.scheduledAnimes ||
            [];

          setAnimes(
            Array.isArray(
              items
            )
              ? items
              : []
          );

          setTotalPages(
            Number(
              data.totalPages ||
              1
            )
          );
        } catch (
          error
        ) {
          setAnimes(
            []
          );

          setTotalPages(
            1
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [fetchFn]
    );

  useEffect(() => {
    loadData(
      page
    );
  }, [
    page,
    loadData
  ]);

  const handlePageChange =
    (
      nextPage
    ) => {
      if (
        nextPage <
          1 ||
        nextPage >
          totalPages
      ) {
        return;
      }

      setPage(
        nextPage
      );

      if (
        typeof window !==
        'undefined'
      ) {
        window.scrollTo(
          {
            top: 0,
            behavior:
              'smooth'
          }
        );
      }
    };

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
            gap: 10,
            fontSize: 26
          }}
        >
          {icon && (
            <span
              style={{
                color:
                  'var(--accent)'
              }}
            >
              {icon}
            </span>
          )}

          {title}
        </h1>

        {!loading && (
          <span
            style={{
              fontSize: 13,
              color:
                'var(--text-3)'
            }}
          >
            Page{' '}
            {page}{' '}
            of{' '}
            {totalPages}
          </span>
        )}
      </div>

      {/* Grid */}
      <AnimeGrid
        animes={
          animes
        }
        loading={
          loading
        }
        page={
          page
        }
        totalPages={
          totalPages
        }
        onPageChange={
          handlePageChange
        }
        emptyMessage={`No ${String(
          title || ''
        ).toLowerCase()} found.`}
      />
    </div>
  );
}
