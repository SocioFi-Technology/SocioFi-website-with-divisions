from supabase import create_client, Client
from config import settings
import uuid
from datetime import datetime, timedelta
from typing import Any

_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_service_key)
    return _client


def query_contact_by_email(email: str) -> dict | None:
    """Find a contact by email. Returns contact dict or None."""
    result = get_client().table('contacts').select('*').eq('email', email).maybe_single().execute()
    return result.data


def query_submission(submission_id: str) -> dict | None:
    """Fetch a submission by ID with contact join."""
    result = (
        get_client()
        .table('submissions')
        .select('*, contacts(email, name, company, tags, lifecycle_stage)')
        .eq('id', submission_id)
        .maybe_single()
        .execute()
    )
    return result.data


def update_submission_ai(submission_id: str, ai_classification: str, ai_score: int, ai_tags: list[str]) -> bool:
    """Store AI classification results in submission.data JSONB field."""
    # Store in data JSONB since columns may not exist yet
    client = get_client()
    # Fetch current data
    current = client.table('submissions').select('data').eq('id', submission_id).maybe_single().execute()
    current_data = current.data.get('data', {}) if current.data else {}

    updated_data = {
        **current_data,
        'ai_classification': ai_classification,
        'ai_score': ai_score,
        'ai_tags': ai_tags,
        'ai_processed_at': datetime.utcnow().isoformat(),
    }

    result = client.table('submissions').update({
        'data': updated_data,
        'status': 'reviewed',
    }).eq('id', submission_id).execute()

    return bool(result.data)


def update_contact_tags_and_score(contact_id: str, tags_to_add: list[str], new_stage: str | None = None) -> bool:
    """Add tags to a contact and optionally update lifecycle stage."""
    client = get_client()
    current = client.table('contacts').select('tags, lifecycle_stage').eq('id', contact_id).maybe_single().execute()
    if not current.data:
        return False

    existing_tags = current.data.get('tags') or []
    merged_tags = list(set(existing_tags + tags_to_add))

    update_payload: dict[str, Any] = {'tags': merged_tags}
    if new_stage:
        update_payload['lifecycle_stage'] = new_stage

    result = client.table('contacts').update(update_payload).eq('id', contact_id).execute()
    return bool(result.data)


def create_pipeline_entry(contact_id: str, submission_id: str, division: str, stage: str, value_estimate: float | None = None) -> str | None:
    """Create a pipeline entry. Returns the new entry ID."""
    payload: dict[str, Any] = {
        'contact_id': contact_id,
        'submission_id': submission_id,
        'division': division,
        'stage': stage,
    }
    if value_estimate:
        payload['value_estimate'] = value_estimate
        payload['probability'] = 20  # default 20% for new entries

    result = get_client().table('pipeline_entries').insert(payload).select('id').single().execute()
    return result.data.get('id') if result.data else None


def create_approval_request(
    agent_name: str,
    action_type: str,
    entity_type: str,
    entity_id: str,
    title: str,
    context: str,
    payload: dict[str, Any],
    confidence: int = 80,
    priority: str = 'normal',
) -> str | None:
    """
    Insert into approval_queue.
    The table must exist (created by migration 001_nexus_tables.sql).
    Falls back gracefully if table does not exist yet.
    """
    try:
        result = get_client().table('approval_queue').insert({
            'agent_name': agent_name,
            'action_type': action_type,
            'entity_type': entity_type,
            'entity_id': entity_id,
            'title': title,
            'context': context,
            'payload': payload,
            'confidence': confidence,
            'priority': priority,
            'status': 'pending',
        }).select('id').single().execute()
        return result.data.get('id') if result.data else None
    except Exception as e:
        print(f'[tools] approval_queue insert failed (table may not exist): {e}')
        return None


def log_activity(action: str, entity_type: str, entity_id: str, details: dict[str, Any] | None = None) -> None:
    """Insert an activity log entry for an agent action."""
    try:
        get_client().table('activity_log').insert({
            'action': action,
            'entity_type': entity_type,
            'entity_id': entity_id,
            'details': details or {},
        }).execute()
    except Exception as e:
        print(f'[tools] activity_log insert failed: {e}')


