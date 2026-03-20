import VenturesBlogPostClient from './VenturesBlogPostClient';

export function generateStaticParams() {
  return [{ slug: 'equity-vs-revenue-share' }];
}

export default function VenturesBlogPostPage() {
  return <VenturesBlogPostClient />;
}
