import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const threshold = 10;

    const handler = () => {
      const y = window.scrollY;
      if (y < 60) { setNavVisible(true); setScrollDir('up'); return; }
      if (Math.abs(y - lastY) < threshold) return;
      const dir = y < lastY ? 'up' : 'down';
      setScrollDir(dir);
      setNavVisible(dir === 'up');
      lastY = y;
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return { scrollDir, navVisible };
}
