import { NextRequest, NextResponse } from 'next/server';

interface RouteCatalogEntry {
  path: string;
  type: string;
  division: string;
  required_fields: string[];
}

const ROUTE_CATALOG: RouteCatalogEntry[] = [
  { path: '/api/contact', type: 'contact', division: 'parent', required_fields: ['name', 'email', 'message'] },
  { path: '/api/careers', type: 'careers', division: 'parent', required_fields: ['name', 'email', 'role', 'cover_letter'] },
  { path: '/api/newsletter/subscribe', type: 'newsletter', division: 'parent', required_fields: ['email'] },
  { path: '/api/newsletter/unsubscribe', type: 'newsletter-unsub', division: 'parent', required_fields: ['email'] },
  { path: '/api/studio/start-project', type: 'start-project', division: 'studio', required_fields: ['name', 'email', 'description', 'budget_range'] },
  { path: '/api/studio/quote', type: 'quote', division: 'studio', required_fields: ['name', 'email'] },
  { path: '/api/studio/rescue', type: 'rescue', division: 'studio', required_fields: ['name', 'email'] },
  { path: '/api/studio/for-founders', type: 'audience-founders', division: 'studio', required_fields: ['name', 'email', 'product_description', 'current_stage'] },
  { path: '/api/studio/for-sme', type: 'audience-sme', division: 'studio', required_fields: ['name', 'email', 'company', 'description'] },
  { path: '/api/studio/for-teams', type: 'audience-teams', division: 'studio', required_fields: ['name', 'email', 'project_description'] },
  { path: '/api/agents/inquire', type: 'agent-inquiry', division: 'agents', required_fields: ['name', 'email'] },
  { path: '/api/agents/deploy', type: 'agent-deploy', division: 'agents', required_fields: ['name', 'email'] },
  { path: '/api/agents/custom', type: 'custom-agent', division: 'agents', required_fields: ['name', 'email', 'use_case'] },
  { path: '/api/agents/enterprise', type: 'enterprise-agents', division: 'agents', required_fields: ['name', 'email', 'company', 'use_cases'] },
  { path: '/api/services/get-protected', type: 'get-protected', division: 'services', required_fields: ['name', 'email'] },
  { path: '/api/services/ticket', type: 'ticket', division: 'services', required_fields: ['name', 'email'] },
  { path: '/api/services/upgrade', type: 'upgrade', division: 'services', required_fields: ['name', 'email'] },
  { path: '/api/services/audit', type: 'tech-audit', division: 'services', required_fields: ['name', 'email', 'tech_stack', 'current_issues'] },
  { path: '/api/services/recommend', type: 'plan-recommendation', division: 'services', required_fields: ['name', 'email', 'app_description'] },
  { path: '/api/cloud/get-hosted', type: 'get-hosted', division: 'cloud', required_fields: ['name', 'email'] },
  { path: '/api/cloud/audit', type: 'cloud-audit', division: 'cloud', required_fields: ['name', 'email'] },
  { path: '/api/cloud/migration', type: 'cloud-migration', division: 'cloud', required_fields: ['name', 'email', 'current_provider', 'reason_for_migration', 'app_type'] },
  { path: '/api/academy/enroll', type: 'course-enrollment', division: 'academy', required_fields: ['name', 'email', 'course'] },
  { path: '/api/academy/workshop', type: 'workshop-registration', division: 'academy', required_fields: ['name', 'email', 'workshop_id'] },
  { path: '/api/academy/corporate', type: 'corporate-training', division: 'academy', required_fields: ['name', 'email', 'company', 'team_size'] },
  { path: '/api/academy/scarl', type: 'scarl-application', division: 'academy', required_fields: ['name', 'email', 'role_title', 'product_name', 'product_stage', 'why_scarl'] },
  { path: '/api/ventures/apply', type: 'ventures-apply', division: 'ventures', required_fields: ['name', 'email'] },
  { path: '/api/labs/contact', type: 'labs-contact', division: 'labs', required_fields: ['name', 'email'] },
  { path: '/api/labs/contribute', type: 'contribution', division: 'labs', required_fields: ['name', 'email', 'contribution_type', 'relevant_work'] },
  { path: '/api/products/inquiry', type: 'product-inquiry', division: 'products', required_fields: ['name', 'email'] },
];

export async function GET() {
  return NextResponse.json({ routes: ROUTE_CATALOG });
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { route, data } = body as { route?: string; data?: Record<string, unknown> };

    if (!route || typeof route !== 'string') {
      return NextResponse.json({ error: 'Missing required field: route' }, { status: 400 });
    }

    const catalogEntry = ROUTE_CATALOG.find((r) => r.path === route);
    if (!catalogEntry) {
      return NextResponse.json(
        { error: `Unknown route: ${route}`, available_routes: ROUTE_CATALOG.map((r) => r.path) },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const targetUrl = `${baseUrl}${route}`;

    const upstream = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data ?? {}),
    });

    const responseData: unknown = await upstream.json();

    return NextResponse.json(
      { proxied_to: targetUrl, status: upstream.status, response: responseData },
      { status: upstream.status },
    );
  } catch (err) {
    console.error('[API ERROR] /api/submissions/test', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
