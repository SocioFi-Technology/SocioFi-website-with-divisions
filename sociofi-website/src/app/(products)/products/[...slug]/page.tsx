import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    ?.map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' — ') ?? 'Products';
  return {
    title: `${title} — SocioFi Products`,
    description: 'SocioFi builds standalone software products: FabricxAI, NEXUS ARIA, and DevBridge. Built on the same AI-native stack we use for client projects.',
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <main><h1>Products: {slug?.join('/')}</h1></main>;
}
