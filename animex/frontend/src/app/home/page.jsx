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

      <div
        style={{
          padding: 30,
          color: 'white'
        }}
      >
        <h2>Latest Episodes</h2>

        {(home?.latestEpisodeAnimes || [])
          .slice(0, 5)
          .map((a, i) => (
            <div
              key={i}
              style={{
                marginBottom: 10
              }}
            >
              {a.name}
            </div>
          ))}
      </div>
    </div>
  );
}
