import CloudBlogPostClient from './CloudBlogPostClient';

export function generateStaticParams() {
  return [{ slug: 'aws-vs-digitalocean-vs-vercel' }];
}

export default function BlogPostPage() {
  return <CloudBlogPostClient />;
}
