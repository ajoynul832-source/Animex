'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Play, Info, Star, Tv, Clock } from 'lucide-react';

export default function HeroSlider({ slides, loading }) {
  const ref = useRef(null);
  const sw  = useRef(null);

  useEffect(() => {
    if (!slides?.length || typeof window === 'undefined') return;
    let instance;
    (async () => {
      const { Swiper }                    = await import('swiper');
      const { Autoplay, Pagination, EffectFade } = await import('swiper/modules');
      if (sw.current) { sw.current.destroy(true,true); }
      instance = new Swiper(ref.current, {
        modules: [Autoplay, Pagination, EffectFade],
        effect: 'fade', fadeEffect: { crossFade: true },
        loop: true, speed: 900,
        autoplay: { delay: 5500, disableOnInteraction: false },
        pagination: { el: '.hero-pg', clickable: true },
      });
      sw.current = instance;
    })();
    return () => { if (sw.current) sw.current.destroy(true,true); };
  }, [slides]);

  if (loading) return <div className="deslide-item skeleton" style={{ height:500 }} />;
  if (!slides?.length) return null;

  return (
    <div style={{ position:'relative' }}>
      <div ref={ref} className="swiper">
        <div className="swiper-wrapper">
          {slides.map((a, i) => (
            <div className="swiper-slide" key={a.id || i}>
              <div className="deslide-item">
                <div className="deslide-cover">
                  <img className="deslide-bg" src={a.poster||'/no-poster.svg'} alt={a.name} onError={e=>{e.currentTarget.src='/no-poster.svg'}} />
                </div>
                <div className="deslide-content">
                  <div className="desi-rank">
                    <span className="desi-rank-badge">#{i+1}</span> Spotlight
                  </div>
                  <h1 className="desi-head-title">{a.name}</h1>
                  <div className="desi-meta">
                    {a.rating && <span className="desi-meta-item desi-rating"><Star size={12} fill="currentColor" strokeWidth={0}/>{a.rating}</span>}
                    {a.type   && <span className="desi-meta-item"><Tv size={12}/>{a.type}</span>}
                    {a.duration&&<span className="desi-meta-item"><Clock size={12}/>{a.duration}</span>}
                    {a.episodes?.sub!=null&&<span className="tick-item tick-sub" style={{position:'static',float:'none'}}>SUB {a.episodes.sub}</span>}
                    {a.episodes?.dub!=null&&<span className="tick-item tick-dub" style={{position:'static',float:'none'}}>DUB {a.episodes.dub}</span>}
                  </div>
                  {a.description && <p className="desi-desc">{a.description}</p>}
                  <div className="desi-btns">
                    <Link href={`/watch/${a.id}`} className="btn-watch"><Play size={15} fill="#111" strokeWidth={0}/> Watch Now</Link>
                    <Link href={`/anime/${a.id}`} className="btn-detail"><Info size={14}/> Details</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hero-pg" style={{ position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)', zIndex:10, display:'flex', gap:5 }} />
      </div>
    </div>
  );
}
