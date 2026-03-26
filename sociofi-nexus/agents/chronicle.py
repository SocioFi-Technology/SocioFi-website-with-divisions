"""
CHRONICLE Agent — Generates digest and analytics reports for SocioFi founders.
Reports are sent directly via Resend (internal comms — no approval needed).

Celery tasks:
- Daily digest:    7:00 AM UTC
- Weekly report:   Monday 8:00 AM UTC
- Monthly report:  1st of month 6:00 AM UTC
"""

import resend
from agents.base import BaseAgent
from tools.supabase_tools import (
    query_submissions_summary,
    query_pipeline_summary,
    query_tickets_summary,
    log_activity,
)
from config import settings
from typing import Any
from models import AgentRunResult
from datetime import datetime, timedelta


def send_report_via_resend(to_emails: list[str], subject: str, html_body: str) -> bool:
    """Send a report email directly via Resend. Returns True on success."""
    if not settings.resend_api_key:
        print(f'[CHRONICLE] Resend not configured. Would send "{subject}" to {to_emails}')
        return False

    resend.api_key = settings.resend_api_key
    try:
        params: resend.Emails.SendParams = {
            'from': f'SocioFi NEXUS <{settings.resend_from_email}>',
            'to': to_emails,
            'subject': subject,
            'html': html_body,
        }
        resend.Emails.send(params)
        return True
    except Exception as e:
        print(f'[CHRONICLE] Resend error: {e}')
        return False


CHRONICLE_SYSTEM_PROMPT = """You are CHRONICLE, the analytics and reporting agent for SocioFi Technology.

## Your Role
You compile data from across the SocioFi platform and generate readable, actionable reports
for the founders (Arifur and Kamrul). These are internal reports — write them like a smart analyst
briefing the CEO, not like an automated system dump.

## Report Types

### Daily Digest (last 24h)
- New submissions by division
- Pipeline entries created
- Tickets opened/closed
- Agent runs summary
- Any critical items needing attention (P1 tickets open, pipeline deals at risk)
- "One thing to do today" — the single highest-priority action

### Weekly Report (last 7 days)
- Full metrics across all divisions with week-over-week comparison
- Pipeline health: value in each stage, deals progressed vs stalled
- Content performance: drafts created, approved, published
- Agent performance: runs, tokens used, approvals created
- Top 3 wins this week
- Top 3 things to watch next week

### Monthly Report (last 30 days)
- Comprehensive breakdown with trends
- Conversion funnel analysis
- Revenue pipeline value and movement
- Content and SEO progress
- Strategic insights: what's working, what needs attention
- Suggested priorities for next month

## Writing Style
- Lead each section with the most important number
- Use comparison where possible ("vs last week: +12%")
- Flag anything unusual (spike, drop, absence)
- "Things Needing Attention" section gets bold formatting
- Close with one recommended action for each major area

## Report Format
Generate clean HTML emails with:
- SocioFi header (navy-to-teal gradient bar)
- Summary stats row (big numbers in colored boxes)
- Per-section tables and bullet points
- Bold for critical items
- Footer with report timestamp and "NEXUS by SocioFi Technology"

Never include raw IDs or technical jargon. Write for a business founder, not a developer."""


CHRONICLE_TOOLS = [
    {
        "name": "query_submissions_summary",
        "description": "Get submission counts by division and status for a time range.",
        "input_schema": {
            "type": "object",
            "properties": {
                "since_iso": {
                    "type": "string",
                    "description": "ISO datetime string — fetch submissions created after this time",
                },
            },
            "required": ["since_iso"],
        },
    },
    {
        "name": "query_pipeline_summary",
        "description": "Get pipeline entry counts and estimated values by division and stage.",
        "input_schema": {
            "type": "object",
            "properties": {
                "since_iso": {
                    "type": "string",
                    "description": "Optional ISO datetime — if provided, only new entries since this time",
                },
            },
            "required": [],
        },
    },
    {
        "name": "query_tickets_summary",
        "description": "Get ticket counts by priority and status.",
        "input_schema": {
            "type": "object",
            "properties": {
                "since_iso": {
                    "type": "string",
                    "description": "Optional ISO datetime filter",
                },
            },
            "required": [],
        },
    },
    {
        "name": "query_agent_runs",
        "description": "Get a summary of NEXUS agent performance for the period.",
        "input_schema": {
            "type": "object",
            "properties": {
                "since_iso": {
                    "type": "string",
                    "description": "Optional ISO datetime filter",
                },
            },
            "required": [],
        },
    },
    {
        "name": "send_report_email",
        "description": "Send the compiled report directly via Resend (no approval required — internal only).",
        "input_schema": {
            "type": "object",
            "properties": {
                "to_emails": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Recipient email addresses",
                },
                "subject": {"type": "string", "description": "Email subject line"},
                "html_body": {"type": "string", "description": "Full HTML email body"},
                "report_type": {
                    "type": "string",
                    "enum": ["daily_digest", "weekly_report", "monthly_report"],
                },
            },
            "required": ["to_emails", "subject", "html_body", "report_type"],
        },
    },
]


