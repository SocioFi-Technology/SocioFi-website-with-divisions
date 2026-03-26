import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

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

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 30 messages per IP per hour
    const ip = getClientIp(req)
    const rl = checkRateLimit(`pilot:${ip}`, 30, 60 * 60 * 1000)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait before trying again.' },
        { status: 429 }
      )
    }

    const { message, division, page_url, page_title, history = [] } = (await req.json()) as {
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

    const contextNote = `\n\n[Context: Visitor is on the ${division || 'technology'} division. Current page: ${page_title || page_url || 'homepage'}]`;

    const messages: Anthropic.MessageParam[] = [
      ...history.slice(-10).map((h: HistoryMessage) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })),
      {
        role: 'user' as const,
        content: message.trim(),
      },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT + contextNote,
      messages,
    });

    const rawText =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Try parsing as JSON, fall back to plain text
    try {
      const parsed = JSON.parse(rawText) as { message?: string; quickActions?: string[] };
      return NextResponse.json({
        message: parsed.message || rawText,
        quickActions: parsed.quickActions,
      });
    } catch {
      return NextResponse.json({ message: rawText });
    }
  } catch (error) {
    console.error('[PILOT] API error:', error);
    return NextResponse.json(
      {
        message:
          "I'm having trouble connecting right now. Email hello@sociofitechnology.com for immediate help.",
      },
      { status: 500 },
    );
  }
}
