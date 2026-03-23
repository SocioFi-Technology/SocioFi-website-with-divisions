"""
NEXUS Agent Server — FastAPI application
Receives webhooks from Next.js, triggers agents, exposes status endpoints.
"""
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Header
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import time
import uuid
from typing import Optional

from config import settings
from models import SubmissionWebhook, ApprovalWebhook, TriggerRequest, AgentRunResult

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


def verify_api_key(authorization: Optional[str] = Header(None)) -> None:
    """Verify Bearer token from Next.js."""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Missing Authorization header')
    token = authorization[len('Bearer '):]
    if token != settings.nexus_api_key:
        raise HTTPException(status_code=403, detail='Invalid API key')


def _record_run(result: AgentRunResult) -> None:
    _run_history.append(result.model_dump())
    # Keep last 1000 runs in memory
    if len(_run_history) > 1000:
        _run_history.pop(0)


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
            'INTAKE': {
                'status': 'idle',
                'total_runs': sum(1 for r in _run_history if r.get('agent') == 'INTAKE'),
            },
            'HERALD': {
                'status': 'idle',
                'total_runs': sum(1 for r in _run_history if r.get('agent') == 'HERALD'),
            },
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

    if payload.decision == 'approved' and approval.get('action_type') == 'send_email':
        def send_email():
            from agents.herald import HeraldAgent
            agent = HeraldAgent()
            run_result = AgentRunResult(
                agent='HERALD',
                status='success',
                input_summary=f'Dispatch approved email for approval {payload.approval_id}',
            )
            success = agent.dispatch_approved_email({**approval, 'decided_by': payload.decided_by})
            run_result.output_summary = 'Email sent' if success else 'Email send failed'
            _record_run(run_result)

        background_tasks.add_task(send_email)
        return {'accepted': True, 'message': 'HERALD queued to dispatch email'}

    elif payload.decision == 'edited' and payload.edited_payload:
        # Update the approval payload with edits, then send
        get_client().table('approval_queue').update(
            {'payload': payload.edited_payload}
        ).eq('id', payload.approval_id).execute()

        def send_edited():
            from agents.herald import HeraldAgent
            agent = HeraldAgent()
            updated_approval = {
                **approval,
                'payload': payload.edited_payload,
                'decided_by': payload.decided_by,
            }
            agent.dispatch_approved_email(updated_approval)

        background_tasks.add_task(send_edited)
        return {'accepted': True, 'message': 'HERALD queued to dispatch edited email'}

    elif payload.decision == 'discarded':
        update_approval_status(
            payload.approval_id,
            'discarded',
            discard_reason=payload.discard_reason,
        )
        return {'accepted': True, 'message': 'Approval discarded'}

    return {'accepted': True, 'message': f'Decision {payload.decision} recorded'}


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

    raise HTTPException(status_code=404, detail=f'Agent {agent_name_upper} not found')


@app.get('/agents/{agent_name}/runs', dependencies=[Depends(verify_api_key)])
async def get_agent_runs(agent_name: str, limit: int = 20):
    """Get run history for a specific agent."""
    agent_upper = agent_name.upper()
    runs = [r for r in reversed(_run_history) if r.get('agent') == agent_upper]
    return {'agent': agent_upper, 'runs': runs[:limit], 'total': len(runs)}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=settings.port, reload=settings.debug)
