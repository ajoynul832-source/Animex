'use client';
import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';
export default function MostFavoritePage() { return <BrowsePage title="Most Favorite" fetchFn={animeApi.getMostFavorite}/>; }
