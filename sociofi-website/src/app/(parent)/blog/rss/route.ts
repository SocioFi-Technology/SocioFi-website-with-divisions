import { getAllPosts, CATEGORY_CONFIG } from '@/lib/blog';

const SITE_URL = 'https://sociofi.tech';

export async function GET() {
  const posts = getAllPosts();

  function escapeXml(str: string) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  const items = posts
    .map((post) => {
      const category = CATEGORY_CONFIG[post.category];
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}${post.canonicalUrl}</link>
      <guid isPermaLink="true">${SITE_URL}${post.canonicalUrl}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>${escapeXml(post.author.name)}</author>
      <category>${escapeXml(category.label)}</category>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`.trim();
    })
    .join('\n    ');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SocioFi Technology Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss" rel="self" type="application/rss+xml" />
    <description>Ideas, research, and hard-won lessons from the SocioFi Technology team.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
