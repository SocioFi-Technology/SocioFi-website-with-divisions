import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    ?.map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' — ') ?? 'Cloud';
  return {
    title: `${title} — SocioFi Cloud`,
    description: 'Managed cloud hosting for production apps. AWS, DigitalOcean, Hetzner, and Vercel — fully managed by SocioFi\'s infrastructure team.',
  };
}

export default async function CloudPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <main><h1>Cloud: {slug?.join('/')}</h1></main>;
}
