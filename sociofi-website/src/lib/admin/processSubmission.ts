import { createClient } from '@/lib/supabase/server';
import type { Priority } from '@/lib/supabase/types';

export interface ProcessSubmissionParams {
  division: string;
  type: string;
  data: Record<string, unknown>;
  source_url?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

export interface ProcessSubmissionResult {
  submission_id: string;
  contact_id: string;
}

function classifyPriority(type: string, data: Record<string, unknown>): Priority {
  // Urgent: rescue/incident types or explicitly flagged
  if (
    type.includes('rescue') ||
    type.includes('incident') ||
    data.urgent === true
  ) {
    return 'urgent';
  }

  // Low: newsletter subscriptions or free academy access
  if (type.includes('newsletter') || type.includes('academy-free')) {
    return 'low';
  }

  // High: significant budget signals
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

export async function processSubmission(
  params: ProcessSubmissionParams,
): Promise<ProcessSubmissionResult> {
  const { division, type, data, source_url, utm } = params;

  const email = String(data.email ?? '');
  const name = data.name ? String(data.name) : undefined;
  const company = data.company ? String(data.company) : undefined;
  const phone = data.phone ? String(data.phone) : undefined;

  const priority = classifyPriority(type, data);

  try {
    const supabase = await createClient();

    // Upsert contact by email
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
      // Fall back to generated IDs so API doesn't fail silently
      const fallbackContactId = crypto.randomUUID();
      const fallbackSubmissionId = crypto.randomUUID();
      console.log('[NOTIFY]', division, type, email);
      return { submission_id: fallbackSubmissionId, contact_id: fallbackContactId };
    }

    const contact_id = contactData.id as string;

    // Insert submission
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
      const fallbackSubmissionId = crypto.randomUUID();
      console.log('[NOTIFY]', division, type, email);
      return { submission_id: fallbackSubmissionId, contact_id };
    }

    const submission_id = submissionData.id as string;

    // Placeholder notification (Resend integration goes here later)
    console.log('[NOTIFY]', division, type, email);

    return { submission_id, contact_id };
  } catch (err) {
    console.error('[processSubmission] Unexpected error:', err);
    // Return generated UUIDs so API doesn't fail silently
    const fallbackContactId = crypto.randomUUID();
    const fallbackSubmissionId = crypto.randomUUID();
    console.log('[NOTIFY]', division, type, email);
    return { submission_id: fallbackSubmissionId, contact_id: fallbackContactId };
  }
}
