'use client';

import { useRef, useState } from 'react';

interface SwipeCarouselProps {
  children: React.ReactNode[];
  accentColor?: string;
  cardWidth?: string; // default '85vw'
  maxCardWidth?: string; // default '400px'
}

const STYLES = `
  .swc-wrap { position: relative; width: 100%; }
  .swc-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 16px;
    padding-bottom: 4px;
  }
  .swc-track::-webkit-scrollbar { display: none; }
  .swc-item {
    scroll-snap-align: center;
    flex-shrink: 0;
  }
  .swc-dots {
    display: flex; justify-content: center; align-items: center;
    gap: 8px; margin-top: 20px;
  }
  .swc-dot {
    height: 6px; border-radius: 3px;
    background: var(--border);
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    cursor: pointer;
  }
  .swc-dot.active { width: 20px !important; }
`;

export default function SwipeCarousel({
  children,
  accentColor,
  cardWidth = '85vw',
  maxCardWidth = '400px',
}: SwipeCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const count = Array.isArray(children) ? children.length : 1;
  const items = Array.isArray(children) ? children : [children];

  const handleScroll = () => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const itemWidth = track.scrollWidth / count;
    const index = Math.round(track.scrollLeft / itemWidth);
    setActive(Math.max(0, Math.min(index, count - 1)));
  };

  const scrollTo = (i: number) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const itemWidth = track.scrollWidth / count;
    track.scrollTo({ left: itemWidth * i, behavior: 'smooth' });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="swc-wrap">
        <div ref={trackRef} className="swc-track" onScroll={handleScroll}>
          {items.map((child, i) => (
            <div
              key={i}
              className="swc-item"
              style={{ width: cardWidth, maxWidth: maxCardWidth }}
            >
              {child}
            </div>
          ))}
        </div>
        {count > 1 && (
          <div className="swc-dots">
            {items.map((_, i) => (
              <div
                key={i}
                className={`swc-dot${i === active ? ' active' : ''}`}
                style={{
                  width: i === active ? 20 : 6,
                  background: i === active
                    ? (accentColor || 'var(--teal-light, #72C4B2)')
                    : undefined,
                }}
                onClick={() => scrollTo(i)}
                role="button"
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
