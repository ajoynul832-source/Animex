'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { animeApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function RandomPage() {
  const router = useRouter();

  useEffect(() => {
    const go = async () => {
      try {
        // Pick a random page from top airing
        const randomPage = Math.floor(Math.random() * 5) + 1;
        const data = await animeApi.getTopAiring(randomPage);
        const animes = data?.data?.animes || [];
        if (animes.length > 0) {
          const pick = animes[Math.floor(Math.random() * animes.length)];
          router.replace(`/anime/${pick.id}`);
        } else {
          router.replace('/home');
        }
      } catch {
        router.replace('/home');
      }
    };
    go();
  }, []);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Loader2 size={36} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Finding a random anime for you…</p>
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
