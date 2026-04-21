'use client';
import { useEffect, useState, useCallback } from 'react';
import { animeApi } from '@/lib/api';
import AnimeGrid from '@/components/anime/AnimeGrid';

export default function BrowsePage({ title, fetchFn, icon }) {
  const [animes, setAnimes] = useState([]);
  const [page,   setPage]   = useState(1);
  const [total,  setTotal]  = useState(1);
  const [loading,setLoading]= useState(true);

  const load = useCallback(async (p) => {
    setLoading(true);
    try {
      const d = await fetchFn(p);
      const data = d?.data || {};
      setAnimes(
        data.animes || data.topAiringAnimes || data.mostPopularAnimes ||
        data.mostFavoriteAnimes || data.movies || data.series || []
      );
      setTotal(data.totalPages || 1);
    } catch { setAnimes([]); }
    setLoading(false);
  }, [fetchFn]);

  useEffect(() => { load(page); }, [page, load]);

  const handlePageChange = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="page-inner">
      <div className="block_area-header" style={{ marginBottom: 20 }}>
        <h1 className="cat-heading" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 26 }}>
          {icon && <span style={{ color: 'var(--accent)' }}>{icon}</span>}
          {title}
        </h1>
        {!loading && <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Page {page} of {total}</span>}
      </div>

      <AnimeGrid
        animes={animes}
        loading={loading}
        page={page}
        totalPages={total}
        onPageChange={handlePageChange}
        emptyMessage={`No ${title.toLowerCase()} found.`}
      />
    </div>
  );
}
