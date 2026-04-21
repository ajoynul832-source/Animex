'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(20);
    const t1 = setTimeout(() => setProgress(60),  80);
    const t2 = setTimeout(() => setProgress(85),  300);
    const t3 = setTimeout(() => setProgress(100), 600);
    const t4 = setTimeout(() => { setVisible(false); setProgress(0); }, 900);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, [pathname]);

  if (!visible) return null;
  return (
    <div
      className="page-progress"
      style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1, transition: progress === 0 ? 'none' : 'width 0.3s ease, opacity 0.3s ease' }}
    />
  );
}
