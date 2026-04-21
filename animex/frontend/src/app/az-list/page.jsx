'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { animeApi } from '@/lib/api';
import AnimeCard, { AnimeCardSkeleton } from '@/components/anime/AnimeCard';

const LETTERS = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

export default function AzListPage() {
  const sp     = useSearchParams();
  const router = useRouter();
  const letter = sp.get('letter') || 'all';
  const page   = parseInt(sp.get('page') || '1');

  const [animes, setAnimes]     = useState([]);
  const [totalPages, setTotal]  = useState(1);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    animeApi.getAzList(letter, page)
      .then(d => {
        setAnimes(d?.data?.animes || []);
        setTotal(d?.data?.totalPages || 1);
      })
      .catch(() => setAnimes([]))
      .finally(() => setLoading(false));
  }, [letter, page]);

  const go = (l, p = 1) => router.push(`/az-list?letter=${l}&page=${p}`);

  return (
    <div style={{ padding: '24px 24px 48px' }}>
      {/* Title */}
      <div className="block_area-header">
        <h1 className="cat-heading">A-Z List</h1>
      </div>

      {/* Letter selector */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 5,
        marginBottom: 24,
        padding: '14px 16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 8,
      }}>
        <button
          onClick={() => go('all')}
          style={{
            padding: '5px 12px', borderRadius: 5, fontSize: 13, fontWeight: 600,
            background: letter === 'all' ? 'var(--accent)' : 'var(--bg-card-alt)',
            border: `1px solid ${letter === 'all' ? 'var(--accent)' : 'var(--border)'}`,
            color: letter === 'all' ? '#111' : 'var(--text-3)',
            cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all .15s',
          }}
        >All</button>
        {LETTERS.slice(1).map(l => (
          <button
            key={l}
            onClick={() => go(l)}
            style={{
              width: 34, height: 34, borderRadius: 5,
              fontSize: 13, fontWeight: 700,
              background: letter === l ? 'var(--accent)' : 'var(--bg-card-alt)',
              border: `1px solid ${letter === l ? 'var(--accent)' : 'var(--border)'}`,
              color: letter === l ? '#111' : 'var(--text-2)',
              cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', transition: 'all .15s',
            }}
          >{l}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="film-grid film-grid-6" style={{ marginBottom: 32 }}>
        {loading
          ? Array.from({ length: 24 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : animes.map((a, i) => <AnimeCard key={a?.id || i} anime={a} />)
        }
      </div>

      {!loading && animes.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px 0', fontSize: 14 }}>
          No anime found for "{letter.toUpperCase()}".
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => go(letter, page - 1)} disabled={page <= 1}>
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = page <= 4 ? i + 1 : page - 3 + i;
            if (p < 1 || p > totalPages) return null;
            return (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => go(letter, p)}>
                {p}
              </button>
            );
          })}
          <button className="page-btn" onClick={() => go(letter, page + 1)} disabled={page >= totalPages}>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
