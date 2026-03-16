import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    ?.map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' — ') ?? 'Ventures';
  return {
    title: `${title} — SocioFi Ventures`,
    description: 'SocioFi Ventures partners with early-stage startups. We build, launch, and grow your product in exchange for equity, revenue share, or a hybrid arrangement.',
  };
}

export default async function VenturesPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <main><h1>Ventures: {slug?.join('/')}</h1></main>;
}
