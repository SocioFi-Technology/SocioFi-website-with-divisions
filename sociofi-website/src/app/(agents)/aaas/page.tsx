import type { Metadata } from 'next';
import AaaSPageClient from './AaaSPageClient';

export const metadata: Metadata = {
  title: 'Agent-as-a-Service (AaaS) — SocioFi Agents',
  description:
    'The shift from SaaS to AaaS is here. SocioFi builds the agent systems your business runs on — custom pipelines, real automation, zero human busywork.',
  openGraph: {
    title: 'Agent-as-a-Service (AaaS) — SocioFi Agents',
    description:
      'The shift from SaaS to AaaS is here. SocioFi builds the agent systems your business runs on.',
  },
};

export default function AaaSPage() {
  return <AaaSPageClient />;
}