def schedule_followup(
    contact_id: str,
    submission_id: str,
    sequence_type: str,
    step: int,
    template_name: str,
    template_data: dict,
    delay_days: int,
) -> bool:
    """Schedule an email follow-up for HERALD to send later."""
    scheduled_for = (datetime.utcnow() + timedelta(days=delay_days)).isoformat()
    try:
        get_client().table('followup_schedule').insert({
            'contact_id': contact_id,
            'submission_id': submission_id,
            'sequence_type': sequence_type,
            'step_number': step,
            'scheduled_for': scheduled_for,
            'status': 'pending',
            'template_name': template_name,
            'template_data': template_data,
        }).execute()
        return True
    except Exception as e:
        print(f'[tools] followup_schedule insert failed (table may not exist): {e}')
        return False


def get_due_followups() -> list[dict]:
    """Fetch all followups due now or overdue with status=pending."""
    now = datetime.utcnow().isoformat()
    result = (
        get_client()
        .table('followup_schedule')
        .select('*, contacts(email, name, company)')
        .eq('status', 'pending')
        .lte('scheduled_for', now)
        .limit(50)
        .execute()
    )
    return result.data or []


def mark_followup_sent(followup_id: str) -> None:
    get_client().table('followup_schedule').update({
        'status': 'sent',
        'sent_at': datetime.utcnow().isoformat(),
    }).eq('id', followup_id).execute()


def get_pending_approvals(agent_name: str | None = None, limit: int = 20) -> list[dict]:
    query = (
        get_client()
        .table('approval_queue')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', desc=True)
        .limit(limit)
    )
    if agent_name:
        query = query.eq('agent_name', agent_name)
    return query.execute().data or []


def update_approval_status(
    approval_id: str,
    status: str,
    decided_by: str | None = None,
    discard_reason: str | None = None,
) -> bool:
    payload: dict[str, Any] = {
        'status': status,
        'decided_at': datetime.utcnow().isoformat(),
    }
    if decided_by:
        payload['decided_by'] = decided_by
    if discard_reason:
        payload['discard_reason'] = discard_reason
    result = get_client().table('approval_queue').update(payload).eq('id', approval_id).execute()
    return bool(result.data)


# ── SCRIBE tools ──────────────────────────────────────────────────────────────

def query_existing_content(keywords: list[str], division: str | None = None) -> list[dict]:
    """Search content table by title matching any of the given keywords."""
    try:
        query = get_client().table('content').select('id,title,type,division,status,created_at')
        if division:
            query = query.eq('division', division)
        # Filter by any keyword appearing in title using ilike on first keyword
        # (Supabase doesn't natively support OR ilike in a single call without RPC,
        # so we fetch recent items and filter client-side for simplicity)
        result = query.order('created_at', desc=True).limit(40).execute()
        items = result.data or []
        if keywords:
            kw_lower = [k.lower() for k in keywords]
            items = [
                item for item in items
                if any(k in (item.get('title') or '').lower() for k in kw_lower)
            ]
        return items[:20]
    except Exception as e:
        print(f'[tools] query_existing_content failed: {e}')
        return []


def create_content_draft(
    type_: str,
    title: str,
    slug: str,
    division: str,
    body_json: dict,
    tags: list[str],
    author_name: str,
) -> str | None:
    """Insert a content draft into the content table. Returns the new draft ID."""
    try:
        result = get_client().table('content').insert({
            'type': type_,
            'title': title,
            'slug': slug,
            'division': division,
            'body': body_json,
            'status': 'draft',
            'metadata': {
                'author': author_name,
                'tags': tags,
                'source': 'scribe',
            },
        }).select('id').single().execute()
        return result.data.get('id') if result.data else None
    except Exception as e:
        print(f'[tools] create_content_draft failed: {e}')
        return None


def update_content_seo_metadata(
    content_id: str,
    seo_title: str,
    seo_description: str,
    seo_keywords: list[str],
) -> bool:
    """Merge SEO fields into content.metadata JSONB."""
    try:
        client = get_client()
        current = client.table('content').select('metadata').eq('id', content_id).maybe_single().execute()
        existing_meta = current.data.get('metadata', {}) if current.data else {}
        updated_meta = {
            **existing_meta,
            'seo_title': seo_title,
            'seo_description': seo_description,
            'seo_keywords': seo_keywords,
        }
        result = client.table('content').update({'metadata': updated_meta}).eq('id', content_id).execute()
        return bool(result.data)
    except Exception as e:
        print(f'[tools] update_content_seo_metadata failed: {e}')
        return False


