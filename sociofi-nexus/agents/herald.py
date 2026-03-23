"""
HERALD Agent — Manages email sequences: welcome, follow-ups, status updates.
Runs on a Celery schedule (every 6 hours) to check for due follow-ups.
Also handles approved email dispatch.
"""

import resend
from agents.base import BaseAgent
from tools.supabase_tools import (
    get_due_followups,
    mark_followup_sent,
    get_pending_approvals,
    update_approval_status,
    query_submission,
    log_activity,
)
from config import settings
from jinja2 import Environment, FileSystemLoader
import os
from typing import Any
from models import AgentRunResult
import json


def get_jinja_env() -> Environment:
    templates_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates')
    return Environment(loader=FileSystemLoader(templates_dir), autoescape=True)


def send_email_via_resend(to: str, subject: str, html: str, text: str = '') -> bool:
    """Send an email using Resend. Returns True on success."""
    if not settings.resend_api_key:
        print(f'[HERALD] Resend not configured. Would send to {to}: {subject}')
        return False

    resend.api_key = settings.resend_api_key
    try:
        params: resend.Emails.SendParams = {
            'from': f'SocioFi Technology <{settings.resend_from_email}>',
            'to': [to],
            'subject': subject,
            'html': html,
            'text': text or '',
        }
        resend.Emails.send(params)
        return True
    except Exception as e:
        print(f'[HERALD] Resend error: {e}')
        return False


HERALD_SYSTEM_PROMPT = """You are HERALD, the email communications agent for SocioFi Technology.
You manage outbound email sequences: welcome emails, nurture sequences, follow-ups, and status updates.

Your job:
1. Review the list of due follow-ups
2. For each follow-up, decide if it should be sent or skipped (e.g., if the lead converted)
3. Draft the email content using the appropriate template

Write emails that are:
- Personal: reference their specific product/company/situation
- Brief: 100-150 words for follow-ups, 150-200 for welcome
- Clear CTA: one specific next step
- Human-sounding: not corporate, not pushy
"""

HERALD_TOOLS = [
    {
        "name": "send_followup_email",
        "description": "Send a follow-up email for a scheduled followup entry.",
        "input_schema": {
            "type": "object",
            "properties": {
                "followup_id": {"type": "string"},
                "to_email": {"type": "string"},
                "subject": {"type": "string"},
                "html_body": {"type": "string"},
            },
            "required": ["followup_id", "to_email", "subject", "html_body"],
        },
    },
    {
        "name": "skip_followup",
        "description": "Skip a scheduled followup (contact already converted or requested no contact).",
        "input_schema": {
            "type": "object",
            "properties": {
                "followup_id": {"type": "string"},
                "reason": {"type": "string"},
            },
            "required": ["followup_id", "reason"],
        },
    },
]


class HeraldAgent(BaseAgent):
    name = 'HERALD'

    @property
    def system_prompt(self) -> str:
        return HERALD_SYSTEM_PROMPT

    @property
    def tools(self) -> list[dict]:
        return HERALD_TOOLS

    def execute_tool(self, tool_name: str, tool_input: dict[str, Any]) -> Any:
        if tool_name == 'send_followup_email':
            success = send_email_via_resend(
                to=tool_input['to_email'],
                subject=tool_input['subject'],
                html=tool_input['html_body'],
            )
            if success:
                mark_followup_sent(tool_input['followup_id'])
            return {'sent': success, 'followup_id': tool_input['followup_id']}

        elif tool_name == 'skip_followup':
            from tools.supabase_tools import get_client
            get_client().table('followup_schedule').update({
                'status': 'skipped',
            }).eq('id', tool_input['followup_id']).execute()
            return {'skipped': True}

        return {'error': f'Unknown tool: {tool_name}'}

    def process_due_followups(self) -> AgentRunResult:
        """Called by Celery every 6 hours to process due follow-ups."""
        followups = get_due_followups()

        if not followups:
            return AgentRunResult(
                agent=self.name,
                status='success',
                input_summary='No due follow-ups',
                output_summary='Nothing to send',
            )

        message = f"""Process these {len(followups)} due follow-ups:\n\n"""
        for f in followups:
            contact = f.get('contacts') or {}
            message += f"""Follow-up ID: {f['id']}
Contact: {contact.get('name', 'Unknown')} <{contact.get('email', '?')}>
Company: {contact.get('company', 'N/A')}
Sequence: {f['sequence_type']} / Step {f['step_number']}
Template: {f['template_name']}
Scheduled for: {f['scheduled_for']}\n\n"""

        return self.run(message)

    def dispatch_approved_email(self, approval: dict) -> bool:
        """Send an email that was approved in the admin panel."""
        payload = approval.get('payload', {})
        to = payload.get('to', '')
        subject = payload.get('subject', '')
        html = payload.get('html', '')
        text = payload.get('text', '')

        if not (to and subject and html):
            print('[HERALD] dispatch_approved_email: missing required fields in payload')
            return False

        success = send_email_via_resend(to=to, subject=subject, html=html, text=text)

        if success:
            update_approval_status(
                approval['id'],
                'approved',
                decided_by=approval.get('decided_by'),
            )
            log_activity(
                action='agent.herald.email_sent',
                entity_type='approval_queue',
                entity_id=approval['id'],
                details={'to': to, 'subject': subject},
            )

        return success
