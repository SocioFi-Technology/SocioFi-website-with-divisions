import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import CMSShell from '@/components/cms/CMSShell';

export const metadata: Metadata = {
  title: 'CMS — SocioFi Technology',
  robots: { index: false, follow: false },
};

export default async function CMSLayout({
  children,
}: {
  children: ReactNode;
}) {
  // If Supabase is not configured, allow CMS access without auth
  // (for local development and preview environments)
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (hasSupabase) {
    const { createServerClient } = await import('@supabase/ssr');
    const { cookies } = await import('next/headers');
    const { redirect } = await import('next/navigation');

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect('/admin/login');
  }

  return <CMSShell>{children}</CMSShell>;
}
