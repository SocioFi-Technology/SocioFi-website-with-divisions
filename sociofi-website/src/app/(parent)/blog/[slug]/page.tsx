import BlogPost, { type BlogPostContent } from '@/templates/BlogPost';
import type { Metadata } from 'next';

// In production this would be fetched from Sanity CMS based on `params.slug`.
// For now we use a representative static placeholder that demonstrates the template.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // TODO: fetch from Sanity
  return {
    title: `Blog — SocioFi Technology`,
    description: 'Read the latest thinking from the SocioFi Technology team.',
  };
}

// Static placeholder — will be replaced by dynamic Sanity fetch
const placeholderContent: BlogPostContent = {
  title: "Why 80% of AI-generated prototypes never make it to production",
  date: 'March 12, 2026',
  author: { name: 'Kamrul Hasan', role: 'CTO, SocioFi Technology' },
  category: 'Engineering',
  readTime: '8 min read',
  lead:
    "AI coding tools have made it possible for non-technical founders to build working prototypes in days. But the gap between 'it works on my machine' and 'it's live and stable' is where most of them get stuck. Here's what that gap actually looks like — and how to close it.",
  related: [
    {
      title: 'The architecture decisions AI gets wrong (and how we fix them)',
      category: 'Engineering',
      date: 'March 8, 2026',
      readTime: '6 min read',
      href: '/blog/architecture-decisions-ai-gets-wrong',
    },
    {
      title: 'How we scope a project in 30 minutes',
      category: 'Product',
      date: 'March 4, 2026',
      readTime: '5 min read',
      href: '/blog/how-we-scope-in-30-minutes',
    },
    {
      title: 'What "managed hosting" actually means for a small product',
      category: 'Engineering',
      date: 'Feb 28, 2026',
      readTime: '7 min read',
      href: '/blog/what-managed-hosting-actually-means',
    },
  ],
  newsletter: {
    headline: 'Get new articles in your inbox',
    description: 'We publish a few times a month. No fluff — just honest writing about building software that works.',
  },
  children: (
    <>
      <p>
        The numbers tell a clear story. Across the projects we've rescued over the past two years, the overwhelming majority were not failures of imagination — the product idea was good, and the prototype genuinely worked. The failure was in the gap between "working in development" and "running in production."
      </p>
      <p>
        That gap is wider than most people realize, and AI coding tools — as remarkable as they are — don't close it. They accelerate the first 80%. The last 20% is where products live or die.
      </p>
      <h2>What the gap actually contains</h2>
      <p>
        When we talk about the "production gap," we're talking about a specific set of problems that AI-generated code reliably underserves:
      </p>
      <ul>
        <li><strong>Environment configuration</strong> — The app works with your local database, your API keys, your machine's Node version. Production is different in dozens of small ways.</li>
        <li><strong>Error handling</strong> — AI tends to write the happy path beautifully. What happens when the third-party API returns a 500? When the database connection drops? When a user sends malformed input?</li>
        <li><strong>Security hardening</strong> — SQL injection, XSS, CSRF, insecure direct object references, exposed secrets in environment variables. AI code reviews don't catch all of these.</li>
        <li><strong>Database migrations</strong> — Changing a schema on a live database with real data is genuinely dangerous. AI doesn't know your data distribution.</li>
        <li><strong>Performance at load</strong> — The app felt fast with five test users. What about five hundred simultaneous requests?</li>
        <li><strong>Observability</strong> — When something breaks in production (and it will), how will you know? What logs do you have? What alerts? Who gets paged?</li>
      </ul>
      <p>
        None of these are exotic. They're the standard concerns that every production application faces. But they require human engineering judgment — the kind that comes from having watched things fail in production before.
      </p>
      <h2>The fix is not to write less AI code</h2>
      <p>
        We want to be clear: we use AI coding agents heavily in our own workflow. They're remarkable at what they do. The answer is not to go back to writing everything by hand — that's slower and not obviously better.
      </p>
      <p>
        The answer is to pair AI velocity with human oversight at the right moments. Our workflow looks like this: AI agents generate the bulk of implementation; our senior engineers review architecture, audit security, handle database changes, write deployment configuration, and set up monitoring. The AI does the work; humans make the decisions.
      </p>
      <p>
        If you have an AI-built prototype that's stuck in the gap, the path forward is not to throw it away and start from scratch. It's to bring in engineers who know how to evaluate what's there, fix what's broken, and get the thing across the line.
      </p>
      <p>
        That's the work we do.
      </p>
    </>
  ),
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // TODO: fetch content from Sanity using slug
  const content = placeholderContent;
  return <BlogPost content={content} />;
}
