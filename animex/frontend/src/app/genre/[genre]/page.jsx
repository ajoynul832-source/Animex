'use client';
import { useParams } from 'next/navigation';
import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';
export default function GenrePage() {
  const { genre } = useParams();
  const label = genre.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase());
  return <BrowsePage title={label} fetchFn={(p) => animeApi.getByGenre(genre, p)} />;
}
