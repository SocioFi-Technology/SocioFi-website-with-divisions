import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Tickets — SocioFi Admin' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
