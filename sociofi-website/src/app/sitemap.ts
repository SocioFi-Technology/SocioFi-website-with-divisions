/**
 * Programmatic sitemap — auto-discovers static routes by scanning the
 * filesystem at build time, then adds known dynamic routes from static
 * data sources. Priority / changeFrequency overrides live in ROUTE_CONFIG.
 *
 * ADDING A NEW STATIC PAGE:   just create the page.tsx — it appears automatically.
 * ADDING A NEW DYNAMIC SLUG:  add it to the relevant data lib (academy, agents, etc.)
 * CHANGING PRIORITY:          add / edit an entry in ROUTE_CONFIG below.
 * EXCLUDING A ROUTE:          add its prefix to EXCLUDED_PREFIXES.
 */
import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { courses, workshops } from '@/lib/academy';
import { agents, CATEGORY_META } from '@/lib/agents';
import { articles, researchStreams } from '@/lib/labs';

const BASE_URL = 'https://sociofitechnology.com';

// ── Types ─────────────────────────────────────────────────────────────────────
type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency'];
interface RouteConfig { priority: number; changeFrequency: ChangeFreq }

// ── Per-route overrides ───────────────────────────────────────────────────────
// Paths not listed here get sensible defaults based on URL depth (see depthDefaults).
const ROUTE_CONFIG: Record<string, Partial<RouteConfig>> = {
  // ── Parent brand ──
  '/':                          { priority: 1.0, changeFrequency: 'weekly'  },
  '/about':                     { priority: 0.8, changeFrequency: 'monthly' },
  '/contact':                   { priority: 0.9, changeFrequency: 'monthly' },
  '/blog':                      { priority: 0.8, changeFrequency: 'weekly'  },
  '/careers':                   { priority: 0.7, changeFrequency: 'monthly' },
  '/partnerships':              { priority: 0.6, changeFrequency: 'monthly' },
  '/legal':                     { priority: 0.3, changeFrequency: 'yearly'  },

  // ── Studio ──
  '/studio':                    { priority: 1.0, changeFrequency: 'weekly'  },
  '/studio/start-project':      { priority: 0.95, changeFrequency: 'monthly' },
  '/studio/pricing':            { priority: 0.9,  changeFrequency: 'monthly' },
  '/studio/portfolio':          { priority: 0.85, changeFrequency: 'weekly'  },

  // ── Services ──
  '/services':                  { priority: 0.9, changeFrequency: 'weekly'  },
  '/services/get-protected':    { priority: 0.9, changeFrequency: 'monthly' },
  '/services/plans':            { priority: 0.9, changeFrequency: 'monthly' },

  // ── Labs ──
  '/labs':                      { priority: 0.85, changeFrequency: 'weekly' },
  '/labs/blog':                 { priority: 0.8,  changeFrequency: 'weekly' },

  // ── Products ──
  '/products':                  { priority: 0.85, changeFrequency: 'monthly' },
  '/products/fabricxai':        { priority: 0.85, changeFrequency: 'monthly' },
  '/products/nexus-aria':       { priority: 0.85, changeFrequency: 'monthly' },
  '/products/devbridge':        { priority: 0.85, changeFrequency: 'monthly' },

  // ── Academy ──
  '/academy':                   { priority: 0.85, changeFrequency: 'weekly'  },
  '/academy/courses':           { priority: 0.85, changeFrequency: 'weekly'  },
  '/academy/free':              { priority: 0.85, changeFrequency: 'weekly'  },
  '/academy/workshops':         { priority: 0.8,  changeFrequency: 'monthly' },
  '/academy/certification':     { priority: 0.75, changeFrequency: 'monthly' },
  '/academy/corporate':         { priority: 0.8,  changeFrequency: 'monthly' },

  // ── Agents ──
  '/agents':                    { priority: 0.9, changeFrequency: 'weekly'  },
  '/agents/catalog':            { priority: 0.9, changeFrequency: 'weekly'  },
  '/agents/pricing':            { priority: 0.85, changeFrequency: 'monthly' },

  // ── Ventures ──
  '/ventures':                  { priority: 0.85, changeFrequency: 'monthly' },
  '/ventures/apply':            { priority: 0.9,  changeFrequency: 'monthly' },

  // ── Cloud ──
  '/cloud':                     { priority: 0.85, changeFrequency: 'monthly' },
  '/cloud/get-hosted':          { priority: 0.9,  changeFrequency: 'monthly' },
  '/cloud/plans':               { priority: 0.9,  changeFrequency: 'monthly' },
};

