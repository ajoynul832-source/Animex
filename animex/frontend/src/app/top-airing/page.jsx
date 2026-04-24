'use client';

import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';

export default function TopAiringPage() {
  /*
  Uses shared BrowsePage
  which now safely supports:
  - Jikan backend
  - pagination
  - normalized anime cards
  */

  const fetchTopAiring = (
    page = 1
  ) => {
    return animeApi.getTopAiring(
      page
    );
  };

  return (
    <BrowsePage
      title="Top Airing"
      fetchFn={
        fetchTopAiring
      }
    />
  );
}
