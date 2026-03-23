import { MetadataRoute } from 'next';

const BASE_URL = 'https://sociofitechnology.com';

function url(path: string, priority = 0.7, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Parent ─────────────────────────────────────────────────────────────────
    url('/', 1.0, 'weekly'),
    url('/about', 0.8, 'monthly'),
    url('/contact', 0.9, 'monthly'),
    url('/blog', 0.8, 'weekly'),
    url('/careers', 0.7, 'monthly'),
    url('/legal', 0.3, 'yearly'),
    url('/partnerships', 0.6, 'monthly'),

    // ── Studio ─────────────────────────────────────────────────────────────────
    url('/studio', 1.0, 'weekly'),
    url('/studio/start-project', 0.95, 'monthly'),
    url('/studio/portfolio', 0.85, 'weekly'),
    url('/studio/pricing', 0.9, 'monthly'),
    url('/studio/process', 0.75, 'monthly'),
    url('/studio/solutions', 0.8, 'monthly'),

    // Studio → Services
    url('/studio/services/product-development', 0.85, 'monthly'),
    url('/studio/services/product-development/mvp', 0.8, 'monthly'),
    url('/studio/services/product-development/full-product', 0.8, 'monthly'),
    url('/studio/services/product-development/rescue-ship', 0.8, 'monthly'),
    url('/studio/services/internal-tools', 0.8, 'monthly'),
    url('/studio/services/internal-tools/workflow-automation', 0.75, 'monthly'),
    url('/studio/services/internal-tools/dashboards', 0.75, 'monthly'),
    url('/studio/services/automation-integration', 0.8, 'monthly'),
    url('/studio/services/automation-integration/api-integration', 0.75, 'monthly'),

    // Studio → Solutions (audience)
    url('/studio/solutions/for-founders', 0.85, 'monthly'),
    url('/studio/solutions/for-smes', 0.85, 'monthly'),
    url('/studio/solutions/for-teams', 0.8, 'monthly'),

    // Studio → Portfolio
    url('/studio/portfolio/rescue-to-launch', 0.75, 'monthly'),

    // ── Services ───────────────────────────────────────────────────────────────
    url('/services', 0.9, 'weekly'),
    url('/services/get-protected', 0.9, 'monthly'),
    url('/services/how-it-works', 0.75, 'monthly'),
    url('/services/plans', 0.9, 'monthly'),
    url('/services/monitoring', 0.75, 'monthly'),
    url('/services/security', 0.75, 'monthly'),
    url('/services/bug-fixes', 0.75, 'monthly'),
    url('/services/feature-updates', 0.75, 'monthly'),
    url('/services/performance', 0.75, 'monthly'),
    url('/services/for-studio-clients', 0.7, 'monthly'),

    // ── Labs ───────────────────────────────────────────────────────────────────
    url('/labs', 0.85, 'weekly'),
    url('/labs/about', 0.6, 'monthly'),
    url('/labs/blog', 0.8, 'weekly'),
    url('/labs/open-source', 0.7, 'monthly'),
    url('/labs/projects', 0.7, 'monthly'),
    url('/labs/research', 0.75, 'monthly'),

    // Labs → Blog posts
    url('/labs/blog/why-ai-generated-code-breaks-in-production', 0.7, 'monthly'),
    url('/labs/blog/architecture-review-for-ai-projects', 0.7, 'monthly'),

    // Labs → Research
    url('/labs/research/ai-agent-code-quality-benchmark', 0.7, 'monthly'),

    // ── Products ───────────────────────────────────────────────────────────────
    url('/products', 0.85, 'monthly'),
    url('/products/fabricxai', 0.8, 'monthly'),
    url('/products/fabricxai/features', 0.75, 'monthly'),
    url('/products/fabricxai/contact', 0.8, 'monthly'),
    url('/products/nexus-aria', 0.8, 'monthly'),
    url('/products/nexus-aria/features', 0.75, 'monthly'),
    url('/products/nexus-aria/early-access', 0.85, 'monthly'),
    url('/products/devbridge', 0.8, 'monthly'),
    url('/products/devbridge/interest', 0.8, 'monthly'),
    url('/products/roadmap', 0.65, 'monthly'),

    // ── Academy ────────────────────────────────────────────────────────────────
    url('/academy', 0.85, 'weekly'),
    url('/academy/about', 0.6, 'monthly'),
    url('/academy/courses', 0.8, 'weekly'),
    url('/academy/workshops', 0.8, 'monthly'),
    url('/academy/corporate', 0.8, 'monthly'),
    url('/academy/certification', 0.75, 'monthly'),
    url('/academy/certification/faq', 0.6, 'monthly'),
    url('/academy/free', 0.85, 'weekly'),
    url('/academy/who-its-for', 0.7, 'monthly'),
    url('/academy/student-stories', 0.65, 'monthly'),

    // ── Ventures ───────────────────────────────────────────────────────────────
    url('/ventures', 0.85, 'monthly'),
    url('/ventures/apply', 0.9, 'monthly'),
    url('/ventures/how-it-works', 0.75, 'monthly'),
    url('/ventures/portfolio', 0.75, 'monthly'),
    url('/ventures/what-we-look-for', 0.7, 'monthly'),
    url('/ventures/models/equity', 0.7, 'monthly'),
    url('/ventures/models/revenue-share', 0.7, 'monthly'),
    url('/ventures/models/hybrid', 0.7, 'monthly'),

    // ── Cloud ──────────────────────────────────────────────────────────────────
    url('/cloud', 0.85, 'monthly'),
    url('/cloud/get-hosted', 0.9, 'monthly'),
    url('/cloud/why-managed', 0.75, 'monthly'),
    url('/cloud/features', 0.75, 'monthly'),
    url('/cloud/security', 0.75, 'monthly'),
    url('/cloud/providers', 0.65, 'monthly'),
    url('/cloud/migration', 0.7, 'monthly'),
    url('/cloud/plans', 0.9, 'monthly'),
  ];
}
