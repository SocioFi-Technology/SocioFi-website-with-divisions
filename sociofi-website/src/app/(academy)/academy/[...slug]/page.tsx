import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    ?.map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' — ') ?? 'Academy';
  return {
    title: `${title} — SocioFi Academy`,
    description: 'Learn to build, launch, and maintain production software. SocioFi Academy offers courses, workshops, and certification programs.',
  };
}

export default async function AcademyPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <main><h1>Academy: {slug?.join('/')}</h1></main>;
}
