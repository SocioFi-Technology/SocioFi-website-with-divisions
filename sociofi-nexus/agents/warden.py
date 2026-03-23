"""
WARDEN Agent — Triages support tickets: classifies, assigns, sets SLA, drafts client emails.
Triggered by POST /webhook/ticket whenever a new ticket is created.

Workflow:
1. Classify ticket type and assign priority (P1-P4)
2. Search for similar past tickets to find resolution hints
3. Determine SLA deadlines based on client plan + priority
4. Update the ticket record with classification
5. Draft a client acknowledgement email for human review
6. Log the triage action
"""

from agents.base import BaseAgent
from tools.supabase_tools import (
    query_similar_tickets,
    update_ticket_triage,
    create_approval_request,
    log_activity,
)
from typing import Any
from models import AgentRunResult
from datetime import datetime, timedelta


# SLA hours by plan: [response_hours, resolution_hours]
SLA_BY_PLAN: dict[str, dict[str, list[int]]] = {
    'enterprise': {'P1': [1, 4],   'P2': [4, 24],  'P3': [8, 72],   'P4': [24, 168]},
    'scale':      {'P1': [2, 6],   'P2': [8, 32],  'P3': [12, 96],  'P4': [24, 168]},
    'growth':     {'P1': [4, 12],  'P2': [12, 48], 'P3': [24, 120], 'P4': [48, 168]},
    'starter':    {'P1': [8, 24],  'P2': [24, 72], 'P3': [48, 168], 'P4': [72, 240]},
}


def _compute_sla_deadlines(plan: str, priority: str) -> tuple[str, str]:
    """Return ISO datetime strings for response and resolution deadlines."""
    plan_lower = plan.lower() if plan else 'starter'
    sla = SLA_BY_PLAN.get(plan_lower, SLA_BY_PLAN['starter'])
    hours = sla.get(priority, sla['P4'])
    now = datetime.utcnow()
    response_deadline = (now + timedelta(hours=hours[0])).isoformat()
    resolution_deadline = (now + timedelta(hours=hours[1])).isoformat()
    return response_deadline, resolution_deadline


WARDEN_SYSTEM_PROMPT = """You are WARDEN, the ticket triage agent for SocioFi Technology's Services division.

## Your Role
When a new support ticket arrives, you classify it, set priorities, search for similar past tickets,
and draft a professional client acknowledgement email.

Speed matters. Clients want to know they've been heard — even if the fix takes time.

## Classification Types
Assign ONE ticket type:
- 'bug': Something that worked before and no longer works
- 'feature': Request for new functionality
- 'security': Vulnerability, breach, or suspected security issue
- 'performance': App is slow, high latency, resource exhaustion
- 'incident': Full or partial outage, data loss, critical system failure

## Priority Rules
- P1 (Critical): Production is down, security breach confirmed, data loss occurring
  → Response: 1-8h (plan-dependent), Resolution: 4-24h
- P2 (High): Major feature broken, serious performance degradation affecting customers
  → Response: 4-24h, Resolution: 24-72h
- P3 (Medium): Non-critical bug, minor performance issue, workaround exists
  → Response: 8-48h, Resolution: 72-168h
- P4 (Low): Feature request, cosmetic issue, documentation request
  → Response: 24-72h, Resolution: 168-240h

Security tickets are always minimum P2. Incidents are always minimum P1.

## SLA by Client Plan
- Enterprise: P1[1h/4h], P2[4h/24h], P3[8h/72h], P4[24h/168h]
- Scale:      P1[2h/6h], P2[8h/32h], P3[12h/96h], P4[24h/168h]
- Growth:     P1[4h/12h], P2[12h/48h], P3[24h/120h], P4[48h/168h]
- Starter:    P1[8h/24h], P2[24h/72h], P3[48h/168h], P4[72h/240h]

## Client Email Guidelines
Draft an acknowledgement email that:
- Confirms we received their ticket (quote the title back to them)
- States the priority level and what that means in plain language
- Gives the specific response time commitment ("We'll respond within X hours")
- If similar past tickets were found, mention that we've seen this before and have experience fixing it
- Closes warmly — they're stressed, acknowledge it
- 100-150 words max. No corporate language.
- Subject: "We're on it — [Ticket Title] [#ID]"

## Engineer Routing
Route based on ticket type and mentioned technologies:
- Security tickets → senior engineer review first (assigned_to_name: 'Security Team')
- Database/data issues → assigned_to_name: 'Backend Team'
- Frontend/UI bugs → assigned_to_name: 'Frontend Team'
- Infrastructure/hosting → assigned_to_name: 'DevOps Team'
- General bugs → assigned_to_name: 'Engineering Team'
- Feature requests → assigned_to_name: 'Product Team'

Always draft the client email for human approval — NEVER auto-send ticket responses."""


