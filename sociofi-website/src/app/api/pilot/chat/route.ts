import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// ── Types ──────────────────────────────────────────────────────────────────────

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface PilotResponse {
  message: string;
  quickActions?: string[];
}

// ── Fallback: direct Claude call (used when NEXUS is not configured) ───────────
// This is the current implementation kept as a fallback so PILOT works in
// production before NEXUS RAG is ready. Once NEXUS_API_URL is set in env,
// all requests are delegated there instead.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are PILOT (Proactive Intelligent Liaison for Orientation & Touchpoints), the website assistant for SocioFi Technology.

SocioFi Technology is an AI-agent-native software development company with 7 specialist divisions:
- Studio (/studio): Product development, rescue projects, internal tools. Accent: teal (#72C4B2). CTA: "Start a Project"
- Services (/services): Ongoing maintenance, monitoring, security, bug fixes. Plans from $299/mo. CTA: "Get Protected"
- Labs (/labs): Open-source, research, technical writing. Free content.
- Products (/products): FabricxAI (AI workflow builder), NEXUS ARIA (AI assistant platform), DevBridge (API tooling)
- Academy (/academy): Courses and workshops. From $49/course. CTA: "Browse Courses"
- Ventures (/ventures): Equity/revenue-share partnerships with early-stage startups. CTA: "Apply"
- Cloud (/cloud): Managed hosting on AWS, DigitalOcean, Hetzner, Vercel. From $99/mo. CTA: "Get Hosted"
- Agents (/agents): 16 individual AI agents — subscribe monthly, deploy in days. CTA: "Browse Catalog"

Studio pricing (rough ranges):
- MVP Sprint: $3,000–8,000 (3–6 weeks)
- Full Product Build: $8,000–25,000 (6–16 weeks)
- Rescue & Ship: $2,000–6,000 (2–6 weeks)
- Internal Tools: $2,500–10,000 (3–8 weeks)

Your personality: Warm, direct, knowledgeable — like a sharp colleague, not a salesperson. Answer the question first, then offer next steps. Never corporate, never robotic. Use "I" (you are PILOT). Keep responses concise — 2–4 sentences max unless detailed explanation is needed.

NEVER mention Claude, Anthropic, OpenAI, GPT, or any specific AI model. Give pricing as ranges. Offer human handoff when needed. If asked if you're human: "I'm PILOT, SocioFi's AI assistant. For anything I can't handle, I'll connect you with a real person."

Return responses as JSON with this shape:
{
  "message": "Your response text here",
  "quickActions": ["action 1", "action 2", "action 3"]  // 2-4 relevant follow-up options, or omit if not helpful
}`;

async function callClaudeDirectly(
  message: string,
  history: HistoryMessage[],
  division: string,
  pageContext: string,
): Promise<PilotResponse> {
  const contextNote = `\n\n[Context: Visitor is on the ${division} division. Current page: ${pageContext}]`;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: SYSTEM_PROMPT + contextNote,
    messages: [
      ...history.slice(-10).map((h) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })),
      { role: 'user' as const, content: message.trim() },
    ],
  });

  const rawText = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const parsed = JSON.parse(rawText) as PilotResponse;
    return { message: parsed.message || rawText, quickActions: parsed.quickActions };
  } catch {
    return { message: rawText };
  }
}

// ── Main handler ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      conversation_id,
      division = 'technology',
      page_url = '',
      page_title = '',
      history = [],
    } = (await req.json()) as {
      message: string;
      conversation_id?: string;
      division?: string;
      page_url?: string;
      page_title?: string;
      history?: HistoryMessage[];
    };

    if (!message?.trim()) {
      return NextResponse.json({ message: 'No message provided.' }, { status: 400 });
    }

    const pageContext = page_title || page_url || 'homepage';

    // ── Route to NEXUS if configured ──────────────────────────────────────────
    // When NEXUS_API_URL is set, delegate entirely — NEXUS handles RAG,
    // embeddings, pgvector retrieval, and Claude. The website just proxies.
    const NEXUS_URL = process.env.NEXUS_API_URL;
    const NEXUS_KEY = process.env.NEXUS_API_KEY;

    if (NEXUS_URL && NEXUS_KEY) {
      const nexusRes = await fetch(`${NEXUS_URL}/pilot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${NEXUS_KEY}`,
        },
        body: JSON.stringify({
          message: message.trim(),
          conversation_id,
          division,
          page_url,
          page_title,
          history: history.slice(-10),
        }),
        signal: AbortSignal.timeout(15000), // 15s timeout
      });

      if (!nexusRes.ok) {
        console.error('[PILOT] NEXUS error:', nexusRes.status, await nexusRes.text());
        // Fall through to direct Claude call on NEXUS failure
      } else {
        const data = (await nexusRes.json()) as PilotResponse;
        return NextResponse.json(data);
      }
    }

    // ── Fallback: call Claude directly (no RAG) ───────────────────────────────
    const result = await callClaudeDirectly(message, history, division, pageContext);
    return NextResponse.json(result);

  } catch (error) {
    console.error('[PILOT] API error:', error);
    return NextResponse.json(
      { message: "I'm having trouble connecting right now. Email hello@sociofitechnology.com for immediate help." },
      { status: 500 },
    );
  }
}