# ── COMPASS tools ─────────────────────────────────────────────────────────────

def query_stale_pipeline_entries(min_days: int = 3, division: str | None = None) -> list[dict]:
    """Fetch pipeline entries where updated_at < (now - min_days), with contact join."""
    try:
        cutoff = (datetime.utcnow() - timedelta(days=min_days)).isoformat()
        query = (
            get_client()
            .table('pipeline_entries')
            .select('*, contacts(id, name, email, company, tags, lifecycle_stage)')
            .lt('updated_at', cutoff)
            .neq('stage', 'closed_won')
            .neq('stage', 'closed_lost')
            .order('updated_at', desc=False)
            .limit(50)
        )
        if division:
            query = query.eq('division', division)
        result = query.execute()
        return result.data or []
    except Exception as e:
        print(f'[tools] query_stale_pipeline_entries failed: {e}')
        return []


def query_contact_with_submissions(contact_id: str) -> dict | None:
    """Get contact details plus recent submission history."""
    try:
        contact_result = (
            get_client()
            .table('contacts')
            .select('*')
            .eq('id', contact_id)
            .maybe_single()
            .execute()
        )
        if not contact_result.data:
            return None

        submissions_result = (
            get_client()
            .table('submissions')
            .select('id, type, division, status, created_at, data')
            .eq('contact_id', contact_id)
            .order('created_at', desc=True)
            .limit(10)
            .execute()
        )

        return {
            **contact_result.data,
            'recent_submissions': submissions_result.data or [],
        }
    except Exception as e:
        print(f'[tools] query_contact_with_submissions failed: {e}')
        return None


# ── WARDEN tools ──────────────────────────────────────────────────────────────

def query_similar_tickets(keywords: list[str]) -> list[dict]:
    """Find past resolved tickets with similar keywords in title. Returns top 3."""
    try:
        result = (
            get_client()
            .table('tickets')
            .select('id, title, type, priority, resolution_notes, resolved_at')
            .eq('status', 'resolved')
            .order('resolved_at', desc=True)
            .limit(100)
            .execute()
        )
        tickets = result.data or []
        if not keywords:
            return tickets[:3]

        kw_lower = [k.lower() for k in keywords]

        def score(ticket: dict) -> int:
            title = (ticket.get('title') or '').lower()
            notes = (ticket.get('resolution_notes') or '').lower()
            return sum(1 for k in kw_lower if k in title or k in notes)

        scored = sorted(tickets, key=score, reverse=True)
        return [t for t in scored if score(t) > 0][:3]
    except Exception as e:
        print(f'[tools] query_similar_tickets failed: {e}')
        return []


def update_ticket_triage(
    ticket_id: str,
    priority: str,
    type_: str,
    sla_response_deadline: str,
    sla_resolution_deadline: str,
    notes: str = '',
) -> bool:
    """Update a ticket with triage classification, SLA deadlines, and status=acknowledged."""
    try:
        result = get_client().table('tickets').update({
            'priority': priority,
            'type': type_,
            'status': 'acknowledged',
            'acknowledged_at': datetime.utcnow().isoformat(),
            'sla_response_deadline': sla_response_deadline,
            'sla_resolution_deadline': sla_resolution_deadline,
            'triage_notes': notes,
        }).eq('id', ticket_id).execute()
        return bool(result.data)
    except Exception as e:
        print(f'[tools] update_ticket_triage failed: {e}')
        return False


# ── CHRONICLE tools ───────────────────────────────────────────────────────────

def query_submissions_summary(since_iso: str) -> list[dict]:
    """Count submissions by division and status created after since_iso."""
    try:
        result = (
            get_client()
            .table('submissions')
            .select('division, status')
            .gte('created_at', since_iso)
            .execute()
        )
        rows = result.data or []
        # Group by division + status client-side
        counts: dict[str, dict[str, int]] = {}
        for row in rows:
            div = row.get('division', 'unknown')
            status = row.get('status', 'unknown')
            counts.setdefault(div, {})
            counts[div][status] = counts[div].get(status, 0) + 1

        return [
            {'division': div, 'status': status, 'count': count}
            for div, statuses in counts.items()
            for status, count in statuses.items()
        ]
    except Exception as e:
        print(f'[tools] query_submissions_summary failed: {e}')
        return []


