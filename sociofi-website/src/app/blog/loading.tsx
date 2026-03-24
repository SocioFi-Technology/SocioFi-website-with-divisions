import { SkeletonGrid, SkeletonLine, SkeletonCard } from '@/components/shared/Skeleton';

export default function BlogLoading() {
  return (
    <div style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 48, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
        <SkeletonLine width={80} height={12} />
        <SkeletonLine width={320} height={40} />
        <SkeletonLine width={240} height={16} />
      </div>
      {/* Featured article */}
      <SkeletonCard image imageHeight={360} lines={4} style={{ marginBottom: 48 }} />
      {/* Article grid */}
      <SkeletonGrid count={6} columns={3} cardProps={{ image: true, imageHeight: 160, lines: 3 }} />
    </div>
  );
}
