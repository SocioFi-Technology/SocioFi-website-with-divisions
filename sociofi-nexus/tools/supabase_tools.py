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
