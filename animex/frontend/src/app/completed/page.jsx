'use client';
import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';
export default function CompletedPage() { return <BrowsePage title="Completed" fetchFn={animeApi.getCompleted} />; }
