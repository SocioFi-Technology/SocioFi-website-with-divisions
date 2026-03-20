import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Analytics — SocioFi Admin' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
