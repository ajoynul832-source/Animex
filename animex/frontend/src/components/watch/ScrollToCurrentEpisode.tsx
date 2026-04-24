'use client';

import { useEffect } from 'react';

interface Props {
  currentEpisode: number;
}

export default function ScrollToCurrentEpisode({
  currentEpisode,
}: Props) {
  useEffect(() => {
    const target = document.getElementById(
      `episode-${currentEpisode}`
    );

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentEpisode]);

  return null;
}
