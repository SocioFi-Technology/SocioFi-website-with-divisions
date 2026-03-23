"""
COMPASS Agent — Revenue intelligence: finds stale leads and recommends pipeline actions.
Runs every 2 hours via Celery to surface opportunities going cold.

Workflow:
1. Query pipeline for entries overdue per stage thresholds
2. Analyze each stale entry with contact history
3. Generate specific action recommendations
4. Submit recommendations to approval_queue for human review
"""

from agents.base import BaseAgent
from tools.supabase_tools import (
    query_stale_pipeline_entries,
    query_contact_with_submissions,
    create_approval_request,
    log_activity,
)
from typing import Any
from models import AgentRunResult


# Days a lead can sit in each stage before COMPASS flags it
STAGE_THRESHOLDS: dict[str, dict[str, int]] = {
    'studio': {
        'discovery': 2,
        'review': 5,
        'discovery_call': 3,
        'scoping': 5,
        'proposal_sent': 7,
        'negotiation': 5,
    },
    'services': {
        'discovery': 2,
        'review': 1,
        'audit_scheduled': 7,
        'active': 0,
    },
    'ventures': {
        'received': 3,
        'screening': 7,
        'deep_review': 14,
    },
    'academy': {
        'enrolled': 1,
    },
    'cloud': {
        'discovery': 2,
        'setup': 14,
    },
    'agents': {
        'discovery': 2,
        'consultation': 7,
    },
}


COMPASS_SYSTEM_PROMPT = """You are COMPASS, the revenue intelligence agent for SocioFi Technology.

## Your Role
You analyze the sales pipeline to find opportunities at risk — leads that have gone quiet,
high-value deals that need a nudge, or contacts who've slipped through the cracks.

Your output is concrete action recommendations that the SocioFi team can approve and act on.
You are not a scheduler — you surface intelligence and tell humans what to do next.

## Stage Thresholds
Each division has stage thresholds (days). A lead sitting longer than the threshold is flagged:

Studio: discovery=2d, review=5d, discovery_call=3d, scoping=5d, proposal_sent=7d, negotiation=5d
Services: discovery=2d, review=1d, audit_scheduled=7d
Ventures: received=3d, screening=7d, deep_review=14d
Academy: enrolled=1d
Cloud: discovery=2d, setup=14d
Agents: discovery=2d, consultation=7d

## Recommendation Types
- 'send_followup': draft a follow-up email to re-engage
- 'escalate': flag for immediate human attention (high-value deal at risk)
- 'disqualify': recommend removing from pipeline (cold, unresponsive > 2x threshold)
- 'schedule_call': recommend booking a discovery/check-in call
- 'update_stage': recommend moving to a different stage based on inactivity pattern

## Urgency Levels
- 'critical': 3x+ over threshold OR deal value > $10K
- 'high': 2x over threshold OR deal value $5K-$10K
- 'normal': 1-2x over threshold

## Your Reasoning
For each flagged entry, explain:
- Why it's flagged (how long vs threshold)
- What the contact's situation is (from submission history)
- What specifically you recommend and why
- What the recommended message/action should say

Be direct. No vague suggestions like "follow up somehow". Give the team the exact words
or the exact action."""


COMPASS_TOOLS = [
    {
        "name": "query_pipeline",
        "description": "Fetch pipeline entries that have been stuck in a stage longer than expected.",
        "input_schema": {
            "type": "object",
            "properties": {
                "division": {
                    "type": "string",
                    "description": "Optional: filter by division (studio, services, ventures, academy, cloud, agents)",
                },
                "stage": {
                    "type": "string",
                    "description": "Optional: filter by specific stage",
                },
                "min_days_in_stage": {
                    "type": "integer",
                    "description": "Minimum days since last update to include (default: 1)",
                },
            },
            "required": [],
        },
    },
    {
        "name": "query_contact",
        "description": "Get full contact details plus submission history for a specific contact.",
        "input_schema": {
            "type": "object",
            "properties": {
                "contact_id": {"type": "string", "description": "Contact UUID"},
            },
            "required": ["contact_id"],
        },
    },
    {
        "name": "create_compass_recommendation",
        "description": "Submit a pipeline action recommendation for human review and approval.",
        "input_schema": {
            "type": "object",
            "properties": {
                "contact_id": {"type": "string"},
                "pipeline_entry_id": {"type": "string"},
                "recommendation_type": {
                    "type": "string",
                    "enum": ["send_followup", "escalate", "disqualify", "schedule_call", "update_stage"],
                },
                "recommended_action": {
                    "type": "string",
                    "description": "Specific action text — what exactly should happen (email copy, call agenda, etc.)",
                },
                "reasoning": {
                    "type": "string",
                    "description": "Why COMPASS is making this recommendation",
                },
                "urgency": {
                    "type": "string",
                    "enum": ["critical", "high", "normal"],
                },
            },
            "required": [
                "contact_id",
                "pipeline_entry_id",
                "recommendation_type",
                "recommended_action",
                "reasoning",
                "urgency",
            ],
        },
    },
]