class ChronicleAgent(BaseAgent):
    name = 'CHRONICLE'
    max_tokens = 16000  # HTML reports with stats tables need generous token budget

    @property
    def REPORT_RECIPIENTS(self) -> list[str]:
        return settings.chronicle_recipient_list

    @property
    def system_prompt(self) -> str:
        return CHRONICLE_SYSTEM_PROMPT

    @property
    def tools(self) -> list[dict]:
        return CHRONICLE_TOOLS

    def execute_tool(self, tool_name: str, tool_input: dict[str, Any]) -> Any:
        if tool_name == 'query_submissions_summary':
            data = query_submissions_summary(tool_input['since_iso'])
            return {'submissions_summary': data, 'count': len(data)}

        elif tool_name == 'query_pipeline_summary':
            data = query_pipeline_summary(tool_input.get('since_iso'))
            return {'pipeline_summary': data, 'count': len(data)}

        elif tool_name == 'query_tickets_summary':
            data = query_tickets_summary(tool_input.get('since_iso'))
            return {'tickets_summary': data, 'count': len(data)}

        elif tool_name == 'query_agent_runs':
            from tools.supabase_tools import get_client
            since_iso = tool_input.get('since_iso')
            try:
                query = (
                    get_client()
                    .table('nexus_agent_runs')
                    .select('agent, status, approvals_created, tokens_used, duration_ms, completed_at')
                    .order('completed_at', desc=True)
                    .limit(200)
                )
                if since_iso:
                    query = query.gte('completed_at', since_iso)
                rows = query.execute().data or []
                # Summarise by agent
                summary: dict[str, dict] = {}
                for row in rows:
                    agent = row.get('agent', 'unknown')
                    if agent not in summary:
                        summary[agent] = {'total': 0, 'success': 0, 'failed': 0, 'approvals': 0, 'tokens': 0}
                    summary[agent]['total'] += 1
                    if row.get('status') == 'success':
                        summary[agent]['success'] += 1
                    elif row.get('status') == 'failed':
                        summary[agent]['failed'] += 1
                    summary[agent]['approvals'] += row.get('approvals_created', 0) or 0
                    summary[agent]['tokens'] += row.get('tokens_used', 0) or 0
                return {'agent_runs_summary': summary, 'total_runs': len(rows), 'since': since_iso}
            except Exception as e:
                return {'agent_runs_summary': {}, 'error': str(e), 'since': since_iso}

        elif tool_name == 'send_report_email':
            to_emails = tool_input['to_emails']
            subject = tool_input['subject']
            html_body = tool_input['html_body']
            report_type = tool_input['report_type']

            success = send_report_via_resend(to_emails, subject, html_body)

            log_activity(
                action=f'agent.chronicle.{report_type}_sent',
                entity_type='report',
                entity_id=report_type,
                details={
                    'to': to_emails,
                    'subject': subject,
                    'sent': success,
                },
            )
            return {'sent': success, 'report_type': report_type, 'recipients': len(to_emails)}

        return {'error': f'Unknown tool: {tool_name}'}

    def _run_report(self, report_type: str, since_iso: str, period_label: str) -> AgentRunResult:
        """Internal helper — runs Claude with the right context for each report type."""
        now_iso = datetime.utcnow().isoformat()

        message = f"""Generate the SocioFi {report_type.replace('_', ' ').title()} and send it to the founders.

Report type: {report_type}
Period: {period_label}
Data range: {since_iso} → {now_iso}
Recipients: {', '.join(self.REPORT_RECIPIENTS)}

Steps:
1. Call query_submissions_summary (since_iso="{since_iso}")
2. Call query_pipeline_summary (since_iso="{since_iso}" for new entries)
3. Call query_tickets_summary (since_iso="{since_iso}")
4. Call query_agent_runs (since_iso="{since_iso}")
5. Compile all data into a {report_type} following the format guidelines
6. Generate clean HTML with:
   - Navy-to-teal gradient header bar
   - Summary stats row (big numbers in colored boxes: navy for submissions, teal for pipeline, amber for tickets)
   - Per-division breakdown
   - Agent performance section
   - "Things Needing Attention" bullets (bold)
   - Timestamp footer
7. Call send_report_email with the complete HTML

The email should read like a smart analyst briefing the CEO — lead with the most important number.
Flag any critical issues prominently."""

        result = self.run(message, context={'report_type': report_type, 'since_iso': since_iso})

        log_activity(
            action=f'agent.chronicle.{report_type}_run',
            entity_type='report',
            entity_id=report_type,
            details={
                'period': period_label,
                'tokens_used': result.tokens_used,
                'duration_ms': result.duration_ms,
            },
        )

        return result

    def generate_daily_digest(self) -> AgentRunResult:
        """Called by Celery daily at 7:00 AM UTC."""
        since = (datetime.utcnow() - timedelta(hours=24)).isoformat()
        return self._run_report('daily_digest', since, 'Last 24 hours')

    def generate_weekly_report(self) -> AgentRunResult:
        """Called by Celery every Monday at 8:00 AM UTC."""
        since = (datetime.utcnow() - timedelta(days=7)).isoformat()
        return self._run_report('weekly_report', since, 'Last 7 days')

    def generate_monthly_report(self) -> AgentRunResult:
        """Called by Celery on the 1st of each month at 6:00 AM UTC."""
        since = (datetime.utcnow() - timedelta(days=30)).isoformat()
        return self._run_report('monthly_report', since, 'Last 30 days')
