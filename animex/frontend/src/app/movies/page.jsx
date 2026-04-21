'use client';
import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';
export default function MoviesPage() { return <BrowsePage title="Movies" fetchFn={animeApi.getMovies} />; }
