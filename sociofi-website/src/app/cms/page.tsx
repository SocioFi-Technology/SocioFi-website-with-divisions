'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const STYLES = `
  .cms-dash { max-width: 1100px; }

  .cms-dash-header {
    margin-bottom: 28px;
  }
  .cms-dash-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 800; font-size: 22px;
    color: #E2E8F0; letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .cms-dash-sub {
    font-size: 13px; color: #6B7B9E;
  }

  .cms-stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }
  @media (max-width: 900px) { .cms-stat-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px) { .cms-stat-grid { grid-template-columns: 1fr; } }

  .cms-stat-card {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px;
    padding: 20px 22px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    text-decoration: none;
  }
  .cms-stat-card:hover {
    border-color: rgba(89,163,146,0.18);
    background: #161636;
  }
  .cms-stat-label {
    font-size: 11px; font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase; letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 10px;
  }
  .cms-stat-value {
    font-family: 'Manrope', sans-serif;
    font-weight: 800; font-size: 32px;
    color: #E2E8F0; letter-spacing: -0.03em;
    line-height: 1;
  }
  .cms-stat-value.loading {
    background: rgba(89,163,146,0.08);
    border-radius: 6px;
    color: transparent;
    animation: cms-pulse 1.4s ease infinite;
    width: 60px; height: 32px;
  }
  .cms-stat-dot {
    width: 8px; height: 8px; border-radius: 50%;
    display: inline-block; margin-right: 6px;
    vertical-align: middle;
  }

  @keyframes cms-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }

  .cms-section-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 16px;
    color: #E2E8F0; letter-spacing: -0.01em;
    margin-bottom: 14px;
  }

  .cms-panel {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 28px;
  }
  .cms-panel-head {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(89,163,146,0.08);
    display: flex; align-items: center; justify-content: space-between;
  }
  .cms-panel-head-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 14px; color: #E2E8F0;
  }

  .cms-table { width: 100%; border-collapse: collapse; }
  .cms-table th {
    padding: 10px 16px;
    font-size: 11px; font-weight: 600;
    color: #6B7B9E; text-align: left;
    text-transform: uppercase; letter-spacing: 0.06em;
    font-family: 'JetBrains Mono', monospace;
    border-bottom: 1px solid rgba(89,163,146,0.08);
  }
  .cms-table td {
    padding: 12px 16px;
    font-size: 13px; color: #CBD5E1;
    border-bottom: 1px solid rgba(89,163,146,0.04);
    vertical-align: middle;
  }
  .cms-table tr:last-child td { border-bottom: none; }
  .cms-table tr:hover td { background: rgba(89,163,146,0.02); }
  .cms-table-empty {
    padding: 40px; text-align: center;
    color: #6B7B9E; font-size: 13px;
  }

  .cms-badge {
    display: inline-flex; align-items: center;
    padding: 3px 8px; border-radius: 100px;
    font-size: 11px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.04em;
  }
  .cms-badge.published { background: rgba(89,163,146,0.12); color: #59A392; }
  .cms-badge.draft { background: rgba(107,123,158,0.12); color: #6B7B9E; }
  .cms-badge.review { background: rgba(232,184,77,0.12); color: #E8B84D; }
  .cms-badge.archived { background: rgba(248,113,113,0.08); color: #F87171; }

  .cms-div-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 2px 7px; border-radius: 100px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(89,163,146,0.06);
    color: #6B7B9E;
  }

  .cms-quick-create {
    display: flex; gap: 10px; flex-wrap: wrap;
  }
  .cms-qc-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 16px;
    background: rgba(89,163,146,0.06);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 10px;
    color: #A8B8D8; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .cms-qc-btn:hover {
    background: rgba(89,163,146,0.1);
    border-color: rgba(89,163,146,0.2);
    color: #E2E8F0;
  }
`;

const DIVISION_COLORS: Record<string, string> = {
  studio: '#72C4B2',
  services: '#4DBFA8',
  labs: '#7B6FE8',
  products: '#E8916F',
  academy: '#E8B84D',
  ventures: '#6BA3E8',
  cloud: '#5BB5E0',
  parent: '#4A6CB8',
};

function StatusBadge({ status }: { status: string }) {
  return <span className={`cms-badge ${status}`}>{status}</span>;
}

function DivisionBadge({ division }: { division: string }) {
  const color = DIVISION_COLORS[division] ?? '#6B7B9E';
  return (
    <span className="cms-div-badge">
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {division}
    </span>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

type Post = {
  id: string;
  title: string;
  division: string;
  status: string;
  author: string;
  created_at: string;
  published_at: string | null;
};

type Stats = {
  posts: number | null;
  courses: number | null;
  faqs: number | null;
  testimonials: number | null;
  portfolio: number | null;
  media: number | null;
};

const STAT_ITEMS = [
  { key: 'posts', label: 'Blog Posts', href: '/cms/posts', color: '#59A392' },
  { key: 'courses', label: 'Courses', href: '/cms/courses', color: '#7B6FE8' },
  { key: 'faqs', label: 'FAQs', href: '/cms/faqs', color: '#E8B84D' },
  { key: 'testimonials', label: 'Testimonials', href: '/cms/testimonials', color: '#6BA3E8' },
  { key: 'portfolio', label: 'Portfolio Items', href: '/cms/portfolio', color: '#E8916F' },
  { key: 'media', label: 'Media Files', href: '/cms/media', color: '#4DBFA8' },
] as const;

const QUICK_CREATE = [
  { label: 'New Post', href: '/cms/posts' },
  { label: 'New Course', href: '/cms/courses' },
  { label: 'New FAQ', href: '/cms/faqs' },
  { label: 'New Testimonial', href: '/cms/testimonials' },
];

export default function CMSDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    posts: null, courses: null, faqs: null,
    testimonials: null, portfolio: null, media: null,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchStats = useCallback(async () => {
    const endpoints = [
      ['/api/cms/posts', 'posts'],
      ['/api/cms/courses', 'courses'],
      ['/api/cms/faqs', 'faqs'],
      ['/api/cms/testimonials', 'testimonials'],
      ['/api/cms/portfolio', 'portfolio'],
      ['/api/cms/media', 'media'],
    ] as const;

    await Promise.all(
      endpoints.map(async ([url, key]) => {
        try {
          const res = await fetch(url);
          const json = await res.json();
          const count =
            json.total ?? json.count ??
            (json.posts?.length ?? json.courses?.length ?? json.faqs?.length ??
             json.testimonials?.length ?? json.items?.length ?? json.files?.length ?? 0);
          setStats((prev) => ({ ...prev, [key]: count }));
        } catch {
          setStats((prev) => ({ ...prev, [key]: 0 }));
        }
      })
    );
  }, []);

  const fetchRecentPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/posts?limit=5');
      const json = await res.json();
      setRecentPosts(json.posts ?? []);
    } catch {
      setRecentPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchRecentPosts();
  }, [fetchStats, fetchRecentPosts]);

  return (
    <div className="cms-dash">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="cms-dash-header">
        <div className="cms-dash-title">Content Dashboard</div>
        <div className="cms-dash-sub">Manage all site content from one place.</div>
      </div>

      <div className="cms-stat-grid">
        {STAT_ITEMS.map((item) => (
          <div
            key={item.key}
            className="cms-stat-card"
            onClick={() => router.push(item.href)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push(item.href)}
          >
            <div className="cms-stat-label">
              <span className="cms-stat-dot" style={{ background: item.color }} />
              {item.label}
            </div>
            <div className={`cms-stat-value${stats[item.key] === null ? ' loading' : ''}`}>
              {stats[item.key] !== null ? stats[item.key] : ''}
            </div>
          </div>
        ))}
      </div>

      <div className="cms-panel">
        <div className="cms-panel-head">
          <div className="cms-panel-head-title">Recent Posts</div>
          <button
            style={{ background: 'none', border: 'none', color: '#59A392', fontSize: 12, cursor: 'pointer' }}
            onClick={() => router.push('/cms/posts')}
          >
            View all
          </button>
        </div>
        {loadingPosts ? (
          <div className="cms-table-empty">Loading...</div>
        ) : recentPosts.length === 0 ? (
          <div className="cms-table-empty">No posts yet. Create your first post.</div>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Division</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((post) => (
                <tr
                  key={post.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push('/cms/posts')}
                >
                  <td style={{ fontWeight: 500, color: '#E2E8F0', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </td>
                  <td><DivisionBadge division={post.division ?? 'parent'} /></td>
                  <td><StatusBadge status={post.status} /></td>
                  <td style={{ color: '#6B7B9E' }}>{formatDate(post.published_at ?? post.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <div className="cms-section-title">Quick Create</div>
        <div className="cms-quick-create">
          {QUICK_CREATE.map((item) => (
            <button
              key={item.label}
              className="cms-qc-btn"
              onClick={() => router.push(item.href)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
