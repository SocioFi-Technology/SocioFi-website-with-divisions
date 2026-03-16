import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    ?.map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' — ') ?? 'Labs';
  return {
    title: `${title} — SocioFi Labs`,
    description: 'SocioFi Labs: open-source projects, research, and technical writing from the SocioFi engineering team.',
  };
}

export default async function LabsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <main><h1>Labs: {slug?.join('/')}</h1></main>;
}