def query_pipeline_summary(since_iso: str | None = None) -> list[dict]:
    """Get pipeline entry counts and estimated values by division and stage."""
    try:
        query = get_client().table('pipeline_entries').select('division, stage, value_estimate')
        if since_iso:
            query = query.gte('created_at', since_iso)
        result = query.execute()
        rows = result.data or []

        # Group by division + stage client-side
        groups: dict[tuple, dict] = {}
        for row in rows:
            key = (row.get('division', 'unknown'), row.get('stage', 'unknown'))
            if key not in groups:
                groups[key] = {'count': 0, 'total_value': 0.0}
            groups[key]['count'] += 1
            groups[key]['total_value'] += float(row.get('value_estimate') or 0)

        return [
            {
                'division': key[0],
                'stage': key[1],
                'count': val['count'],
                'total_value_estimate': round(val['total_value'], 2),
            }
            for key, val in groups.items()
        ]
    except Exception as e:
        print(f'[tools] query_pipeline_summary failed: {e}')
        return []


def query_tickets_summary(since_iso: str | None = None) -> list[dict]:
    """Get ticket counts by priority and status."""
    try:
        query = get_client().table('tickets').select('priority, status')
        if since_iso:
            query = query.gte('created_at', since_iso)
        result = query.execute()
        rows = result.data or []

        counts: dict[tuple, int] = {}
        for row in rows:
            key = (row.get('priority', 'unknown'), row.get('status', 'unknown'))
            counts[key] = counts.get(key, 0) + 1

        return [
            {'priority': key[0], 'status': key[1], 'count': count}
            for key, count in counts.items()
        ]
    except Exception as e:
        print(f'[tools] query_tickets_summary failed: {e}')
        return []


# ── CURATOR tools ─────────────────────────────────────────────────────────────

def query_published_content_this_month(limit: int = 20) -> list[dict]:
    """Fetch content with status='published' from the start of the current month."""
    try:
        now = datetime.utcnow()
        start_of_month = datetime(now.year, now.month, 1).isoformat()
        result = (
            get_client()
            .table('content')
            .select('id, title, type, division, slug, metadata, published_at, created_at')
            .eq('status', 'published')
            .gte('published_at', start_of_month)
            .order('created_at', desc=True)
            .limit(limit)
            .execute()
        )
        return result.data or []
    except Exception as e:
        print(f'[tools] query_published_content_this_month failed: {e}')
        return []


def query_subscriber_segment_counts() -> list[dict]:
    """Get subscriber counts per list/segment."""
    try:
        result = (
            get_client()
            .table('subscribers')
            .select('list, status')
            .eq('status', 'active')
            .execute()
        )
        rows = result.data or []
        counts: dict[str, int] = {}
        for row in rows:
            lst = row.get('list', 'general')
            counts[lst] = counts.get(lst, 0) + 1
        return [{'list': lst, 'count': count} for lst, count in counts.items()]
    except Exception as e:
        print(f'[tools] query_subscriber_segment_counts failed (table may not exist): {e}')
        return []


def create_newsletter_approval(newsletter_data: dict) -> str | None:
    """Submit newsletter draft to approval_queue with action_type='send_newsletter'."""
    try:
        result = get_client().table('approval_queue').insert({
            'agent_name': 'CURATOR',
            'action_type': 'send_newsletter',
            'entity_type': 'newsletter',
            'entity_id': newsletter_data.get('month', 'monthly'),
            'title': f"Newsletter ready for review — {newsletter_data.get('subject_a', 'Monthly issue')}",
            'context': f"CURATOR selected {len(newsletter_data.get('selected_post_ids', []))} posts. "
                       f"Recommended segment: {newsletter_data.get('recommended_segment', 'all')}.",
            'payload': newsletter_data,
            'confidence': 85,
            'priority': 'normal',
            'status': 'pending',
        }).select('id').single().execute()
        return result.data.get('id') if result.data else None
    except Exception as e:
        print(f'[tools] create_newsletter_approval failed: {e}')
        return None
