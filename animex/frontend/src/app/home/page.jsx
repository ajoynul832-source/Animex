'use client';
import { useEffect, useState } from 'react';
import { animeApi } from '@/lib/api';
import HeroSlider from '@/components/anime/HeroSlider';

export default function HomePage() {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animeApi
      .getHome()
      .then((d) => {
        setHome(d?.data || null);
      })
      .catch((err) => {
        console.error(err);
      })
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
    </div>
  );
}
