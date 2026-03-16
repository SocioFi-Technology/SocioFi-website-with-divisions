import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    ?.map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' — ') ?? 'Services';
  return {
    title: `${title} — SocioFi Services`,
    description: 'Ongoing software maintenance, monitoring, security, and support. SocioFi Services keeps your app running at 99.9% uptime — without needing a full dev team.',
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <main><h1>Services: {slug?.join('/')}</h1></main>;
}
