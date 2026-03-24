import { SkeletonGrid, SkeletonLine } from '@/components/shared/Skeleton';

export default function CoursesLoading() {
  return (
    <div style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 48, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
        <SkeletonLine width={120} height={12} />
        <SkeletonLine width={360} height={40} />
        <SkeletonLine width={280} height={16} />
      </div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}>
        {[80, 100, 90, 110, 95].map((w, i) => (
          <div key={i} style={{
            width: w, height: 34,
            background: 'var(--bg-3)', borderRadius: 100,
            animation: 'skeleton-pulse 1.6s ease-in-out infinite',
          }} />
        ))}
      </div>
      <SkeletonGrid count={6} columns={3} cardProps={{ image: true, imageHeight: 180, lines: 3 }} />
      <style>{`@keyframes skeleton-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}
