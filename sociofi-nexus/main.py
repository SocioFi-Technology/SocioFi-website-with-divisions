"""
NEXUS Agent Server — FastAPI application
Receives webhooks from Next.js, triggers agents, exposes status endpoints.
"""
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from typing import Optional, Any

from config import settings
from models import SubmissionWebhook, ApprovalWebhook, TriggerRequest, AgentRunResult


class TicketWebhook(BaseModel):
    ticket_id: str
    ticket_data: dict[str, Any]
    contact_id: str


app = FastAPI(
    title='SocioFi NEXUS Agent Server',
    description='AI agent coordination layer for the SocioFi admin panel',
    version='1.0.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# In-memory run history (replace with DB in production)
_run_history: list[dict] = []
_agent_start_time = time.time()

# All agents known to this server
ALL_AGENTS = ['INTAKE', 'HERALD', 'SCRIBE', 'COMPASS', 'WARDEN', 'CHRONICLE', 'CURATOR']


def verify_api_key(authorization: Optional[str] = Header(None)) -> None:
    """Verify Bearer token from Next.js."""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Missing Authorization header')
    token = authorization[len('Bearer '):]
    if token != settings.nexus_api_key:
        raise HTTPException(status_code=403, detail='Invalid API key')


def _record_run(result: AgentRunResult) -> None:
    run_dict = result.model_dump()
    _run_history.append(run_dict)
    # Keep last 200 runs in memory for /status endpoint
    if len(_run_history) > 200:
        _run_history.pop(0)
    # Persist to DB (non-blocking best-effort)
    try:
        from tools.supabase_tools import record_agent_run
        record_agent_run(run_dict)
    except Exception as e:
        print(f'[nexus] _record_run DB persist failed: {e}')


@app.get('/')
async def root():
    return {'service': 'NEXUS Agent Server', 'version': '1.0.0', 'status': 'ok'}


@app.get('/status')
async def status(_: None = Depends(verify_api_key)):
    """System status: uptime, agent health, recent runs."""
    from tools.supabase_tools import get_client

    db_healthy = False
    try:
        get_client().table('contacts').select('id').limit(1).execute()
        db_healthy = True
    except Exception:
        pass

    total_runs = len(_run_history)
    successful = sum(1 for r in _run_history if r.get('status') == 'success')

    return {
        'status': 'healthy' if db_healthy else 'degraded',
        'uptime_seconds': int(time.time() - _agent_start_time),
        'database': 'connected' if db_healthy else 'error',
        'agents': {
            name: {
                'status': 'idle',
                'total_runs': sum(1 for r in _run_history if r.get('agent') == name),
            }
            for name in ALL_AGENTS
        },
        'runs': {
            'total': total_runs,
            'success_rate': round(successful / total_runs * 100, 1) if total_runs else 0,
        },
        'recent_runs': _run_history[-5:],
    }


@app.post('/webhook/submission', dependencies=[Depends(verify_api_key)])
async def webhook_submission(payload: SubmissionWebhook, background_tasks: BackgroundTasks):
    """
    Receives submission webhooks from Next.js.
    Runs INTAKE agent in the background.
    Returns immediately so Next.js isn't blocked.
    """
    def run_intake():
        from agents.intake import IntakeAgent
        agent = IntakeAgent()
        result = agent.process_submission(
            submission_id=payload.submission_id,
            contact_id=payload.contact_id,
            type_=payload.type,
            division=payload.division,
            data=payload.data,
        )
        _record_run(result)

    background_tasks.add_task(run_intake)

    return {
        'accepted': True,
        'submission_id': payload.submission_id,
        'message': 'INTAKE agent queued',
    }


@app.post('/webhook/ticket', dependencies=[Depends(verify_api_key)])
async def webhook_ticket(payload: TicketWebhook, background_tasks: BackgroundTasks):
    """
    Receives new ticket events from the admin panel or external systems.
    Runs WARDEN agent to triage the ticket.
    Returns immediately — triage happens in the background.
    """
    def run_warden():
        from agents.warden import WardenAgent
        agent = WardenAgent()
        # Inject contact_id into ticket_data for context
        ticket_data = {**payload.ticket_data, 'contact_id': payload.contact_id}
        result = agent.triage_ticket(
            ticket_id=payload.ticket_id,
            ticket_data=ticket_data,
        )
        _record_run(result)

    background_tasks.add_task(run_warden)

    return {
        'accepted': True,
        'ticket_id': payload.ticket_id,
        'message': 'WARDEN triage queued',
    }


@app.post('/webhook/approval', dependencies=[Depends(verify_api_key)])
async def webhook_approval(payload: ApprovalWebhook, background_tasks: BackgroundTasks):
    """
    Receives approval decisions from the admin panel.
    For 'approved' email actions: HERALD dispatches via Resend.
    """
    from tools.supabase_tools import get_client, update_approval_status

    # Fetch the approval record
    result = (
        get_client()
        .table('approval_queue')
        .select('*')
        .eq('id', payload.approval_id)
        .maybe_single()
        .execute()
    )
    approval = result.data

    if not approval:
        raise HTTPException(status_code=404, detail='Approval not found')

    action_type = approval.get('action_type', '')
    approval_payload = approval.get('payload', {})

    if payload.decision == 'discarded':
        update_approval_status(
            payload.approval_id,
            'discarded',
            discard_reason=payload.discard_reason,
        )
        return {'accepted': True, 'message': 'Approval discarded'}

    # ── Apply edited payload before acting ─────────────────────────────────────
    if payload.decision == 'edited' and payload.edited_payload:
        get_client().table('approval_queue').update(
            {'payload': payload.edited_payload}
        ).eq('id', payload.approval_id).execute()
        approval_payload = payload.edited_payload

    # ── HERALD: send_email ─────────────────────────────────────────────────────
    if action_type == 'send_email':
        def send_email():
            from agents.herald import HeraldAgent
            agent = HeraldAgent()
            run_result = AgentRunResult(
                agent='HERALD',
                status='success',
                input_summary=f'Dispatch approved email for approval {payload.approval_id}',
            )
            merged = {**approval, 'payload': approval_payload, 'decided_by': payload.decided_by}
            success = agent.dispatch_approved_email(merged)
            run_result.output_summary = 'Email sent' if success else 'Email send failed'
            _record_run(run_result)

        background_tasks.add_task(send_email)
        return {'accepted': True, 'message': 'HERALD queued to dispatch email'}

    # ── COMPASS: update_pipeline ───────────────────────────────────────────────
    elif action_type == 'update_pipeline' and payload.decision in ('approved', 'edited'):
        recommendation_type = approval_payload.get('recommendation_type', '')
        pipeline_entry_id = approval_payload.get('pipeline_entry_id')
        contact_id = approval_payload.get('contact_id')
        recommended_action = approval_payload.get('recommended_action', '')

        if recommendation_type == 'send_followup':
            # Look up contact email, then queue HERALD to send the followup
            def send_compass_followup():
                from agents.herald import HeraldAgent
                from tools.supabase_tools import log_activity
                contact_result = get_client().table('contacts').select('email, name').eq('id', contact_id).maybe_single().execute()
                contact = contact_result.data or {}
                email = contact.get('email', '')
                name = contact.get('name', 'there')
                if not email:
                    print(f'[COMPASS approval] No email found for contact {contact_id}')
                    return
                # Build a minimal email from the recommended action text
                html_body = f'<p>Hi {name},</p><p>{recommended_action.replace(chr(10), "</p><p>")}</p>'
                agent = HeraldAgent()
                agent.dispatch_approved_email({
                    'id': payload.approval_id,
                    'decided_by': payload.decided_by,
                    'payload': {
                        'to': email,
                        'subject': f'Following up — SocioFi Technology',
                        'html': html_body,
                        'text': recommended_action,
                    },
                })
                log_activity(
                    action='agent.compass.followup_sent',
                    entity_type='pipeline_entry',
                    entity_id=pipeline_entry_id or approval_payload.get('pipeline_entry_id', ''),
                    details={'contact_id': contact_id, 'recommendation_type': recommendation_type},
                )

            background_tasks.add_task(send_compass_followup)
            update_approval_status(payload.approval_id, 'approved', decided_by=payload.decided_by)
            return {'accepted': True, 'message': 'HERALD queued to send COMPASS followup email'}

        elif recommendation_type == 'update_stage':
            # Advance the pipeline entry to the recommended next stage
            new_stage = approval_payload.get('new_stage') or approval_payload.get('recommended_stage')
            if pipeline_entry_id and new_stage:
                get_client().table('pipeline_entries').update(
                    {'stage': new_stage, 'updated_at': __import__('datetime').datetime.utcnow().isoformat()}
                ).eq('id', pipeline_entry_id).execute()
            update_approval_status(payload.approval_id, 'approved', decided_by=payload.decided_by)
            return {'accepted': True, 'message': f'Pipeline stage updated to {new_stage}'}

        elif recommendation_type == 'disqualify':
            if pipeline_entry_id:
                get_client().table('pipeline_entries').update(
                    {'stage': 'closed_lost', 'updated_at': __import__('datetime').datetime.utcnow().isoformat()}
                ).eq('id', pipeline_entry_id).execute()
            update_approval_status(payload.approval_id, 'approved', decided_by=payload.decided_by)
            return {'accepted': True, 'message': 'Pipeline entry marked closed_lost'}

        elif recommendation_type == 'escalate':
            # Flag the pipeline entry for urgent human attention
            if pipeline_entry_id:
                current = get_client().table('pipeline_entries').select('notes').eq('id', pipeline_entry_id).maybe_single().execute()
                current_notes = (current.data or {}).get('notes') or {}
                get_client().table('pipeline_entries').update({
                    'notes': {**current_notes, 'escalated': True, 'escalation_reason': recommended_action},
                    'updated_at': __import__('datetime').datetime.utcnow().isoformat(),
                }).eq('id', pipeline_entry_id).execute()
            update_approval_status(payload.approval_id, 'approved', decided_by=payload.decided_by)
            return {'accepted': True, 'message': 'Pipeline entry escalated'}

        # Fallback for other recommendation types
        update_approval_status(payload.approval_id, 'approved', decided_by=payload.decided_by)
        return {'accepted': True, 'message': f'COMPASS recommendation recorded: {recommendation_type}'}

    # ── SCRIBE: content_draft publish ──────────────────────────────────────────
    elif action_type == 'content_draft' and payload.decision in ('approved', 'edited'):
        post_id = approval_payload.get('post_id')
        if post_id:
            from datetime import datetime as _dt
            get_client().table('cms_posts').update({
                'status': 'published',
                'published_at': _dt.utcnow().isoformat(),
            }).eq('id', post_id).execute()
        update_approval_status(payload.approval_id, 'approved', decided_by=payload.decided_by)
        return {'accepted': True, 'message': f'Post {post_id} published'}

    # ── CURATOR: send_newsletter ────────────────────────────────────────────────
    elif action_type == 'send_newsletter' and payload.decision in ('approved', 'edited'):
        def send_newsletter():
            from tools.supabase_tools import get_client as _gc, log_activity
            import resend as _resend
            from config import settings as _settings

            subject = approval_payload.get('subject_a', 'SocioFi Monthly Newsletter')
            editorial = approval_payload.get('editorial', '')
            selected_ids = approval_payload.get('selected_post_ids', [])
            segment = approval_payload.get('recommended_segment', 'all')

            # Fetch selected posts
            posts: list[dict] = []
            if selected_ids:
                result = _gc().table('cms_posts').select('title, slug, excerpt, division').in_('id', selected_ids).execute()
                posts = result.data or []

            # Build minimal HTML newsletter body
            site_url = _settings.site_url
            posts_html = '\n'.join(
                f'<li><a href="{site_url}/blog/{p.get("slug", "")}">{p.get("title", "")}</a>'
                f'<br><small>{p.get("excerpt", "")[:120]}</small></li>'
                for p in posts
            )
            html_body = (
                f'<p>{editorial}</p>'
                f'<ul>{posts_html}</ul>'
                f'<p><small><a href="{site_url}/unsubscribe">Unsubscribe</a></small></p>'
            )

            # Fetch subscribers for the target segment
            sub_query = _gc().table('subscribers').select('email').eq('status', 'active')
            if segment != 'all':
                sub_query = sub_query.eq('list', segment)
            sub_result = sub_query.execute()
            subscribers_list = [r['email'] for r in (sub_result.data or []) if r.get('email')]

            if not subscribers_list:
                print(f'[CURATOR] No active subscribers for segment={segment}')
                return

            if not _settings.resend_api_key:
                print(f'[CURATOR] Resend not configured — would send to {len(subscribers_list)} subscribers')
                return

            _resend.api_key = _settings.resend_api_key
            # Send in batches of 50 (Resend free tier limit)
            batch_size = 50
            sent = 0
            for i in range(0, len(subscribers_list), batch_size):
                batch = subscribers_list[i:i + batch_size]
                try:
                    _resend.Emails.send({
                        'from': f'SocioFi Technology <{_settings.resend_from_email}>',
                        'bcc': batch,
                        'to': _settings.resend_from_email,  # required 'to' when using bcc
                        'subject': subject,
                        'html': html_body,
                    })
                    sent += len(batch)
                except Exception as e:
                    print(f'[CURATOR] Resend batch failed: {e}')

            # Mark newsletter_issues row as sent
            try:
                _gc().table('newsletter_issues').update({
                    'status': 'sent',
                    'sent_at': __import__('datetime').datetime.utcnow().isoformat(),
                }).eq('approval_id', payload.approval_id).execute()
            except Exception:
                pass

            log_activity(
                action='agent.curator.newsletter_sent',
                entity_type='newsletter',
                entity_id=payload.approval_id,
                details={'subject': subject, 'sent_count': sent, 'segment': segment},
            )

        background_tasks.add_task(send_newsletter)
        update_approval_status(payload.approval_id, 'approved', decided_by=payload.decided_by)
        return {'accepted': True, 'message': 'Newsletter send queued'}

    # ── Fallback ───────────────────────────────────────────────────────────────
    update_approval_status(payload.approval_id, 'approved', decided_by=payload.decided_by)
    return {'accepted': True, 'message': f'Decision {payload.decision} recorded for {action_type}'}


@app.post('/trigger/{agent_name}', dependencies=[Depends(verify_api_key)])
async def trigger_agent(
    agent_name: str,
    request: TriggerRequest,
    background_tasks: BackgroundTasks,
):
    """Manual agent trigger from admin panel."""
    agent_name_upper = agent_name.upper()

    if agent_name_upper == 'INTAKE':
        submission_id = request.data.get('submission_id')
        if not submission_id:
            raise HTTPException(status_code=400, detail='submission_id required for INTAKE')

        def run():
            from agents.intake import IntakeAgent
            agent = IntakeAgent()
            result = agent.process_submission(
                submission_id=str(submission_id),
                contact_id=str(request.data.get('contact_id', '')),
                type_=str(request.data.get('type', 'manual')),
                division=str(request.data.get('division', 'parent')),
                data=dict(request.data),
            )
            _record_run(result)

        background_tasks.add_task(run)
        return {'triggered': True, 'agent': 'INTAKE', 'reason': request.reason}

    elif agent_name_upper == 'HERALD':
        def run():
            from agents.herald import HeraldAgent
            agent = HeraldAgent()
            result = agent.process_due_followups()
            _record_run(result)

        background_tasks.add_task(run)
        return {'triggered': True, 'agent': 'HERALD', 'reason': request.reason}

    elif agent_name_upper == 'SCRIBE':
        def run():
            from agents.scribe import ScribeAgent
            agent = ScribeAgent()
            content_type = str(request.data.get('content_type', 'blog_post'))
            topic = str(request.data.get('topic', 'SocioFi services'))
            division = str(request.data.get('division', 'parent'))
            result = agent.generate_content(
                content_type=content_type,
                topic=topic,
                division=division,
                additional_context=dict(request.data),
            )
            _record_run(result)

        background_tasks.add_task(run)
        return {'triggered': True, 'agent': 'SCRIBE', 'reason': request.reason}

    elif agent_name_upper == 'COMPASS':
        def run():
            from agents.compass import CompassAgent
            agent = CompassAgent()
            division = request.data.get('division')
            result = agent.analyze_pipeline(division=division)
            _record_run(result)

        background_tasks.add_task(run)
        return {'triggered': True, 'agent': 'COMPASS', 'reason': request.reason}

    elif agent_name_upper == 'WARDEN':
        ticket_id = request.data.get('ticket_id')
        if not ticket_id:
            raise HTTPException(status_code=400, detail='ticket_id required for WARDEN')

        def run():
            from agents.warden import WardenAgent
            agent = WardenAgent()
            result = agent.triage_ticket(
                ticket_id=str(ticket_id),
                ticket_data=dict(request.data),
            )
            _record_run(result)

        background_tasks.add_task(run)
        return {'triggered': True, 'agent': 'WARDEN', 'reason': request.reason}

    elif agent_name_upper == 'CHRONICLE':
        def run():
            from agents.chronicle import ChronicleAgent
            agent = ChronicleAgent()
            report_type = str(request.data.get('report_type', 'daily_digest'))
            if report_type == 'weekly_report':
                result = agent.generate_weekly_report()
            elif report_type == 'monthly_report':
                result = agent.generate_monthly_report()
            else:
                result = agent.generate_daily_digest()
            _record_run(result)

        background_tasks.add_task(run)
        return {'triggered': True, 'agent': 'CHRONICLE', 'reason': request.reason}

    elif agent_name_upper == 'CURATOR':
        def run():
            from agents.curator import CuratorAgent
            agent = CuratorAgent()
            result = agent.prepare_newsletter()
            _record_run(result)

        background_tasks.add_task(run)
        return {'triggered': True, 'agent': 'CURATOR', 'reason': request.reason}

    raise HTTPException(status_code=404, detail=f'Agent {agent_name_upper} not found. Available: {", ".join(ALL_AGENTS)}')


@app.get('/agents/{agent_name}/runs', dependencies=[Depends(verify_api_key)])
async def get_agent_runs(agent_name: str, limit: int = 20):
    """Get run history for a specific agent."""
    agent_upper = agent_name.upper()
    runs = [r for r in reversed(_run_history) if r.get('agent') == agent_upper]
    return {'agent': agent_upper, 'runs': runs[:limit], 'total': len(runs)}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=settings.port, reload=settings.debug)