WARDEN_TOOLS = [
    {
        "name": "query_similar_tickets",
        "description": "Search resolved past tickets with similar keywords to find resolution hints.",
        "input_schema": {
            "type": "object",
            "properties": {
                "keywords": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Keywords from the ticket title and description",
                },
            },
            "required": ["keywords"],
        },
    },
    {
        "name": "update_ticket",
        "description": "Classify and assign the ticket with priority, type, SLA deadlines, and routing.",
        "input_schema": {
            "type": "object",
            "properties": {
                "ticket_id": {"type": "string"},
                "priority": {
                    "type": "string",
                    "enum": ["P1", "P2", "P3", "P4"],
                    "description": "Priority level",
                },
                "type": {
                    "type": "string",
                    "enum": ["bug", "feature", "security", "performance", "incident"],
                },
                "assigned_to_name": {
                    "type": "string",
                    "description": "Team or engineer to assign to",
                },
                "sla_response_deadline": {
                    "type": "string",
                    "description": "ISO datetime for response SLA deadline",
                },
                "sla_resolution_deadline": {
                    "type": "string",
                    "description": "ISO datetime for resolution SLA deadline",
                },
                "classification_notes": {
                    "type": "string",
                    "description": "Brief reasoning for the classification decisions",
                },
            },
            "required": [
                "ticket_id",
                "priority",
                "type",
                "assigned_to_name",
                "sla_response_deadline",
                "sla_resolution_deadline",
            ],
        },
    },
    {
        "name": "create_client_email_draft",
        "description": "Create an acknowledgement email draft for human approval before sending.",
        "input_schema": {
            "type": "object",
            "properties": {
                "ticket_id": {"type": "string"},
                "client_email": {"type": "string"},
                "client_name": {"type": "string"},
                "ticket_title": {"type": "string"},
                "priority": {"type": "string", "enum": ["P1", "P2", "P3", "P4"]},
                "sla_response_hours": {
                    "type": "integer",
                    "description": "Number of hours for response commitment",
                },
                "email_subject": {"type": "string"},
                "email_body_html": {"type": "string", "description": "HTML email body"},
                "email_body_text": {"type": "string", "description": "Plain text version"},
                "similar_tickets_found": {
                    "type": "integer",
                    "description": "Number of similar past tickets found",
                },
            },
            "required": [
                "ticket_id",
                "client_email",
                "client_name",
                "ticket_title",
                "priority",
                "sla_response_hours",
                "email_subject",
                "email_body_html",
                "email_body_text",
            ],
        },
    },
    {
        "name": "log_warden_action",
        "description": "Log a triage action to the activity log.",
        "input_schema": {
            "type": "object",
            "properties": {
                "ticket_id": {"type": "string"},
                "action": {"type": "string", "description": "Action taken (e.g. 'classified_p1', 'routed_to_security')"},
                "details": {"type": "object", "description": "Additional details dict"},
            },
            "required": ["ticket_id", "action"],
        },
    },
]


