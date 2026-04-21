'use client';
import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';
export default function TvSeriesPage() { return <BrowsePage title="TV Series" fetchFn={animeApi.getTvSeries} />; }
