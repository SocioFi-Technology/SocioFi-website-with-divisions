'use client'

import { useEffect, useState } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'

export default function AcademyCMSPage() {
  const [stats, setStats] = useState({ courses: 0, workshops: 0 })

  const ACCENT = '#E8B84D'

  useEffect(() => {
    async function fetchStats() {
      const client = getSupabaseClient()
      if (!client) return
      const [{ count: courses }, { count: workshops }] = await Promise.all([
        client.from('cms_courses').select('*', { count: 'exact', head: true }),
        client.from('cms_workshops').select('*', { count: 'exact', head: true }),
      ])
      setStats({ courses: courses ?? 0, workshops: workshops ?? 0 })
    }
    fetchStats()
  }, [])

  const sections = [
    {
      href: '/academy/courses',
      label: 'Courses',
      count: stats.courses,
      description: 'Full courses with modules, lessons, and curriculum management.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      href: '/academy/workshops',
      label: 'Workshops',
      count: stats.workshops,
      description: 'Live sessions, scheduled events, and instructor-led workshops.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
  ]

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Academy</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Academy Content</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 8 }}>Manage courses, workshops, and the SCARL cohort accelerator program.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {sections.map(section => (
            <Link key={section.href} href={section.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = ACCENT + '60'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.transform = 'none' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, #3A589E, ${ACCENT})`, opacity: 0.6 }} />
                <div style={{ color: ACCENT, marginBottom: 14 }}>{section.icon}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{section.label}</h2>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{section.count} items</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{section.description}</p>
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)', fontSize: '0.84rem', fontWeight: 600, color: ACCENT }}>
                  Manage {section.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 36, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>SCARL Cohort Accelerator</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 14px' }}>The cohort program is managed separately. Applications and cohort data are handled in the admin panel.</p>
          <a href="/admin" style={{ fontFamily: 'var(--font-display)', fontSize: '0.84rem', fontWeight: 600, color: ACCENT, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Open Admin Panel
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        </div>
      </div>
    </CMSShell>
  )
}
