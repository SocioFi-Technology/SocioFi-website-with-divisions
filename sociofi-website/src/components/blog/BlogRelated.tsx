import { BlogPost } from '@/lib/blog';
import BlogCard from './BlogCard';

interface BlogRelatedProps {
  posts: BlogPost[];
  currentSlug: string;
}

export default function BlogRelated({ posts, currentSlug }: BlogRelatedProps) {
  const related = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section style={{ padding: '60px 0 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 24,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 20,
            height: 1.5,
            background: 'var(--teal)',
          }}
          aria-hidden="true"
        />
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--teal)',
            margin: 0,
          }}
        >
          Continue Reading
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }}
      >
        <style>{`
          @media (max-width: 900px) {
            .blog-related-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 600px) {
            .blog-related-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
        {related.map((post) => (
          <BlogCard key={post.slug} post={post} compact />
        ))}
      </div>
    </section>
  );
}
