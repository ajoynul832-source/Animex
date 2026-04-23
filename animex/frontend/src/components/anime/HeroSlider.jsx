'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Play, Info, Star, Tv, Clock } from 'lucide-react';

export default function HeroSlider({ slides, loading }) {
  const ref = useRef(null);
  const sw = useRef(null);

  useEffect(() => {
    if (!slides?.length || typeof window === 'undefined') return;

    let instance;

    (async () => {
      const { Swiper } = await import('swiper');
      const {
        Autoplay,
        Pagination,
        EffectFade
      } = await import('swiper/modules');

      if (sw.current) {
        sw.current.destroy(true, true);
      }

      instance = new Swiper(ref.current, {
        modules: [Autoplay, Pagination, EffectFade],
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        loop: true,
        speed: 900,
        autoplay: {
          delay: 5500,
          disableOnInteraction: false
        },
        pagination: {
          el: '.hero-pg',
          clickable: true
        }
      });

      sw.current = instance;
    })();

    return () => {
      if (sw.current) {
        sw.current.destroy(true, true);
      }
    };
  }, [slides]);

  if (loading) {
    return (
      <div
        className="deslide-item skeleton"
        style={{ height: 500 }}
      />
    );
  }

  if (!slides?.length) return null;

  return (
    <div style={{ position: 'relative' }}>
      <div ref={ref} className="swiper">
        <div className="swiper-wrapper">
          {slides.map((a, i) => {
            const id =
              a.mal_id ||
              a.id;

            const name =
              a.title ||
              a.name ||
              'Unknown Anime';

            const poster =
              a.images?.jpg?.large_image_url ||
              a.images?.jpg?.image_url ||
              a.poster ||
              '/no-poster.svg';

            const rating =
              a.score ||
              a.rating ||
              null;

            const type =
              a.type ||
              '';

            const duration =
              a.duration ||
              '';

            const description =
              a.synopsis ||
              a.description ||
              '';

            return (
              <div
                className="swiper-slide"
                key={id || i}
              >
                <div className="deslide-item">
                  <div className="deslide-cover">
                    <img
                      className="deslide-bg"
                      src={poster}
                      alt={name}
                      onError={(e) => {
                        e.currentTarget.src =
                          '/no-poster.svg';
                      }}
                    />
                  </div>

                  <div className="deslide-content">
                    <div className="desi-rank">
                      <span className="desi-rank-badge">
                        #{i + 1}
                      </span>
                      Spotlight
                    </div>

                    <h1 className="desi-head-title">
                      {name}
                    </h1>

                    <div className="desi-meta">
                      {rating && (
                        <span className="desi-meta-item desi-rating">
                          <Star
                            size={12}
                            fill="currentColor"
                            strokeWidth={0}
                          />
                          {rating}
                        </span>
                      )}

                      {type && (
                        <span className="desi-meta-item">
                          <Tv size={12} />
                          {type}
                        </span>
                      )}

                      {duration && (
                        <span className="desi-meta-item">
                          <Clock size={12} />
                          {duration}
                        </span>
                      )}
                    </div>

                    {description && (
                      <p className="desi-desc">
                        {description}
                      </p>
                    )}

                    <div className="desi-btns">
                      <Link
                        href={`/anime/${id}`}
                        className="btn-watch"
                      >
                        <Play
                          size={15}
                          fill="#111"
                          strokeWidth={0}
                        />
                        Watch Now
                      </Link>

                      <Link
                        href={`/anime/${id}`}
                        className="btn-detail"
                      >
                        <Info size={14} />
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="hero-pg"
          style={{
            position: 'absolute',
            bottom: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            gap: 5
          }}
        />
      </div>
    </div>
  );
}
