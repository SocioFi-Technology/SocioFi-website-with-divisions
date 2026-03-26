'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabaseClient, signOut } from '@/lib/supabase'

const NAV_SECTIONS = [
  {
    label: 'CONTENT',
    items: [
      { label: 'Dashboard', href: '/', icon: DashIcon },
      { label: 'Blog Posts', href: '/blog', icon: PostIcon },
      { label: 'Portfolio', href: '/studio/portfolio', icon: PortfolioIcon },
      { label: 'Testimonials', href: '/testimonials', icon: QuoteIcon },
      { label: 'FAQs', href: '/faqs', icon: FAQIcon },
      { label: 'Media Library', href: '/media', icon: MediaIcon },
    ],
  },
  {
    label: 'DIVISIONS',
    items: [
      { label: 'Studio', href: '/studio', icon: StudioIcon, accent: '#72C4B2' },
      { label: 'Services', href: '/services', icon: ServicesIcon, accent: '#4DBFA8' },
      { label: 'Labs', href: '/labs', icon: LabsIcon, accent: '#7B6FE8' },
      { label: 'Academy', href: '/academy', icon: AcademyIcon, accent: '#E8B84D' },
      { label: 'Ventures', href: '/ventures', icon: VenturesIcon, accent: '#6BA3E8' },
      { label: 'Cloud', href: '/cloud', icon: CloudIcon, accent: '#5BB5E0' },
      { label: 'Products', href: '/products', icon: ProductsIcon, accent: '#E8916F' },
    ],
  },
]

export default function CMSShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      } else if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        router.push('/login')
      }
    })
  }, [router])

  async function handleSignOut() {
    setLoggingOut(true)
    await signOut()
    router.push('/login')
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarCollapsed ? '64px' : '240px',
        background: 'var(--bg-2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.3s var(--ease)',
        overflow: 'hidden',
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minHeight: '64px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--gradient-brand)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 3L18 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 15L12 9L18 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
            </svg>
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}>
                SocioFi
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--teal)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                CMS
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '6px',
              transition: 'color 0.2s',
            }}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarCollapsed ? (
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
              ) : (
                <path d="M11 5l-7 7 7 7M19 5l-7 7 7 7"/>
              )}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.label} style={{ marginBottom: '24px' }}>
              {!sidebarCollapsed && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0 8px',
                  marginBottom: '6px',
                }}>
                  {section.label}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {section.items.map(item => {
                  const active = isActive(item.href)
                  const accent = 'accent' in item ? item.accent : 'var(--teal)'
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={sidebarCollapsed ? item.label : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: sidebarCollapsed ? '10px' : '9px 10px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        background: active ? `${accent}18` : 'transparent',
                        borderLeft: active ? `2px solid ${accent}` : '2px solid transparent',
                        color: active ? (accent as string) : 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        fontFamily: 'var(--font-body)',
                        fontWeight: active ? 500 : 400,
                        transition: 'all 0.2s',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                    >
                      <Icon size={16} color="currentColor" />
                      {!sidebarCollapsed && item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{
          padding: '12px 8px',
          borderTop: '1px solid var(--border)',
        }}>
          {!sidebarCollapsed && user?.email && (
            <div style={{
              padding: '8px 10px',
              marginBottom: '4px',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user.email}
            </div>
          )}
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '9px 10px',
              borderRadius: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            }}
            title="Sign out"
          >
            <LogoutIcon size={16} color="currentColor" />
            {!sidebarCollapsed && (loggingOut ? 'Signing out...' : 'Sign out')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: '64px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          gap: '16px',
          background: 'var(--bg-2)',
          flexShrink: 0,
        }}>
          <div style={{ flex: 1 }}>
            <Breadcrumb pathname={pathname} />
          </div>
          <a
            href="https://sociofitechnology.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              transition: 'all 0.2s',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View Site
          </a>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) {
    return <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Dashboard</span>
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>Dashboard</Link>
      {parts.map((part, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>/</span>
          <span style={{
            fontFamily: i === parts.length - 1 ? 'var(--font-display)' : 'var(--font-body)',
            fontSize: i === parts.length - 1 ? '1rem' : '0.875rem',
            fontWeight: i === parts.length - 1 ? 600 : 400,
            color: i === parts.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)',
            textTransform: 'capitalize',
          }}>
            {part.replace(/-/g, ' ')}
          </span>
        </span>
      ))}
    </div>
  )
}

// Inline SVG Icon components
function DashIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
}
function PostIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}
function QuoteIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  )
}
function FAQIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}
function MediaIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )
}
function PortfolioIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  )
}
function StudioIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  )
}
function ServicesIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
function LabsIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l3 3 3-3V3"/>
    </svg>
  )
}
function AcademyIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )
}
function VenturesIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/>
      <line x1="18" y1="20" x2="18" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  )
}
function CloudIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  )
}
function ProductsIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  )
}
function LogoutIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}
