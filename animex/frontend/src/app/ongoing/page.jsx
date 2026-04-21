'use client';
import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';
export default function OngoingPage() {
  return <BrowsePage title="Ongoing" fetchFn={animeApi.getOngoing} />;
}
