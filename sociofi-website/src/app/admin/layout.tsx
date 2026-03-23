import type { Metadata } from 'next'
import AdminShell from '@/components/admin/AdminShell'

// Admin panel is fully dynamic — never statically prerendered.
// Prevents Supabase client errors during `next build` when env vars are absent.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin — SocioFi Technology',
  description: 'SocioFi Admin Panel',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0E1A',
        color: '#E2E8F0',
        fontFamily: "'Outfit', sans-serif",
      }}
      data-admin="true"
    >
      <style>{`
        [data-admin="true"] {
          --admin-bg: #0A0E1A;
          --admin-bg2: #0F1320;
          --admin-bg3: #151928;
          --admin-card: #12162A;
          --admin-border: rgba(255,255,255,0.06);
          --admin-text: #E2E8F0;
          --admin-text2: #94A3B8;
          --admin-text3: #64748B;
          --admin-accent: #59A392;
          --studio: #72C4B2;
          --agents: #7B6FE8;
          --services: #4DBFA8;
          --cloud: #5BB5E0;
          --academy: #E8B84D;
          --ventures: #6BA3E8;
          --labs: #A78BFA;
          --products: #E8916F;
        }
      `}</style>
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
