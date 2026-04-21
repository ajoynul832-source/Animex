'use client';
import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';
export default function TopAiringPage() { return <BrowsePage title="Top Airing" fetchFn={animeApi.getTopAiring}/>; }
