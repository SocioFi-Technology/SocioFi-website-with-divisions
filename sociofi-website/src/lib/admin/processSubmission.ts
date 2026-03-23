import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import type { Priority } from '@/lib/supabase/types';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProcessSubmissionParams {
  division: string;
  type: string;
  data: Record<string, unknown>;
  source_url?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
  notify_emails?: string[];
  stripe_payment_intent_id?: string;
}

export interface ProcessSubmissionResult {
  submission_id: string;
  contact_id: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function classifyPriority(type: string, data: Record<string, unknown>): Priority {
  if (
    type.includes('rescue') ||
    type.includes('incident') ||
    data.urgent === true
  ) {
    return 'urgent';
  }

  if (type.includes('newsletter') || type.includes('academy-free')) {
    return 'low';
  }

  const budget = String(data.budget_range ?? data.budget ?? '');
  if (
    budget.includes('$10K') ||
    budget.includes('$10k') ||
    budget.includes('$15K') ||
    budget.includes('$15k') ||
    budget.includes('$25K') ||
    budget.includes('$25k') ||
    budget.includes('$30K') ||
    budget.includes('$30k') ||
    budget.includes('$50K') ||
    budget.includes('$50k') ||
    budget.includes('$100K') ||
    budget.includes('$100k') ||
    budget.includes('$75K') ||
    budget.includes('$75k')
  ) {
    return 'high';
  }

  return 'normal';
}

function buildEmailSummary(type: string, data: Record<string, unknown>): string {
  const rows = Object.entries(data)
    .filter(([k]) => !['source_url', 'utm'].includes(k))
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 8px;color:#666;white-space:nowrap">${k}</td><td style="padding:4px 8px">${String(v ?? '')}</td></tr>`,
    )
    .join('');
  return `<table style="width:100%;border-collapse:collapse">${rows}</table>`;
}

// ── Main ───────────────────────────────────────────────────────────────────────

export async function processSubmission(
  params: ProcessSubmissionParams,
): Promise<ProcessSubmissionResult> {
  const { division, type, data, source_url, utm } = params;

  const email = String(data.email ?? '');
  const name = data.name ? String(data.name) : undefined;
  const company = data.company ? String(data.company) : undefined;
  const phone = data.phone ? String(data.phone) : undefined;

  const priority = classifyPriority(type, data);

  let submission_id: string;
  let contact_id: string;

  try {
    const supabase = await createClient();

    // ── 1a. Contact upsert ───────────────────────────────────────────────────
    const contactInsert: Record<string, unknown> = {
      email,
      lifecycle_stage: 'lead',
    };
    if (name) contactInsert.name = name;
    if (company) contactInsert.company = company;
    if (phone) contactInsert.phone = phone;

    const { data: contactData, error: contactError } = await supabase
      .from('contacts')
      .upsert(contactInsert, {
        onConflict: 'email',
        ignoreDuplicates: false,
      })
      .select('id')
      .single();

    if (contactError || !contactData) {
      console.error('[processSubmission] Contact upsert error:', contactError);
      contact_id = crypto.randomUUID();
      submission_id = crypto.randomUUID();
      console.log('[NOTIFY]', division, type, email);
    } else {
      contact_id = contactData.id as string;

      // ── 1b. Submission insert ──────────────────────────────────────────────
      const submissionInsert: Record<string, unknown> = {
        contact_id,
        type,
        division,
        status: 'new',
        priority,
        data,
      };
      if (source_url) submissionInsert.source_url = source_url;
      if (utm?.source) submissionInsert.utm_source = utm.source;
      if (utm?.medium) submissionInsert.utm_medium = utm.medium;
      if (utm?.campaign) submissionInsert.utm_campaign = utm.campaign;

      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert(submissionInsert)
        .select('id')
        .single();

      if (submissionError || !submissionData) {
        console.error('[processSubmission] Submission insert error:', submissionError);
        submission_id = crypto.randomUUID();
        console.log('[NOTIFY]', division, type, email);
      } else {
        submission_id = submissionData.id as string;
        console.log('[NOTIFY]', division, type, email);
      }
    }
  } catch (err) {
    console.error('[processSubmission] Unexpected error:', err);
    contact_id = crypto.randomUUID();
    submission_id = crypto.randomUUID();
    console.log('[NOTIFY]', division, type, email);
  }

  // ── 2. NEXUS Webhook (fire-and-forget) ────────────────────────────────────
  const NEXUS_URL = process.env.NEXUS_API_URL;
  const NEXUS_KEY = process.env.NEXUS_API_KEY;
  if (NEXUS_URL && NEXUS_KEY && submission_id) {
    fetch(`${NEXUS_URL}/webhook/submission`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NEXUS_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submission_id,
        contact_id,
        type,
        division,
        data,
        utm,
        timestamp: new Date().toISOString(),
      }),
    }).catch((err) => console.warn('[NEXUS] Webhook failed (non-blocking):', err));
  }

  // ── 3. Resend Email Notification ─────────────────────────────────────────
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'admin@sociofi.io';

  const DEFAULT_RECIPIENTS: Record<string, string[]> = {
    studio: ['studio@sociofi.io'],
    services: ['services@sociofi.io'],
    labs: ['labs@sociofi.io'],
    products: ['products@sociofi.io'],
    academy: ['academy@sociofi.io'],
    ventures: ['ventures@sociofi.io'],
    cloud: ['cloud@sociofi.io'],
    agents: ['agents@sociofi.io'],
    parent: ['hello@sociofi.io'],
  };

  const recipients = params.notify_emails?.length
    ? params.notify_emails
    : (DEFAULT_RECIPIENTS[division] ?? ['hello@sociofi.io']);

  if (RESEND_KEY) {
    const resend = new Resend(RESEND_KEY);
    const emailName = String(data.name ?? 'Someone');
    const emailAddr = String(data.email ?? 'unknown');
    const summary = buildEmailSummary(type, data);

    resend.emails
      .send({
        from: `SocioFi Admin <${FROM_EMAIL}>`,
        to: recipients,
        subject: `[${division.toUpperCase()}] New ${type} submission — ${emailName}`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#3A589E">New Submission — ${type}</h2>
          <p><strong>Division:</strong> ${division}</p>
          <p><strong>From:</strong> ${emailName} &lt;${emailAddr}&gt;</p>
          <p><strong>Priority:</strong> ${priority}</p>
          <hr/>
          ${summary}
          <hr/>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/submissions">
            View in Admin Panel →
          </a></p>
          <p style="color:#888;font-size:12px">Submission ID: ${submission_id}</p>
        </div>
      `,
      })
      .catch((err: unknown) => console.warn('[RESEND] Email failed (non-blocking):', err));
  }

  // ── 4. Slack Notification (fire-and-forget) ──────────────────────────────
  const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
  if (SLACK_WEBHOOK) {
    const emailName = String(data.name ?? 'Unknown');
    const emailAddr = String(data.email ?? '');
    fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New ${division} submission — ${type}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*New ${type} — ${division.toUpperCase()}*\n*From:* ${emailName} \`${emailAddr}\`\n*Priority:* ${priority}`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: 'View in Admin' },
                url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/submissions/${submission_id}`,
              },
            ],
          },
        ],
      }),
    }).catch((err: unknown) => console.warn('[SLACK] Webhook failed (non-blocking):', err));
  }

  return { submission_id, contact_id };
}