class CompassAgent(BaseAgent):
    name = 'COMPASS'

    @property
    def system_prompt(self) -> str:
        return COMPASS_SYSTEM_PROMPT

    @property
    def tools(self) -> list[dict]:
        return COMPASS_TOOLS

    def execute_tool(self, tool_name: str, tool_input: dict[str, Any]) -> Any:
        if tool_name == 'query_pipeline':
            entries = query_stale_pipeline_entries(
                min_days=tool_input.get('min_days_in_stage', 1),
                division=tool_input.get('division'),
            )
            # Attach stage threshold context so Claude can reason about urgency
            enriched = []
            for entry in entries:
                div = entry.get('division', '')
                stage = entry.get('stage', '')
                threshold = STAGE_THRESHOLDS.get(div, {}).get(stage, 3)
                enriched.append({
                    **entry,
                    'stage_threshold_days': threshold,
                })
            return {'pipeline_entries': enriched, 'count': len(enriched)}

        elif tool_name == 'query_contact':
            contact = query_contact_with_submissions(tool_input['contact_id'])
            return contact or {'error': 'Contact not found'}

        elif tool_name == 'create_compass_recommendation':
            approval_id = create_approval_request(
                agent_name='COMPASS',
                action_type='update_pipeline',
                entity_type='pipeline_entry',
                entity_id=tool_input['pipeline_entry_id'],
                title=f"COMPASS: {tool_input['recommendation_type'].replace('_', ' ').title()} — {tool_input['urgency'].upper()} urgency",
                context=tool_input['reasoning'],
                payload={
                    'contact_id': tool_input['contact_id'],
                    'pipeline_entry_id': tool_input['pipeline_entry_id'],
                    'recommendation_type': tool_input['recommendation_type'],
                    'recommended_action': tool_input['recommended_action'],
                    'urgency': tool_input['urgency'],
                },
                confidence=75,
                priority='high' if tool_input['urgency'] in ('critical', 'high') else 'normal',
            )
            return {'approval_id': approval_id, 'success': bool(approval_id)}

        return {'error': f'Unknown tool: {tool_name}'}

    def analyze_pipeline(self, division: str | None = None) -> AgentRunResult:
        """Main entry point: called by Celery every 2 hours."""
        thresholds_summary = '\n'.join(
            f"  {div}: {', '.join(f'{stage}={days}d' for stage, days in stages.items())}"
            for div, stages in STAGE_THRESHOLDS.items()
        )

        division_clause = f"Focus on the '{division}' division only." if division else "Analyze all divisions."

        message = f"""Analyze the SocioFi sales pipeline for stale or at-risk opportunities.

{division_clause}

Stage thresholds (flag leads stuck longer than these):
{thresholds_summary}

Steps:
1. Call query_pipeline to fetch entries that have been in their current stage for 1+ days
2. For each flagged entry, call query_contact to understand the full context
3. Apply the stage thresholds: calculate urgency based on how far over threshold they are
   - 1-2x over threshold: normal
   - 2-3x over threshold: high
   - 3x+ over threshold OR value > $10K: critical
4. For each stale entry, call create_compass_recommendation with:
   - Specific recommended action (not vague — actual email copy or call agenda)
   - Your reasoning
   - Urgency level
5. Skip entries where the contact has already responded in the last 24h
6. Limit to 10 recommendations per run to avoid overwhelming the team

Focus on the highest-value opportunities first."""

        result = self.run(message, context={'division': division})

        log_activity(
            action='agent.compass.pipeline_analyzed',
            entity_type='pipeline',
            entity_id=division or 'all',
            details={
                'tokens_used': result.tokens_used,
                'approvals_created': result.approvals_created,
                'duration_ms': result.duration_ms,
            },
        )

        return result
