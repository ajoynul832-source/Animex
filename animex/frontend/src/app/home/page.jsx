'use client';
import { useEffect, useState } from 'react';
import { animeApi } from '@/lib/api';
import HeroSlider from '@/components/anime/HeroSlider';
import AnimeRow from '@/components/anime/AnimeRow';

export default function HomePage() {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animeApi
      .getHome()
      .then((d) => {
        setHome(d?.data || null);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <HeroSlider
        slides={home?.spotlightAnimes || []}
        loading={loading}
      />

      <AnimeRow
        title="Latest Episodes"
        animes={home?.latestEpisodeAnimes || []}
        loading={loading}
        viewAllHref="/latest/subbed"
      />
    </div>
  );
}