// ── Paths excluded from the sitemap ──────────────────────────────────────────
const EXCLUDED_PREFIXES = ['/cms', '/admin', '/api'];

// ── Default priority by URL depth ────────────────────────────────────────────
function depthDefaults(urlPath: string): RouteConfig {
  const depth = urlPath === '/' ? 0 : urlPath.split('/').filter(Boolean).length;
  if (depth <= 1) return { priority: 0.8,  changeFrequency: 'monthly' };
  if (depth === 2) return { priority: 0.75, changeFrequency: 'monthly' };
  return                  { priority: 0.65, changeFrequency: 'monthly' };
}

// ── Build a single sitemap entry ──────────────────────────────────────────────
function entry(
  urlPath: string,
  override: Partial<RouteConfig> = {},
): MetadataRoute.Sitemap[number] {
  const defaults = depthDefaults(urlPath);
  const cfg = { ...defaults, ...ROUTE_CONFIG[urlPath], ...override };
  return {
    url: `${BASE_URL}${urlPath}`,
    lastModified: new Date(),
    priority: cfg.priority,
    changeFrequency: cfg.changeFrequency,
  };
}

// ── Filesystem walk — discovers all static page.tsx routes ────────────────────
//
// Runs at build time (sitemap.ts is server-side / static generation only).
// Skips:
//   • private folders starting with _  (e.g. _components)
//   • dynamic segments starting with [ (handled separately)
//   • route groups in parens are stripped from the URL (e.g. (studio) → "")
//   • paths matching EXCLUDED_PREFIXES
//
function collectStaticPaths(dir: string, appRoot: string): string[] {
  const paths: string[] = [];
  let entries: fs.Dirent[];

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return paths;
  }

  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);

    if (ent.isDirectory()) {
      if (ent.name.startsWith('_') || ent.name.startsWith('[')) continue;
      paths.push(...collectStaticPaths(fullPath, appRoot));
    } else if (ent.name === 'page.tsx' || ent.name === 'page.ts') {
      // Convert filesystem path → URL path
      const urlPath =
        '/' +
        dir
          .replace(appRoot, '')
          .split(path.sep)
          .filter(Boolean)
          // Strip route-group segments: (studio), (academy), etc.
          .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
          .join('/');

      const normalized = urlPath === '//' ? '/' : urlPath.replace(/\/+$/, '');

      if (EXCLUDED_PREFIXES.some((prefix) => normalized.startsWith(prefix))) continue;

      paths.push(normalized);
    }
  }

  return paths;
}

// ── Sitemap export ────────────────────────────────────────────────────────────
export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), 'src', 'app');

  // 1. Static routes — auto-discovered from the filesystem
  const staticPaths = [...new Set(collectStaticPaths(appDir, appDir))].sort();
  const staticEntries = staticPaths.map((p) => entry(p));

  // 2. Dynamic routes — generated from static data sources known at build time
  //    Add more arrays here when new dynamic routes are introduced.
  const dynamicEntries: MetadataRoute.Sitemap = [
    // Academy: individual course pages
    ...courses.map((c) =>
      entry(`/academy/courses/${c.slug}`, { priority: 0.8, changeFrequency: 'monthly' }),
    ),

    // Academy: individual workshop pages
    ...workshops.map((w) =>
      entry(`/academy/workshops/${w.slug}`, { priority: 0.75, changeFrequency: 'weekly' }),
    ),

    // Agents: individual agent detail pages
    ...agents.map((a) =>
      entry(`/agents/catalog/${a.slug}`, { priority: 0.8, changeFrequency: 'monthly' }),
    ),

    // Agents: category listing pages
    ...(Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>).map((cat) =>
      entry(`/agents/categories/${cat}`, { priority: 0.7, changeFrequency: 'monthly' }),
    ),

    // Labs: individual article pages (published only)
    ...articles
      .filter((a) => a.status === 'published')
      .map((a) => entry(`/labs/blog/${a.slug}`, { priority: 0.7, changeFrequency: 'monthly' })),

    // Labs: individual research stream pages
    ...researchStreams.map((r) =>
      entry(`/labs/research/${r.slug}`, { priority: 0.7, changeFrequency: 'monthly' }),
    ),
  ];

  return [...staticEntries, ...dynamicEntries];
}
