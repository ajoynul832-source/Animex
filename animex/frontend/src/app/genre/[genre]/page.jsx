'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';

export default function GenrePage() {
  const params =
    useParams();

  const rawGenre =
    params?.genre ||
    '';

  /*
  Safe label:
  action-adventure
  -> Action Adventure
  */

  const label =
    useMemo(() => {
      return String(
        rawGenre
      )
        .replace(
          /-/g,
          ' '
        )
        .replace(
          /\b\w/g,
          (c) =>
            c.toUpperCase()
        )
        .trim();
    }, [rawGenre]);

  /*
  Jikan-safe fetch
  backend already handles:
  /genre/:genre
  */

  const fetchGenre =
    (page = 1) =>
      animeApi.getByGenre(
        rawGenre,
        page
      );

  return (
    <BrowsePage
      title={
        label ||
        'Genre'
      }
      fetchFn={
        fetchGenre
      }
    />
  );
}