class WardenAgent(BaseAgent):
    name = 'WARDEN'

    @property
    def system_prompt(self) -> str:
        return WARDEN_SYSTEM_PROMPT

    @property
    def tools(self) -> list[dict]:
        return WARDEN_TOOLS

    def execute_tool(self, tool_name: str, tool_input: dict[str, Any]) -> Any:
        if tool_name == 'query_similar_tickets':
            tickets = query_similar_tickets(tool_input['keywords'])
            return {'similar_tickets': tickets, 'count': len(tickets)}

        elif tool_name == 'update_ticket':
            success = update_ticket_triage(
                ticket_id=tool_input['ticket_id'],
                priority=tool_input['priority'],
                type_=tool_input['type'],
                sla_response_deadline=tool_input['sla_response_deadline'],
                sla_resolution_deadline=tool_input['sla_resolution_deadline'],
                notes=tool_input.get('classification_notes', ''),
            )
            # Also update assigned_to in the ticket record
            if success:
                try:
                    from tools.supabase_tools import get_client
                    get_client().table('tickets').update({
                        'assigned_to_name': tool_input['assigned_to_name'],
                    }).eq('id', tool_input['ticket_id']).execute()
                except Exception as e:
                    print(f'[WARDEN] Could not update assigned_to_name: {e}')
            return {'success': success}

        elif tool_name == 'create_client_email_draft':
            approval_id = create_approval_request(
                agent_name='WARDEN',
                action_type='send_email',
                entity_type='ticket',
                entity_id=tool_input['ticket_id'],
                title=f"Ticket acknowledgement: {tool_input['ticket_title']} ({tool_input['priority']})",
                context=f"WARDEN triaged a {tool_input['priority']} ticket. {tool_input['similar_tickets_found']} similar past tickets found.",
                payload={
                    'to': tool_input['client_email'],
                    'subject': tool_input['email_subject'],
                    'html': tool_input['email_body_html'],
                    'text': tool_input['email_body_text'],
                    'ticket_id': tool_input['ticket_id'],
                    'priority': tool_input['priority'],
                },
                confidence=85,
                priority='high' if tool_input['priority'] in ('P1', 'P2') else 'normal',
            )
            return {'approval_id': approval_id, 'success': bool(approval_id)}

        elif tool_name == 'log_warden_action':
            log_activity(
                action=f"agent.warden.{tool_input['action']}",
                entity_type='ticket',
                entity_id=tool_input['ticket_id'],
                details=tool_input.get('details', {}),
            )
            return {'logged': True}

        return {'error': f'Unknown tool: {tool_name}'}

    def triage_ticket(self, ticket_id: str, ticket_data: dict) -> AgentRunResult:
        """Main entry point: called by /webhook/ticket handler."""
        plan = ticket_data.get('client_plan', 'starter')
        priority_hint = ticket_data.get('priority')

        # Pre-compute SLA deadlines for reference (Claude will determine final priority)
        sla_by_priority = {}
        for p in ['P1', 'P2', 'P3', 'P4']:
            resp, resol = _compute_sla_deadlines(plan, p)
            sla_by_priority[p] = {'response': resp, 'resolution': resol}

        message = f"""Triage this new support ticket immediately.

Ticket ID: {ticket_id}
Title: {ticket_data.get('title', 'Untitled')}
Description: {ticket_data.get('description', 'No description provided')}
Client: {ticket_data.get('client_name', 'Unknown')} <{ticket_data.get('client_email', '')}>
Client Plan: {plan}
Reported severity (client's own assessment): {ticket_data.get('severity', 'not specified')}
App/Product: {ticket_data.get('product_name', 'N/A')}
Environment: {ticket_data.get('environment', 'production')}
Additional info: {ticket_data.get('additional_info', 'none')}

Pre-computed SLA deadlines for this client's plan ({plan}):
{chr(10).join(f"  {p}: respond by {v['response']}, resolve by {v['resolution']}" for p, v in sla_by_priority.items())}

Steps:
1. Search for similar past tickets (extract 3-5 keywords from the title/description)
2. Classify the ticket type and assign priority based on the rules
3. Call update_ticket with priority, type, assigned team, and the correct SLA deadlines from the list above
4. Draft a client acknowledgement email (100-150 words, warm and specific)
5. Call create_client_email_draft for human review
6. Log the triage action with key details

Be decisive. Don't hedge on priority — make a call."""

        result = self.run(message, context={'ticket_id': ticket_id, 'plan': plan})

        log_activity(
            action='agent.warden.ticket_triaged',
            entity_type='ticket',
            entity_id=ticket_id,
            details={
                'client_plan': plan,
                'tokens_used': result.tokens_used,
                'approvals_created': result.approvals_created,
                'duration_ms': result.duration_ms,
            },
        )

        return result
