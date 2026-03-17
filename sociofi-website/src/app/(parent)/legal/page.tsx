import type { Metadata } from 'next';
import LegalPageClient from './LegalPageClient';

export const metadata: Metadata = {
  title: 'Legal Documents',
  description: 'Terms of Service and Privacy Policy for SocioFi Technology. Written in plain English — no corporate legalese.',
  alternates: { canonical: '/legal' },
};

export default function LegalPage() {
  return <LegalPageClient />;
}
