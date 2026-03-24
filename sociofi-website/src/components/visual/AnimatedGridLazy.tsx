'use client';
import dynamic from 'next/dynamic';

// Deferred client-only load — safe to import from Server Components
const AnimatedGrid = dynamic(() => import('./AnimatedGrid'), { ssr: false });
export default AnimatedGrid;
