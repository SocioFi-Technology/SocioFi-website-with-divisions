'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --cms-bg: #0C0C1D;
    --cms-bg2: #111128;
    --cms-sidebar: #0F0F24;
    --cms-border: rgba(89,163,146,0.08);
    --cms-border-hover: rgba(89,163,146,0.18);
    --cms-text: #E2E8F0;
    --cms-muted: #6B7B9E;
    --cms-accent: #3A589E;
    --cms-teal: #59A392;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cms-root {
    display: flex;
    min-height: 100vh;
    background: var(--cms-bg);
    color: var(--cms-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
  }

  /* ── Sidebar ── */
  .cms-sidebar {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: 240px;
    background: var(--cms-sidebar);
    border-right: 1px solid var(--cms-border);
    display: flex;
    flex-direction: column;
    z-index: 200;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }
  .cms-sidebar.open { transform: translateX(0) !important; }

  .cms-sidebar-header {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--cms-border);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .cms-logo-mark {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #59A392, #3A589E);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cms-logo-text {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 15px;
    color: var(--cms-text);
    letter-spacing: -0.02em;
  }
  .cms-logo-text span {
    color: var(--cms-muted);
    font-weight: 500;
    font-size: 13px;
    margin-left: 4px;
  }

  .cms-nav { flex: 1; overflow-y: auto; padding: 10px 0; }
  .cms-nav::-webkit-scrollbar { width: 3px; }
  .cms-nav::-webkit-scrollbar-track { background: transparent; }
  .cms-nav::-webkit-scrollbar-thumb { background: var(--cms-border); border-radius: 2px; }

  .cms-nav-group-label {
    font-size: 10px; font-weight: 600;
    color: var(--cms-muted);
    text-transform: uppercase; letter-spacing: 0.1em;
    padding: 14px 20px 6px;
    font-family: 'JetBrains Mono', monospace;
  }

  .cms-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 20px;
    color: var(--cms-muted);
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    border: none; background: none; width: 100%; text-align: left;
    transition: color 0.2s, background 0.2s;
    position: relative;
  }
  .cms-nav-item:hover {
    color: var(--cms-text);
    background: rgba(89,163,146,0.04);
  }
  .cms-nav-item.active {
    color: var(--cms-text);
    background: rgba(89,163,146,0.08);
  }
  .cms-nav-item.active::before {
    content: '';
    position: absolute; left: 0; top: 4px; bottom: 4px;
    width: 2px; border-radius: 0 2px 2px 0;
    background: var(--cms-teal);
  }
  .cms-nav-item svg {
    flex-shrink: 0;
    opacity: 0.7;
  }
  .cms-nav-item.active svg, .cms-nav-item:hover svg { opacity: 1; }

  .cms-sidebar-footer {
    padding: 14px 20px;
    border-top: 1px solid var(--cms-border);
    flex-shrink: 0;
  }
  .cms-back-link {
    display: flex; align-items: center; gap: 8px;
    color: var(--cms-muted);
    font-size: 12.5px; font-weight: 500;
    cursor: pointer;
    background: none; border: none; width: 100%;
    text-align: left;
    padding: 6px 0;
    transition: color 0.2s;
  }
  .cms-back-link:hover { color: var(--cms-text); }

  /* ── Main Area ── */
  .cms-main {
    flex: 1;
    margin-left: 240px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: margin-left 0.3s cubic-bezier(0.16,1,0.3,1);
  }

  /* ── Top Bar ── */
  .cms-topbar {
    position: sticky; top: 0; z-index: 100;
    height: 56px;
    background: rgba(12,12,29,0.9);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--cms-border);
    display: flex; align-items: center;
    padding: 0 24px;
    gap: 16px;
  }
  .cms-hamburger {
    display: none;
    width: 36px; height: 36px;
    background: none; border: none;
    color: var(--cms-muted); cursor: pointer;
    align-items: center; justify-content: center;
    border-radius: 8px;
    transition: background 0.2s, color 0.2s;
  }
  .cms-hamburger:hover { background: rgba(255,255,255,0.05); color: var(--cms-text); }

  .cms-page-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 15px;
    color: var(--cms-text);
    flex: 1;
  }

  .cms-topbar-actions {
    display: flex; align-items: center; gap: 8px;
  }
  .cms-icon-btn {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: none; border: none; cursor: pointer;
    color: var(--cms-muted); border-radius: 8px;
    transition: background 0.2s, color 0.2s; position: relative;
  }
  .cms-icon-btn:hover { background: rgba(255,255,255,0.05); color: var(--cms-text); }

  .cms-user-menu {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 8px 4px 4px;
    background: none; border: 1px solid var(--cms-border);
    border-radius: 100px; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .cms-user-menu:hover { border-color: var(--cms-border-hover); background: rgba(255,255,255,0.03); }
  .cms-user-menu-name {
    font-size: 13px; font-weight: 500;
    color: var(--cms-text);
  }
  .cms-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, #59A392, #3A589E);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 10px;
    color: white; flex-shrink: 0;
  }

  /* ── Content ── */
  .cms-content {
    flex: 1;
    padding: 28px 28px 48px;
  }

  /* ── Dropdown ── */
  .cms-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    width: 180px;
    background: var(--cms-bg2);
    border: 1px solid var(--cms-border);
    border-radius: 12px;
    overflow: hidden;
    z-index: 500;
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }
  .cms-dropdown-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    color: var(--cms-muted); font-size: 13px;
    cursor: pointer; border: none; background: none; width: 100%; text-align: left;
    transition: background 0.15s, color 0.15s;
  }
  .cms-dropdown-item:hover { background: rgba(255,255,255,0.04); color: var(--cms-text); }
  .cms-dropdown-item.danger { color: #F87171; }
  .cms-dropdown-item.danger:hover { background: rgba(248,113,113,0.08); color: #FCA5A5; }
  .cms-dropdown-sep { height: 1px; background: var(--cms-border); margin: 4px 0; }

  /* ── Mobile ── */
  .cms-overlay {
    display: none;
    position: fixed; inset: 0; z-index: 150;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
  }
  @media (max-width: 768px) {
    .cms-sidebar { transform: translateX(-100%); }
    .cms-main { margin-left: 0; }
    .cms-hamburger { display: flex; }
    .cms-overlay.open { display: block; }
    .cms-user-menu-name { display: none; }
    .cms-content { padding: 20px 16px 40px; }
  }
`;

type NavItem = {
  label: string;
  href: string;
  icon: string;
  divisionParam?: string;
};

const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: 'OVERVIEW',
    items: [{ label: 'Dashboard', href: '/cms', icon: 'grid' }],
  },
  {
    group: 'CONTENT',
    items: [
      { label: 'Blog Posts', href: '/cms/posts', icon: 'file' },
      { label: 'Labs Posts', href: '/cms/posts', icon: 'flask', divisionParam: 'labs' },
      { label: 'Courses', href: '/cms/courses', icon: 'book' },
      { label: 'FAQs', href: '/cms/faqs', icon: 'help' },
      { label: 'Testimonials', href: '/cms/testimonials', icon: 'quote' },
      { label: 'Portfolio', href: '/cms/portfolio', icon: 'layers' },
    ],
  },
  {
    group: 'PRODUCTS',
    items: [{ label: 'Pricing Plans', href: '/cms/pricing', icon: 'tag' }],
  },
  {
    group: 'MEDIA',
    items: [{ label: 'Media Library', href: '/cms/media', icon: 'image' }],
  },
];

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactElement> = {
    grid: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    file: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <polyline points="13 2 13 9 20 9"/>
      </svg>
    ),
    flask: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6M9 3v7l-5 9a1 1 0 0 0 .9 1.5h14.2A1 1 0 0 0 20 19l-5-9V3"/>
      </svg>
    ),
    book: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    help: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    quote: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
      </svg>
    ),
    layers: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    tag: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    image: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    menu: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    ),
    arrowLeft: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      </svg>
    ),
    logout: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    person: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  };
  return icons[name] ?? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );
}

function getPageTitle(pathname: string, searchParams: URLSearchParams): string {
  const division = searchParams.get('division');
  const map: Record<string, string> = {
    '/cms': 'CMS Dashboard',
    '/cms/posts': division === 'labs' ? 'Labs Posts' : 'Blog Posts',
    '/cms/courses': 'Courses',
    '/cms/faqs': 'FAQs',
    '/cms/testimonials': 'Testimonials',
    '/cms/portfolio': 'Portfolio',
    '/cms/pricing': 'Pricing Plans',
    '/cms/media': 'Media Library',
  };
  return map[pathname] ?? 'CMS';
}

function SidebarContent({
  pathname,
  searchParams,
  onNavigate,
}: {
  pathname: string;
  searchParams: URLSearchParams;
  onNavigate: (href: string) => void;
}) {
  const router = useRouter();

  const isActive = (item: NavItem) => {
    if (item.divisionParam) {
      return pathname === item.href && searchParams.get('division') === item.divisionParam;
    }
    if (item.href === '/cms') return pathname === '/cms';
    // For items with no divisionParam, active if pathname matches and no division param that belongs to another item
    if (pathname === item.href) {
      // Check if this path has a divisionParam version that's active
      const hasDivisionVariant = NAV_GROUPS.flatMap(g => g.items).some(
        i => i.href === item.href && i.divisionParam && searchParams.get('division') === i.divisionParam
      );
      return !hasDivisionVariant;
    }
    return false;
  };

  const handleNav = (item: NavItem) => {
    const url = item.divisionParam ? `${item.href}?division=${item.divisionParam}` : item.href;
    onNavigate(url);
  };

  return (
    <>
      <div className="cms-sidebar-header">
        <div className="cms-logo-mark" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 8l8-6 8 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 14l8-6 8 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 20l8-6 8 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="cms-logo-text">SocioFi <span>CMS</span></div>
      </div>

      <nav className="cms-nav" aria-label="CMS navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.group}>
            <div className="cms-nav-group-label">{group.group}</div>
            {group.items.map((item, idx) => {
              const active = isActive(item);
              return (
                <button
                  key={`${item.href}-${item.divisionParam ?? idx}`}
                  className={`cms-nav-item${active ? ' active' : ''}`}
                  onClick={() => handleNav(item)}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="cms-sidebar-footer">
        <button className="cms-back-link" onClick={() => router.push('/admin')}>
          <Icon name="arrowLeft" />
          Back to Admin
        </button>
      </div>
    </>
  );
}

function TopBar({
  pathname,
  searchParams,
  onToggleSidebar,
}: {
  pathname: string;
  searchParams: URLSearchParams;
  onToggleSidebar: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const title = getPageTitle(pathname, searchParams);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'CM';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.cms-user-menu-wrap')) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header className="cms-topbar">
      <button
        className="cms-hamburger"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Icon name="menu" />
      </button>
      <h1 className="cms-page-title">{title}</h1>
      <div className="cms-topbar-actions">
        <div style={{ position: 'relative' }} className="cms-user-menu-wrap">
          <button
            className="cms-user-menu"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            <div className="cms-avatar">{initials}</div>
            <span className="cms-user-menu-name">{userEmail || 'Editor'}</span>
          </button>
          {dropdownOpen && (
            <div className="cms-dropdown" role="menu">
              <button
                className="cms-dropdown-item"
                role="menuitem"
                onClick={() => { setDropdownOpen(false); router.push('/admin'); }}
              >
                <Icon name="person" /> Back to Admin
              </button>
              <div className="cms-dropdown-sep" />
              <button
                className="cms-dropdown-item danger"
                role="menuitem"
                onClick={handleSignOut}
              >
                <Icon name="logout" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function CMSShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
  };

  return (
    <div className="cms-root">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <aside
        className={`cms-sidebar${sidebarOpen ? ' open' : ''}`}
        aria-label="CMS sidebar"
      >
        <SidebarContent
          pathname={pathname}
          searchParams={searchParams}
          onNavigate={handleNavigate}
        />
      </aside>
      <div
        className={`cms-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <div className="cms-main">
        <TopBar
          pathname={pathname}
          searchParams={searchParams}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main className="cms-content">{children}</main>
      </div>
    </div>
  );
}

export default function CMSShell({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div style={{ background: '#0C0C1D', minHeight: '100vh' }} />}>
      <CMSShellInner>{children}</CMSShellInner>
    </React.Suspense>
  );
}
