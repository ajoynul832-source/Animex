'use client';
import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';
export default function NewSeasonPage() { return <BrowsePage title="New Season" fetchFn={animeApi.getNewSeason} />; }
