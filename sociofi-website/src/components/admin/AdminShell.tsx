'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Inbox, Users, Clock, Bot, CheckCircle, History,
  FileText, Newspaper, Image, Calendar, Mail, Ticket, Rocket,
  BarChart, Shield, Settings, ChevronRight, ChevronDown,
  Bell, Search, LogOut, Menu, X,
} from 'lucide-react'
import { AuthProvider, useAuth } from '@/lib/admin/auth-context'

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = 260
const SIDEBAR_COLLAPSED = 64

// ─── Nav config ───────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
  badgeColor?: string
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard',   href: '/admin',              icon: LayoutDashboard },
      { label: 'Submissions', href: '/admin/submissions',  icon: Inbox,       badge: 12, badgeColor: '#59A392' },
      { label: 'Contacts',    href: '/admin/contacts',     icon: Users },
      { label: 'Activity',    href: '/admin/activity',     icon: Clock },
    ],
  },
  {
    title: 'NEXUS AGENTS',
    items: [
      { label: 'Agent Control',   href: '/admin/agents',        icon: Bot },
      { label: 'Approval Queue',  href: '/admin/agents/queue',  icon: CheckCircle, badge: 4, badgeColor: '#E8B84D' },
      { label: 'Agent Runs',      href: '/admin/agents/runs',   icon: History },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { label: 'All Content',       href: '/admin/content',                icon: FileText },
      { label: 'Blog Posts',        href: '/admin/content/posts',          icon: Newspaper },
      { label: 'Media Library',     href: '/admin/content/media',          icon: Image },
      { label: 'Content Calendar',  href: '/admin/content/calendar',       icon: Calendar },
      { label: 'Newsletter',        href: '/admin/content/newsletter',     icon: Mail },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Tickets',     href: '/admin/tickets',      icon: Ticket,  badge: 7, badgeColor: '#E8916F' },
      { label: 'Deployments', href: '/admin/deployments',  icon: Rocket },
      { label: 'Analytics',   href: '/admin/analytics',    icon: BarChart },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Team',     href: '/admin/team',     icon: Shield },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

const DIVISIONS = [
  { label: 'Studio',   href: '/admin/divisions/studio',   color: '#72C4B2' },
  { label: 'Agents',   href: '/admin/divisions/agents',   color: '#7B6FE8' },
  { label: 'Services', href: '/admin/divisions/services', color: '#4DBFA8' },
  { label: 'Cloud',    href: '/admin/divisions/cloud',    color: '#5BB5E0' },
  { label: 'Academy',  href: '/admin/divisions/academy',  color: '#E8B84D' },
  { label: 'Ventures', href: '/admin/divisions/ventures', color: '#6BA3E8' },
  { label: 'Labs',     href: '/admin/divisions/labs',     color: '#A78BFA' },
  { label: 'Products', href: '/admin/divisions/products', color: '#E8916F' },
]

const NOTIFICATIONS = [
  { id: 1, text: 'INTAKE classified new lead: Sarah Chen (Studio/Rescue)', time: '2 min ago', href: '/admin/submissions' },
  { id: 2, text: 'HERALD drafted welcome email — pending approval', time: '5 min ago', href: '/admin/agents/queue' },
  { id: 3, text: 'SENTINEL: SLA approaching for ticket #45', time: '15 min ago', href: '/admin/tickets' },
  { id: 4, text: 'New contact form submission from Marcus Webb', time: '34 min ago', href: '/admin/contacts' },
  { id: 5, text: 'Blog post "AI Development Pipeline" needs review', time: '1 hr ago', href: '/admin/content/posts' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/submissions': 'Submissions',
    '/admin/contacts': 'Contacts',
    '/admin/activity': 'Activity',
    '/admin/agents': 'Agent Control',
    '/admin/agents/queue': 'Approval Queue',
    '/admin/agents/runs': 'Agent Runs',
    '/admin/content': 'All Content',
    '/admin/content/posts': 'Blog Posts',
    '/admin/content/media': 'Media Library',
    '/admin/content/calendar': 'Content Calendar',
    '/admin/content/newsletter': 'Newsletter',
    '/admin/tickets': 'Tickets',
    '/admin/deployments': 'Deployments',
    '/admin/analytics': 'Analytics',
    '/admin/team': 'Team',
    '/admin/settings': 'Settings',
    '/admin/pipeline': 'Pipeline',
    '/admin/services/tickets': 'Service Tickets',
    '/admin/ventures/applications': 'Ventures Applications',
  }
  if (map[pathname]) return map[pathname]
  const divMatch = pathname.match(/^\/admin\/divisions\/(\w+)$/)
  if (divMatch) return divMatch[1].charAt(0).toUpperCase() + divMatch[1].slice(1) + ' Division'
  return 'Admin'
}

// ─── NavLink component ────────────────────────────────────────────────────────

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: NavItem
  collapsed: boolean
  active: boolean
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '10px 0' : '8px 18px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '10px',
        textDecoration: 'none',
        background: active ? 'rgba(89,163,146,0.08)' : 'transparent',
        borderLeft: active ? '3px solid #59A392' : '3px solid transparent',
        color: active ? '#59A392' : '#94A3B8',
        fontSize: '0.84rem',
        fontFamily: "'Outfit', sans-serif",
        transition: 'all 0.15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent'
      }}
    >
      <Icon size={16} style={{ flexShrink: 0 }} />
      {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>}
      {!collapsed && item.badge != null && (
        <span
          style={{
            background: item.badgeColor ?? '#59A392',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '1px 7px',
            borderRadius: '100px',
            minWidth: '20px',
            textAlign: 'center',
          }}
        >
          {item.badge}
        </span>
      )}
    </Link>
  )
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [divisionsOpen, setDivisionsOpen] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Cmd+K / Esc listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((p) => !p)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotifOpen(false)
        setUserDropOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50)
  }, [searchOpen])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const sidebarW = isMobile ? SIDEBAR_WIDTH : collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH

  // Login page — render children only, no chrome
  if (pathname === '/admin/login') return <>{children}</>

  return (
    <>
      {/* ── Sidebar ───────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: isMobile
            ? mobileSidebarOpen ? 0 : -SIDEBAR_WIDTH
            : 0,
          width: `${sidebarW}px`,
          height: '100vh',
          background: '#0F1320',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          transition: isMobile
            ? 'left 0.25s cubic-bezier(0.16,1,0.3,1)'
            : 'width 0.25s cubic-bezier(0.16,1,0.3,1)',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        {/* Logo row */}
        <div
          style={{
            height: '64px',
            minHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            gap: '10px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
              <path d="M8 20L20 8L32 20" stroke="#59A392" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 28L20 16L32 28" stroke="#3A589E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {(!collapsed || isMobile) && (
              <div>
                <div style={{ color: '#E2E8F0', fontSize: '0.95rem', fontWeight: 700, lineHeight: 1, fontFamily: "'Syne', sans-serif" }}>
                  SocioFi
                </div>
                <div style={{ color: '#64748B', fontSize: '0.6rem', fontFamily: "'Fira Code', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>
                  Admin
                </div>
              </div>
            )}
          </div>
          {(!collapsed || isMobile) && (
            <button
              onClick={() => isMobile ? setMobileSidebarOpen(false) : setCollapsed(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px', display: 'flex' }}
              aria-label="Collapse sidebar"
            >
              {isMobile ? <X size={16} /> : <Menu size={16} />}
            </button>
          )}
        </div>

        {/* Expand button when collapsed (desktop only) */}
        {collapsed && !isMobile && (
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            style={{
              margin: '12px auto',
              width: '36px',
              height: '36px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronRight size={14} />
          </button>
        )}

        {/* User block */}
        {(!collapsed || isMobile) && user && (
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3A589E, #59A392)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '0.8rem',
                color: 'white',
                fontWeight: 700,
              }}
            >
              {user.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  color: '#E2E8F0',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  color: '#59A392',
                  fontSize: '0.65rem',
                  fontFamily: "'Fira Code', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {user.role?.replace('_', ' ')}
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.title} style={{ marginBottom: '4px' }}>
              {(!collapsed || isMobile) && (
                <div
                  style={{
                    padding: '12px 20px 6px',
                    color: '#64748B',
                    fontSize: '0.62rem',
                    fontFamily: "'Fira Code', monospace",
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {group.title}
                </div>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed && !isMobile}
                  active={isActive(item.href)}
                />
              ))}
            </div>
          ))}

          {/* Divisions group */}
          <div style={{ marginBottom: '4px' }}>
            {(!collapsed || isMobile) && (
              <button
                onClick={() => setDivisionsOpen((p) => !p)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 20px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#64748B',
                  fontSize: '0.62rem',
                  fontFamily: "'Fira Code', monospace",
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <span>DIVISIONS</span>
                {divisionsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
            )}
            {(divisionsOpen || (collapsed && !isMobile)) &&
              DIVISIONS.map((div) => (
                <Link
                  key={div.href}
                  href={div.href}
                  title={collapsed && !isMobile ? div.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: collapsed && !isMobile ? '10px 0' : '7px 18px',
                    justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                    gap: '10px',
                    textDecoration: 'none',
                    background: isActive(div.href) ? 'rgba(89,163,146,0.08)' : 'transparent',
                    borderLeft: isActive(div.href) ? `3px solid ${div.color}` : '3px solid transparent',
                    transition: 'all 0.15s',
                    color: isActive(div.href) ? div.color : '#94A3B8',
                    fontSize: '0.82rem',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: div.color,
                      flexShrink: 0,
                      boxShadow: `0 0 6px ${div.color}60`,
                    }}
                  />
                  {(!collapsed || isMobile) && div.label}
                </Link>
              ))}
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      {isMobile && mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 999,
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Main area ─────────────────────────────────────── */}
      <div
        style={{
          marginLeft: isMobile ? 0 : `${sidebarW}px`,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.25s cubic-bezier(0.16,1,0.3,1)',
          background: '#0A0E1A',
        }}
      >
        {/* Topbar */}
        <div
          style={{
            height: '64px',
            minHeight: '64px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: '12px',
            background: 'rgba(10,14,26,0.95)',
            backdropFilter: 'blur(16px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileSidebarOpen((p) => !p)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                display: 'flex',
                padding: '6px',
              }}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Page title */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: '#E2E8F0',
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                lineHeight: 1,
              }}
            >
              {getPageTitle(pathname)}
            </div>
          </div>

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              color: '#64748B',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
            }}
            aria-label="Open search"
          >
            <Search size={14} />
            {!isMobile && <span>Search</span>}
            {!isMobile && (
              <span
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                ⌘K
              </span>
            )}
          </button>

          {/* Notification bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifOpen((p) => !p)}
              style={{
                position: 'relative',
                background: notifOpen ? 'rgba(89,163,146,0.08)' : 'none',
                border: 'none',
                cursor: 'pointer',
                color: notifOpen ? '#59A392' : '#94A3B8',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                transition: 'all 0.15s',
              }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '16px',
                  height: '16px',
                  background: '#E8916F',
                  borderRadius: '50%',
                  fontSize: '0.6rem',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {NOTIFICATIONS.length}
              </span>
            </button>

            {notifOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '360px',
                  background: '#12162A',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  zIndex: 200,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 600 }}>
                    Notifications
                  </span>
                  <span style={{ color: '#59A392', fontSize: '0.75rem', cursor: 'pointer' }}>
                    Mark all read
                  </span>
                </div>
                {NOTIFICATIONS.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => setNotifOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      textDecoration: 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ color: '#E2E8F0', fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '4px' }}>
                      {n.text}
                    </div>
                    <div style={{ color: '#64748B', fontSize: '0.72rem' }}>{n.time}</div>
                  </Link>
                ))}
                <Link
                  href="/admin/activity"
                  onClick={() => setNotifOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: '#59A392',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                  }}
                >
                  View all notifications →
                </Link>
              </div>
            )}
          </div>

          {/* User dropdown */}
          <div ref={userRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setUserDropOpen((p) => !p)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: userDropOpen ? 'rgba(255,255,255,0.06)' : 'none',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                color: '#E2E8F0',
                transition: 'all 0.15s',
              }}
              aria-label="User menu"
              aria-expanded={userDropOpen}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3A589E, #59A392)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                {user?.name?.[0]?.toUpperCase() ?? 'A'}
              </div>
              {!isMobile && <ChevronDown size={14} color="#64748B" />}
            </button>

            {userDropOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '220px',
                  background: '#12162A',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  zIndex: 200,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 600 }}>
                    {user?.name ?? 'Admin'}
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '2px' }}>
                    {user?.email}
                  </div>
                  <div
                    style={{
                      color: '#59A392',
                      fontSize: '0.65rem',
                      fontFamily: "'Fira Code', monospace",
                      textTransform: 'uppercase',
                      marginTop: '4px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {user?.role?.replace('_', ' ')}
                  </div>
                </div>
                <Link
                  href="/admin/settings"
                  onClick={() => setUserDropOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    color: '#94A3B8',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Settings size={14} /> Settings
                </Link>
                <button
                  onClick={signOut}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    color: '#EF4444',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      {/* ── Search Modal ──────────────────────────────────── */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '15vh',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false)
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              margin: '0 16px',
              background: '#12162A',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                gap: '12px',
              }}
            >
              <Search size={18} color="#64748B" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search submissions, content, tickets…"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#E2E8F0',
                  fontSize: '0.95rem',
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '8px 0', maxHeight: '400px', overflowY: 'auto' }}>
              {searchQuery === '' ? (
                <>
                  <div
                    style={{
                      padding: '8px 20px',
                      color: '#64748B',
                      fontSize: '0.7rem',
                      fontFamily: "'Fira Code', monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    Quick Links
                  </div>
                  {[
                    { label: 'Dashboard',    href: '/admin',              Icon: LayoutDashboard },
                    { label: 'Submissions',  href: '/admin/submissions',  Icon: Inbox },
                    { label: 'Agent Queue',  href: '/admin/agents/queue', Icon: CheckCircle },
                    { label: 'Blog Posts',   href: '/admin/content/posts',Icon: Newspaper },
                    { label: 'Tickets',      href: '/admin/tickets',      Icon: Ticket },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        color: '#94A3B8',
                        fontSize: '0.85rem',
                        transition: 'background 0.1s',
                        fontFamily: "'Outfit', sans-serif",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <item.Icon size={16} color="#64748B" />
                      {item.label}
                    </Link>
                  ))}
                </>
              ) : (
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  No results for &quot;{searchQuery}&quot; — live search coming soon.
                </div>
              )}
            </div>
            <div
              style={{
                padding: '10px 20px',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                gap: '16px',
              }}
            >
              {['↑↓ navigate', '↵ select', 'esc close'].map((hint) => (
                <span
                  key={hint}
                  style={{
                    color: '#64748B',
                    fontSize: '0.72rem',
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  {hint}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Export with AuthProvider ─────────────────────────────────────────────────

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Shell>{children}</Shell>
    </AuthProvider>
  )
}
