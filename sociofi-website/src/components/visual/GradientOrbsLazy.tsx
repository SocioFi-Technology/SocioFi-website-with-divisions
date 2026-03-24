'use client';
import dynamic from 'next/dynamic';

// Deferred client-only load — safe to import from Server Components
const GradientOrbs = dynamic(() => import('./GradientOrbs'), { ssr: false });
export default GradientOrbs;
