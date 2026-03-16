import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import { divisions } from '@/lib/divisions';

const division = divisions.technology;

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
    </div>
  );
}
