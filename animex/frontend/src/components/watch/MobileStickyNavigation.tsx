'use client';

interface Props {
  previous: number | null;
  current: number;
  next: number | null;
  onNavigate: (episode: number) => void;
}

export default function MobileStickyNavigation({
  previous,
  current,
  next,
  onNavigate,
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-black/95 backdrop-blur-md p-3 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <button
          disabled={!previous}
          onClick={() => previous && onNavigate(previous)}
          className="px-4 py-2 rounded-xl border disabled:opacity-50"
        >
          Prev
        </button>

        <div className="font-semibold text-sm">
          Episode {current}
        </div>

        <button
          disabled={!next}
          onClick={() => next && onNavigate(next)}
          className="px-4 py-2 rounded-xl border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
