"""
INTAKE Agent — Classifies, scores, and routes incoming form submissions.
Triggered by POST /webhook/submission from Next.js.

Workflow:
1. Fetch submission + contact from Supabase
2. Claude analyzes with these tools:
   - query_contact: check for duplicates / history
   - update_submission_ai: store classification, score, tags
   - update_contact: update tags, lifecycle stage
   - create_pipeline_entry: for qualified leads
   - create_approval_request: for drafting a response email
3. Returns summary of actions taken
"""

from agents.base import BaseAgent
from tools.supabase_tools import (
    query_contact_by_email,
    query_submission,
    update_submission_ai,
    update_contact_tags_and_score,
    create_pipeline_entry,
    create_approval_request,
    log_activity,
    schedule_followup,
)
from typing import Any


INTAKE_SYSTEM_PROMPT = """You are INTAKE, the lead qualification and routing agent for SocioFi Technology.

## Your Role
You receive incoming form submissions from the SocioFi website and:
1. Classify the submission type and intent
2. Score the lead quality (0-100)
3. Extract relevant tags
4. Update the contact's lifecycle stage if appropriate
5. Create a pipeline entry for qualified leads
6. Draft a personalized response email for human approval

## SocioFi Context
SocioFi Technology is an AI-agent-native software development company.
We build and deploy AI agents for clients, maintain live software, train teams, and invest in AI startups.

Divisions:
- Studio: custom software development, AI-powered builds, rescue ship (fixing broken AI-generated code)
- Services: ongoing software maintenance (monitoring, bug fixes, features)
- Agents: AI agent deployment for clients (automating workflows)
- Academy: courses, workshops, SCARL cohort accelerator
- Ventures: equity/revenue-share investments in AI-first startups
- Cloud: managed hosting, cloud migration, DevOps
- Labs: research, open source, experiments

## Lead Scoring Criteria (0-100)
- Budget signal (mentioned specific budget $10K+): +20 points
- Clear use case described: +15 points
- Paying validation (for Ventures): +20 points
- Company/product mentioned: +10 points
- Timeline urgency: +10 points
- Technical specificity (knows their stack): +10 points
- Referral/repeat contact: +15 points
- Free-tier or newsletter only: -20 points

## Classification Values
ai_classification should be ONE of:
  'qualified_lead' | 'newsletter_only' | 'partnership_inquiry' | 'careers' |
  'enterprise_prospect' | 'startup_application' | 'course_enrollment' |
  'high_value_project' | 'rescue_ship' | 'ongoing_services' | 'agent_deployment'

## Tag Guidelines
Add relevant tags: tech stack (nextjs, react, python, etc.), industry, intent, budget tier,
urgency level, team size, problem type (broken-code, scaling, automation, etc.)

## Pipeline Entry Rules
Create a pipeline entry when score >= 40 AND type is not newsletter/careers.
- studio → stage 'discovery'
- services → stage 'discovery'
- ventures → stage 'received'
- academy (paid) → stage 'enrolled'
- agents → stage 'discovery'
- cloud → stage 'discovery'

## Email Draft Guidelines
Draft a personalized response email that:
- Acknowledges their specific situation (mention their product/company by name)
- Explains what SocioFi can do for them specifically
- Sets clear next steps (book a call, review proposal, etc.)
- Is warm but professional, 150-200 words
- Subject line is compelling and specific

Always create an approval request for the email draft — humans review before sending."""


INTAKE_TOOLS = [
    {
        "name": "query_contact",
        "description": "Fetch a contact record by email to check submission history, existing tags, and lifecycle stage.",
        "input_schema": {
            "type": "object",
            "properties": {
                "email": {"type": "string", "description": "Contact email address"},
            },
            "required": ["email"],
        },
    },
    {
        "name": "update_submission_ai",
        "description": "Store AI classification results on the submission record.",
        "input_schema": {
            "type": "object",
            "properties": {
                "submission_id": {"type": "string"},
                "ai_classification": {
                    "type": "string",
                    "description": "Classification from the allowed values list",
                },
                "ai_score": {
                    "type": "integer",
                    "description": "Lead quality score 0-100",
                },
                "ai_tags": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Relevant tags to apply",
                },
            },
            "required": ["submission_id", "ai_classification", "ai_score", "ai_tags"],
        },
    },
    {
        "name": "update_contact",
        "description": "Add tags to a contact and optionally update their lifecycle stage.",
        "input_schema": {
            "type": "object",
            "properties": {
                "contact_id": {"type": "string"},
                "tags_to_add": {"type": "array", "items": {"type": "string"}},
                "new_lifecycle_stage": {
                    "type": "string",
                    "enum": ["lead", "qualified", "opportunity", "client", "churned"],
                    "description": "Optional: update lifecycle stage",
                },
            },
            "required": ["contact_id", "tags_to_add"],
        },
    },
    {
        "name": "create_pipeline_entry",
        "description": "Create a sales pipeline entry for a qualified lead.",
        "input_schema": {
            "type": "object",
            "properties": {
                "contact_id": {"type": "string"},
                "submission_id": {"type": "string"},
                "division": {"type": "string"},
                "stage": {"type": "string"},
                "value_estimate": {
                    "type": "number",
                    "description": "Estimated deal value in USD, or null",
                },
            },
            "required": ["contact_id", "submission_id", "division", "stage"],
        },
    },
    {
        "name": "create_approval_request",
        "description": "Create an approval request for a drafted email. The human reviews and approves before it's sent.",
        "input_schema": {
            "type": "object",
            "properties": {
                "entity_id": {
                    "type": "string",
                    "description": "The submission_id this email responds to",
                },
                "title": {
                    "type": "string",
                    "description": "Short title for the approval item",
                },
                "context": {
                    "type": "string",
                    "description": "Why this email is being drafted",
                },
                "email_to": {"type": "string", "description": "Recipient email"},
                "email_subject": {"type": "string"},
                "email_body_html": {
                    "type": "string",
                    "description": "Full HTML email body",
                },
                "email_body_text": {"type": "string", "description": "Plain text version"},
                "confidence": {
                    "type": "integer",
                    "description": "0-100 confidence in this draft",
                },
            },
            "required": [
                "entity_id",
                "title",
                "context",
                "email_to",
                "email_subject",
                "email_body_html",
                "email_body_text",
            ],
        },
    },
    {
        "name": "schedule_followup",
        "description": "Schedule a follow-up email sequence for HERALD to send later.",
        "input_schema": {
            "type": "object",
            "properties": {
                "contact_id": {"type": "string"},
                "submission_id": {"type": "string"},
                "sequence_type": {
                    "type": "string",
                    "enum": ["welcome", "nurture", "followup"],
                },
                "template_name": {"type": "string"},
                "delay_days": {
                    "type": "integer",
                    "description": "Days from now to send",
                },
            },
            "required": [
                "contact_id",
                "submission_id",
                "sequence_type",
                "template_name",
                "delay_days",
            ],
        },
    },
]


