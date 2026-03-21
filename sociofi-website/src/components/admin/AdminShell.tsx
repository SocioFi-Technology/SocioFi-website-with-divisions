'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminProvider, useAdmin } from './AdminContext';
import { createClient } from '@/lib/supabase/client';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --adm-bg: #0C0C1D;
    --adm-bg2: #111128;
    --adm-sidebar: #0F0F24;
    --adm-border: rgba(89,163,146,0.08);
    --adm-border-hover: rgba(89,163,146,0.18);
    --adm-text: #E2E8F0;
    --adm-muted: #6B7B9E;
    --adm-accent: #3A589E;
    --adm-teal: #59A392;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .adm-root {
    display: flex;
    min-height: 100vh;
    background: var(--adm-bg);
    color: var(--adm-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
  }

  /* ── Sidebar ── */
  .adm-sidebar {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: 240px;
    background: var(--adm-sidebar);
    border-right: 1px solid var(--adm-border);
    display: flex;
    flex-direction: column;
    z-index: 200;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .adm-sidebar.closed { transform: translateX(-100%); }

  .adm-sidebar-header {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--adm-border);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .adm-logo-mark {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #3A589E, #59A392);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .adm-logo-text {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 15px;
    color: var(--adm-text);
    letter-spacing: -0.02em;
  }
  .adm-logo-text span {
    color: var(--adm-muted);
    font-weight: 500;
    font-size: 13px;
    margin-left: 4px;
  }

  .adm-user-section {
    padding: 14px 20px;
    border-bottom: 1px solid var(--adm-border);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .adm-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, #3A589E, #59A392);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 12px;
    color: white; flex-shrink: 0;
    overflow: hidden;
  }
  .adm-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .adm-user-info { flex: 1; min-width: 0; }
  .adm-user-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 600; font-size: 13px;
    color: var(--adm-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .adm-role-badge {
    font-size: 10px; font-weight: 500;
    color: var(--adm-teal);
    text-transform: uppercase; letter-spacing: 0.06em;
    font-family: 'JetBrains Mono', monospace;
  }

  .adm-nav { flex: 1; overflow-y: auto; padding: 10px 0; }
  .adm-nav::-webkit-scrollbar { width: 3px; }
  .adm-nav::-webkit-scrollbar-track { background: transparent; }
  .adm-nav::-webkit-scrollbar-thumb { background: var(--adm-border); border-radius: 2px; }

  .adm-nav-group-label {
    font-size: 10px; font-weight: 600;
    color: var(--adm-muted);
    text-transform: uppercase; letter-spacing: 0.1em;
    padding: 14px 20px 6px;
    font-family: 'JetBrains Mono', monospace;
  }

  .adm-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 20px;
    color: var(--adm-muted);
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    border: none; background: none; width: 100%; text-align: left;
    transition: color 0.2s, background 0.2s;
    position: relative;
  }
  .adm-nav-item:hover {
    color: var(--adm-text);
    background: rgba(89,163,146,0.04);
  }
  .adm-nav-item.active {
    color: var(--adm-text);
    background: rgba(58,88,158,0.12);
  }
  .adm-nav-item.active::before {
    content: '';
    position: absolute; left: 0; top: 4px; bottom: 4px;
    width: 2px; border-radius: 0 2px 2px 0;
    background: var(--adm-accent);
  }
  .adm-nav-item svg {
    flex-shrink: 0;
    opacity: 0.7;
  }
  .adm-nav-item.active svg, .adm-nav-item:hover svg { opacity: 1; }

  .adm-div-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }

  /* ── Main Area ── */
  .adm-main {
    flex: 1;
    margin-left: 240px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: margin-left 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .adm-main.full { margin-left: 0; }

  /* ── Top Bar ── */
  .adm-topbar {
    position: sticky; top: 0; z-index: 100;
    height: 56px;
    background: rgba(12,12,29,0.9);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--adm-border);
    display: flex; align-items: center;
    padding: 0 24px;
    gap: 16px;
  }
  .adm-hamburger {
    display: none;
    width: 36px; height: 36px;
    background: none; border: none;
    color: var(--adm-muted); cursor: pointer;
    align-items: center; justify-content: center;
    border-radius: 8px;
    transition: background 0.2s, color 0.2s;
  }
  .adm-hamburger:hover { background: rgba(255,255,255,0.05); color: var(--adm-text); }

  .adm-page-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 15px;
    color: var(--adm-text);
    flex: 1;
  }

  .adm-topbar-actions {
    display: flex; align-items: center; gap: 8px;
  }
  .adm-icon-btn {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: none; border: none; cursor: pointer;
    color: var(--adm-muted); border-radius: 8px;
    transition: background 0.2s, color 0.2s; position: relative;
  }
  .adm-icon-btn:hover { background: rgba(255,255,255,0.05); color: var(--adm-text); }
  .adm-badge {
    position: absolute; top: 5px; right: 5px;
    width: 16px; height: 16px; border-radius: 50%;
    background: #E8916F;
    font-size: 10px; font-weight: 700; color: white;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Manrope', sans-serif;
  }

  .adm-user-menu {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 8px 4px 4px;
    background: none; border: 1px solid var(--adm-border);
    border-radius: 100px; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .adm-user-menu:hover { border-color: var(--adm-border-hover); background: rgba(255,255,255,0.03); }
  .adm-user-menu-name {
    font-size: 13px; font-weight: 500;
    color: var(--adm-text);
  }

  /* ── Content ── */
  .adm-content {
    flex: 1;
    padding: 28px 28px 48px;
  }

  /* ── Dropdown ── */
  .adm-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    width: 180px;
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 12px;
    overflow: hidden;
    z-index: 500;
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }
  .adm-dropdown-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    color: var(--adm-muted); font-size: 13px;
    cursor: pointer; border: none; background: none; width: 100%; text-align: left;
    transition: background 0.15s, color 0.15s;
  }
  .adm-dropdown-item:hover { background: rgba(255,255,255,0.04); color: var(--adm-text); }
  .adm-dropdown-item.danger { color: #F87171; }
  .adm-dropdown-item.danger:hover { background: rgba(248,113,113,0.08); color: #FCA5A5; }
  .adm-dropdown-sep { height: 1px; background: var(--adm-border); margin: 4px 0; }

  /* ── Mobile ── */
  .adm-overlay {
    display: none;
    position: fixed; inset: 0; z-index: 150;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
  }
  @media (max-width: 768px) {
    .adm-sidebar { transform: translateX(-100%); }
    .adm-sidebar.open { transform: translateX(0); }
    .adm-main { margin-left: 0; }
    .adm-hamburger { display: flex; }
    .adm-overlay.open { display: block; }
    .adm-user-menu-name { display: none; }
    .adm-content { padding: 20px 16px 40px; }
  }
`;

const NAV_ITEMS = [
  { group: 'OVERVIEW', items: [
    { label: 'Dashboard', href: '/admin', icon: 'grid' },
  ]},
  { group: 'CRM', items: [
    { label: 'Submissions', href: '/admin/submissions',  icon: 'inbox' },
    { label: 'Contacts',    href: '/admin/contacts',     icon: 'users' },
    { label: 'Pipeline',    href: '/admin/pipeline',     icon: 'pipeline' },
  ]},
  { group: 'SERVICES', items: [
    { label: 'Tickets', href: '/admin/services/tickets', icon: 'ticket' },
  ]},
  { group: 'VENTURES', items: [
    { label: 'Applications', href: '/admin/ventures/applications', icon: 'rocket' },
  ]},
  { group: 'CONTENT', items: [
    { label: 'Posts & FAQs', href: '/admin/content', icon: 'file' },
  ]},
  { group: 'REPORTING', items: [
    { label: 'Analytics', href: '/admin/analytics', icon: 'chart' },
  ]},
  { group: 'SYSTEM', items: [
    { label: 'Team',     href: '/admin/team',     icon: 'people' },
    { label: 'Settings', href: '/admin/settings', icon: 'gear' },
  ]},
];

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactElement> = {
    grid: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    inbox: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      </svg>
    ),
    users: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    clock: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    file: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <polyline points="13 2 13 9 20 9"/>
      </svg>
    ),
    book: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    quote: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
      </svg>
    ),
    help: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    chart: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
    people: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    gear: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    bell: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    logout: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    person: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    pipeline: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12H2"/><path d="M5 6l-3 6 3 6"/><path d="M19 6l3 6-3 6"/>
      </svg>
    ),
    ticket: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
      </svg>
    ),
    rocket: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
    menu: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    ),
    x: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
  };
  return icons[name] ?? null;
}

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/submissions': 'Submissions',
    '/admin/contacts': 'Contacts',
    '/admin/activity': 'Activity',
    '/admin/pipeline': 'Pipeline',
    '/admin/services/tickets': 'Tickets',
    '/admin/ventures/applications': 'Ventures Applications',
    '/admin/content': 'Posts & FAQs',
    '/admin/content/blog': 'Blog Posts',
    '/admin/content/testimonials': 'Testimonials',
    '/admin/content/faq': 'FAQ',
    '/admin/analytics': 'Analytics',
    '/admin/team': 'Team',
    '/admin/settings': 'Settings',
  };
  if (map[pathname]) return map[pathname];
  const divMatch = pathname.match(/^\/admin\/divisions\/(\w+)$/);
  if (divMatch) return divMatch[1].charAt(0).toUpperCase() + divMatch[1].slice(1) + ' Division';
  return 'Admin';
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: (href: string) => void;
}) {
  const { user } = useAdmin();
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <>
      <div className="adm-sidebar-header">
        <div className="adm-logo-mark" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 8l8-6 8 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 14l8-6 8 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 20l8-6 8 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="adm-logo-text">SocioFi <span>Admin</span></div>
      </div>

      <div className="adm-user-section">
        <div className="adm-avatar">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} />
          ) : (
            initials
          )}
        </div>
        <div className="adm-user-info">
          <div className="adm-user-name">{user?.name ?? 'Loading...'}</div>
          <div className="adm-role-badge">{user?.role?.replace('_', ' ') ?? ''}</div>
        </div>
      </div>

      <nav className="adm-nav" aria-label="Admin navigation">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            <div className="adm-nav-group-label">{group.group}</div>
            {group.items.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <button
                  key={item.href}
                  className={`adm-nav-item${isActive ? ' active' : ''}`}
                  onClick={() => onNavigate(item.href)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {'dot' in item ? (
                    <span
                      className="adm-div-dot"
                      style={{ background: (item as { dot: string }).dot }}
                      aria-hidden="true"
                    />
                  ) : (
                    <Icon name={item.icon} />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}

function TopBar({
  pathname,
  onToggleSidebar,
}: {
  pathname: string;
  onToggleSidebar: () => void;
}) {
  const { user } = useAdmin();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const title = getPageTitle(pathname);
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.adm-user-menu-wrap')) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header className="adm-topbar">
      <button
        className="adm-hamburger"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Icon name="menu" />
      </button>
      <h1 className="adm-page-title">{title}</h1>
      <div className="adm-topbar-actions">
        <button className="adm-icon-btn" aria-label="Notifications">
          <Icon name="bell" />
          <span className="adm-badge" aria-label="5 notifications">5</span>
        </button>
        <div style={{ position: 'relative' }} className="adm-user-menu-wrap">
          <button
            className="adm-user-menu"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            <div className="adm-avatar" style={{ width: 26, height: 26, fontSize: 10 }}>
              {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} /> : initials}
            </div>
            <span className="adm-user-menu-name">{user?.name ?? '...'}</span>
          </button>
          {dropdownOpen && (
            <div className="adm-dropdown" role="menu">
              <button
                className="adm-dropdown-item"
                role="menuitem"
                onClick={() => { setDropdownOpen(false); router.push('/admin/team'); }}
              >
                <Icon name="person" /> Profile
              </button>
              <button
                className="adm-dropdown-item"
                role="menuitem"
                onClick={() => { setDropdownOpen(false); router.push('/admin/settings'); }}
              >
                <Icon name="gear" /> Settings
              </button>
              <div className="adm-dropdown-sep" />
              <button
                className="adm-dropdown-item danger"
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

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
  };

  return (
    <div className="adm-root">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <aside
        className={`adm-sidebar${sidebarOpen ? ' open' : ''}`}
        aria-label="Admin sidebar"
      >
        <SidebarContent pathname={pathname} onNavigate={handleNavigate} />
      </aside>
      <div
        className={`adm-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <div className="adm-main">
        <TopBar pathname={pathname} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="adm-content">{children}</main>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <Shell>{children}</Shell>
    </AdminProvider>
  );
}
