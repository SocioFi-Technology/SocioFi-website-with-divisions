import type { Metadata } from 'next';
import { headers } from 'next/headers';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin — SocioFi Technology',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login page lives under /admin/ but must NOT be wrapped in AdminShell.
  // proxy.ts sets x-pathname on the forwarded request so we can detect it here.
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