class IntakeAgent(BaseAgent):
    name = 'INTAKE'

    @property
    def system_prompt(self) -> str:
        return INTAKE_SYSTEM_PROMPT

    @property
    def tools(self) -> list[dict]:
        return INTAKE_TOOLS

    def execute_tool(self, tool_name: str, tool_input: dict[str, Any]) -> Any:
        if tool_name == 'query_contact':
            return query_contact_by_email(tool_input['email'])

        elif tool_name == 'update_submission_ai':
            success = update_submission_ai(
                tool_input['submission_id'],
                tool_input['ai_classification'],
                tool_input['ai_score'],
                tool_input['ai_tags'],
            )
            return {'success': success}

        elif tool_name == 'update_contact':
            success = update_contact_tags_and_score(
                tool_input['contact_id'],
                tool_input['tags_to_add'],
                tool_input.get('new_lifecycle_stage'),
            )
            return {'success': success}

        elif tool_name == 'create_pipeline_entry':
            entry_id = create_pipeline_entry(
                tool_input['contact_id'],
                tool_input['submission_id'],
                tool_input['division'],
                tool_input['stage'],
                tool_input.get('value_estimate'),
            )
            return {'pipeline_entry_id': entry_id, 'success': bool(entry_id)}

        elif tool_name == 'create_approval_request':
            approval_id = create_approval_request(
                agent_name='INTAKE',
                action_type='send_email',
                entity_type='submission',
                entity_id=tool_input['entity_id'],
                title=tool_input['title'],
                context=tool_input['context'],
                payload={
                    'to': tool_input['email_to'],
                    'subject': tool_input['email_subject'],
                    'html': tool_input['email_body_html'],
                    'text': tool_input['email_body_text'],
                },
                confidence=tool_input.get('confidence', 80),
            )
            return {'approval_id': approval_id, 'success': bool(approval_id)}

        elif tool_name == 'schedule_followup':
            success = schedule_followup(
                tool_input['contact_id'],
                tool_input['submission_id'],
                tool_input['sequence_type'],
                1,
                tool_input['template_name'],
                {},
                tool_input['delay_days'],
            )
            return {'success': success}

        return {'error': f'Unknown tool: {tool_name}'}

    def process_submission(
        self,
        submission_id: str,
        contact_id: str,
        type_: str,
        division: str,
        data: dict,
    ) -> 'AgentRunResult':
        """Main entry point: called by the webhook handler."""
        from models import AgentRunResult

        # Fetch the full submission from Supabase
        submission = query_submission(submission_id)
        if not submission:
            return AgentRunResult(
                agent=self.name,
                status='failed',
                input_summary=f'Submission {submission_id}',
                error='Submission not found in Supabase',
            )

        # Build the message for Claude
        contact = submission.get('contacts') or {}
        message = f"""New submission received. Classify, score, tag, and draft a response.

Submission ID: {submission_id}
Contact ID: {contact_id}
Type: {type_}
Division: {division}

Contact:
- Email: {contact.get('email', data.get('email', 'unknown'))}
- Name: {contact.get('name', data.get('name', 'Unknown'))}
- Company: {contact.get('company', data.get('company', 'N/A'))}
- Current lifecycle stage: {contact.get('lifecycle_stage', 'lead')}
- Existing tags: {contact.get('tags', [])}

Form data submitted:
{chr(10).join(f'- {k}: {v}' for k, v in data.items() if k not in ('utm', 'source_url'))}

UTM: {data.get('utm', {})}

Please:
1. Query the contact by email to check for existing records
2. Classify and score this submission
3. Update submission with ai_classification, ai_score, ai_tags
4. Update contact with relevant tags + lifecycle stage
5. Create pipeline entry if score >= 40 and not newsletter/careers
6. Draft a personalized response email and create approval request
7. Schedule a Day 3 follow-up if appropriate"""

        result = self.run(message, context={'submission_id': submission_id, 'contact_id': contact_id})

        # Log to activity_log
        log_activity(
            action='agent.intake.processed',
            entity_type='submission',
            entity_id=submission_id,
            details={
                'tokens_used': result.tokens_used,
                'approvals_created': result.approvals_created,
                'duration_ms': result.duration_ms,
            },
        )

        return result
