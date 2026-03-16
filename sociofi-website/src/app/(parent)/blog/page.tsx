import BlogListing, { type BlogListingContent } from '@/templates/BlogListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — SocioFi Technology',
  description:
    'Thinking on AI-native development, production engineering, and what it actually takes to build software that lasts. From the SocioFi Technology team.',
};

const content: BlogListingContent = {
  label: 'From the team',
  title: 'Writing from SocioFi Technology',
  categories: ['Technical', 'Business', 'Build Logs', 'Guides', 'News'],
  featured: {
    title: 'Why 80% of AI-generated prototypes never make it to production',
    excerpt:
      "AI coding tools have made it possible for non-technical founders to build working prototypes in days. But the gap between 'it works on my machine' and 'it's live and stable' is where most of them get stuck. Here's what that gap actually looks like — and how to close it.",
    category: 'Technical',
    date: 'March 12, 2026',
    readTime: '8 min read',
    href: '/blog/why-ai-prototypes-fail-production',
    author: 'Kamrul Hasan',
    accentColor: 'var(--teal)',
  },
  posts: [
    {
      title: 'The architecture decisions AI gets wrong (and how we fix them)',
      excerpt:
        'AI coding agents are remarkably good at writing individual functions. They are significantly worse at system-level decisions: how services communicate, how data is structured, how failure is handled.',
      category: 'Technical',
      date: 'March 8, 2026',
      readTime: '6 min read',
      href: '/blog/architecture-decisions-ai-gets-wrong',
      author: 'Kamrul Hasan',
    },
    {
      title: 'How we scope a project in 30 minutes',
      excerpt:
        "Our intro calls are 30 minutes. By the end, we have a clear enough picture to give a fixed-scope proposal. Here's the framework we use — and why most scoping conversations take too long because they start in the wrong place.",
      category: 'Business',
      date: 'March 4, 2026',
      readTime: '5 min read',
      href: '/blog/how-we-scope-in-30-minutes',
      author: 'Arifur Rahman',
    },
    {
      title: 'Build Log: rescuing a broken SaaS prototype in 2 weeks',
      excerpt:
        "A founder came to us with a prototype built over three months that had three critical bugs, no authentication, and couldn't connect to Stripe. Here's exactly what we found and what we fixed.",
      category: 'Build Logs',
      date: 'Feb 28, 2026',
      readTime: '7 min read',
      href: '/blog/build-log-saas-rescue',
      author: 'Kamrul Hasan',
    },
    {
      title: 'Guide: deploying your first Next.js app to production',
      excerpt:
        "A practical walkthrough for non-technical founders. What 'deployment' actually means, what can go wrong, and the checklist we run through before every launch.",
      category: 'Guides',
      date: 'Feb 21, 2026',
      readTime: '9 min read',
      href: '/blog/deploying-nextjs-to-production',
      author: 'Kamrul Hasan',
    },
    {
      title: "What 'production-ready' actually means for a first product",
      excerpt:
        "It doesn't mean perfect. It means: loads under real traffic, doesn't leak data, recovers from failures, can be updated without breaking, and has someone who knows what to do at 2am when it falls over.",
      category: 'Business',
      date: 'Feb 14, 2026',
      readTime: '5 min read',
      href: '/blog/what-production-ready-means',
      author: 'Arifur Rahman',
    },
    {
      title: 'SocioFi Technology opens Academy: AI development courses for non-technical founders',
      excerpt:
        "We launched SocioFi Academy — a training programme designed for founders and business owners who want to understand modern AI development. Here's what's in it and who it's for.",
      category: 'News',
      date: 'Feb 7, 2026',
      readTime: '3 min read',
      href: '/blog/sociofi-academy-launch',
      author: 'Arifur Rahman',
    },
  ],
  newsletter: {
    headline: 'Get new articles in your inbox',
    description:
      'We publish a few times a month. No fluff, no AI hype — just honest writing about building software that works.',
  },
};

export default function BlogPage() {
  return <BlogListing content={content} />;
}
