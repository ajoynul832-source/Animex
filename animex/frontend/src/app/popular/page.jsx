'use client';
import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';
export default function PopularPage() { return <BrowsePage title="Most Popular" fetchFn={animeApi.getMostPopular} />; }
