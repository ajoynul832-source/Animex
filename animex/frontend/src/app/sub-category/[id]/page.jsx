'use client';
import { useParams } from 'next/navigation';
import BrowsePage from '@/components/ui/BrowsePage';
import { animeApi } from '@/lib/api';

export default function SubCategoryPage() {
  const { id } = useParams();
  const label  = id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  // Sub-categories map to genre or type filtering via the AZ list / genre endpoint
  return <BrowsePage title={label} fetchFn={(page) => animeApi.getByGenre(id, page)} />;
}
