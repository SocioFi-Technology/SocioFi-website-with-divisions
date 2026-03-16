import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import { divisions } from '@/lib/divisions';

const division = divisions.academy;

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
    </div>
  );
}
