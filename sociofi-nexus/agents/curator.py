"""
CURATOR Agent — Prepares the monthly newsletter.
Runs on 25th of each month at 10:00 AM UTC via Celery.

Workflow:
1. Query published content from the current month
2. Select 3-5 best posts for inclusion
3. Write an editorial opening paragraph (100 words)
4. Generate 2 subject line variants for A/B testing
5. Identify subscriber segments to target
6. Submit full newsletter draft for human approval
"""

from agents.base import BaseAgent
from tools.supabase_tools import (
    query_published_content_this_month,
    query_subscriber_segment_counts,
    create_newsletter_approval,
    log_activity,
)
from typing import Any
from models import AgentRunResult


CURATOR_SYSTEM_PROMPT = """You are CURATOR, the newsletter curation agent for SocioFi Technology.

## Your Role
On the 25th of each month, you compile the best content published that month into a newsletter
for SocioFi's subscriber list. You select pieces, write an editorial opening, and generate
two subject line variants for A/B testing.

## Newsletter Strategy
SocioFi's audience: solo founders, SME operators, non-technical team leads who are excited
about AI but need real engineering support to ship production software.

The newsletter should feel like getting a message from a smart founder friend —
not a marketing blast. Practical, specific, honest.

## Content Selection Criteria
Choose 3-5 posts based on:
1. Relevance to audience pain points (shipping, debugging, scaling, maintaining AI-built code)
2. Specificity — posts with real numbers, real examples rank higher
3. Division balance — try to include content from at least 2 divisions
4. Timeliness — recent is better
5. Engagement potential — would this make someone click?

Exclude: posts that are too technical for a non-dev audience, pure product announcements,
anything that reads like a press release.

## Editorial Opening (100 words)
The opening paragraph sets the tone. It should:
- Acknowledge something the reader is probably experiencing this month (in tech/startup space)
- Preview the month's best content in 1-2 sentences
- Feel like a note from a person, not a brand
- End with a "what's inside" teaser

## Subject Line Variants
Write 2 variants:
- Variant A: curiosity/question format ("Why your AI-built app keeps breaking in production")
- Variant B: direct value format ("3 ways to keep your app running when the team's asleep")

Both should be under 60 characters. No clickbait. No ALL CAPS. No exclamation marks.

## Subscriber Segmentation
Consider if any content is division-specific enough to warrant targeting:
- Full list: general content, mixed divisions
- Studio segment: founders building new products
- Services segment: teams maintaining live apps
- Academy segment: people learning / upskilling

Recommend the best segment for this newsletter based on the content selected.

## Approval Note
Always submit for human approval. The founders review every newsletter before it goes out.
Include both subject line variants, the editorial, and the full post list in the approval payload."""


CURATOR_TOOLS = [
    {
        "name": "query_published_content",
        "description": "Fetch content published this month to select newsletter inclusions.",
        "input_schema": {
            "type": "object",
            "properties": {
                "month": {
                    "type": "string",
                    "description": "Optional: month in YYYY-MM format. Defaults to current month.",
                },
                "limit": {
                    "type": "integer",
                    "description": "Max number of items to return (default 20)",
                    "default": 20,
                },
            },
            "required": [],
        },
    },
    {
        "name": "create_newsletter_draft",
        "description": "Save the newsletter draft (writes to newsletter_issues table or approval_queue if table doesn't exist).",
        "input_schema": {
            "type": "object",
            "properties": {
                "subject_a": {
                    "type": "string",
                    "description": "Subject line variant A (curiosity format)",
                },
                "subject_b": {
                    "type": "string",
                    "description": "Subject line variant B (direct value format)",
                },
                "editorial": {
                    "type": "string",
                    "description": "Opening editorial paragraph (100 words)",
                },
                "selected_post_ids": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Content IDs selected for inclusion",
                },
                "division_highlights": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Division names featured in this issue",
                },
            },
            "required": ["subject_a", "subject_b", "editorial", "selected_post_ids"],
        },
    },
    {
        "name": "generate_subject_variants",
        "description": "Log and validate the two subject line variants.",
        "input_schema": {
            "type": "object",
            "properties": {
                "newsletter_topic": {
                    "type": "string",
                    "description": "One-sentence summary of this issue's theme",
                },
                "editorial_summary": {
                    "type": "string",
                    "description": "Brief summary of the editorial content",
                },
                "variant_a": {"type": "string", "description": "Curiosity/question format subject line"},
                "variant_b": {"type": "string", "description": "Direct value format subject line"},
            },
            "required": ["newsletter_topic", "editorial_summary", "variant_a", "variant_b"],
        },
    },
    {
        "name": "query_subscriber_segments",
        "description": "Get subscriber counts per list to inform targeting recommendations.",
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "create_newsletter_approval",
        "description": "Submit the completed newsletter draft for founder review before sending.",
        "input_schema": {
            "type": "object",
            "properties": {
                "subject_a": {"type": "string"},
                "subject_b": {"type": "string"},
                "editorial": {"type": "string"},
                "selected_post_ids": {
                    "type": "array",
                    "items": {"type": "string"},
                },
                "selected_post_titles": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Human-readable titles for the approval UI",
                },
                "recommended_segment": {
                    "type": "string",
                    "description": "Recommended subscriber segment to target",
                },
                "curator_notes": {
                    "type": "string",
                    "description": "CURATOR's notes on curation decisions and recommendations",
                },
            },
            "required": [
                "subject_a",
                "subject_b",
                "editorial",
                "selected_post_ids",
                "selected_post_titles",
                "recommended_segment",
            ],
        },
    },
]


class CuratorAgent(BaseAgent):
    name = 'CURATOR'

    @property
    def system_prompt(self) -> str:
        return CURATOR_SYSTEM_PROMPT

    @property
    def tools(self) -> list[dict]:
        return CURATOR_TOOLS

    def execute_tool(self, tool_name: str, tool_input: dict[str, Any]) -> Any:
        if tool_name == 'query_published_content':
            results = query_published_content_this_month(
                limit=tool_input.get('limit', 20),
            )
            return {'published_content': results, 'count': len(results)}

        elif tool_name == 'create_newsletter_draft':
            # Try to insert into newsletter_issues table; fall back to approval_queue
            from tools.supabase_tools import get_client
            from datetime import datetime
            try:
                result = get_client().table('newsletter_issues').insert({
                    'subject_a': tool_input['subject_a'],
                    'subject_b': tool_input['subject_b'],
                    'editorial': tool_input['editorial'],
                    'selected_post_ids': tool_input['selected_post_ids'],
                    'division_highlights': tool_input.get('division_highlights', []),
                    'status': 'draft',
                    'created_at': datetime.utcnow().isoformat(),
                }).select('id').single().execute()
                draft_id = result.data.get('id') if result.data else None
                return {'draft_id': draft_id, 'success': bool(draft_id), 'stored_in': 'newsletter_issues'}
            except Exception as e:
                print(f'[CURATOR] newsletter_issues table not found, skipping draft save: {e}')
                return {'draft_id': None, 'success': False, 'note': 'newsletter_issues table does not exist yet'}

        elif tool_name == 'generate_subject_variants':
            # Validate lengths and log the variants
            variant_a = tool_input['variant_a']
            variant_b = tool_input['variant_b']
            warnings = []
            if len(variant_a) > 60:
                warnings.append(f'Variant A is {len(variant_a)} chars — trim to under 60')
            if len(variant_b) > 60:
                warnings.append(f'Variant B is {len(variant_b)} chars — trim to under 60')
            return {
                'variant_a': variant_a,
                'variant_b': variant_b,
                'a_length': len(variant_a),
                'b_length': len(variant_b),
                'warnings': warnings,
                'topic': tool_input['newsletter_topic'],
            }

        elif tool_name == 'query_subscriber_segments':
            segments = query_subscriber_segment_counts()
            return {'segments': segments, 'count': len(segments)}

        elif tool_name == 'create_newsletter_approval':
            approval_id = create_newsletter_approval({
                'subject_a': tool_input['subject_a'],
                'subject_b': tool_input['subject_b'],
                'editorial': tool_input['editorial'],
                'selected_post_ids': tool_input['selected_post_ids'],
                'selected_post_titles': tool_input.get('selected_post_titles', []),
                'recommended_segment': tool_input['recommended_segment'],
                'curator_notes': tool_input.get('curator_notes', ''),
            })
            return {'approval_id': approval_id, 'success': bool(approval_id)}

        return {'error': f'Unknown tool: {tool_name}'}

    def prepare_newsletter(self) -> AgentRunResult:
        """Main entry point: called by Celery on the 25th of each month."""
        from datetime import datetime
        current_month = datetime.utcnow().strftime('%B %Y')

        message = f"""Prepare the SocioFi newsletter for {current_month}.

Steps:
1. Call query_published_content to fetch all content published this month (limit=30)
2. Review the content and select 3-5 best pieces based on:
   - Relevance to solo founders / SME operators struggling with AI-built software
   - Specificity (real numbers, concrete examples rank higher)
   - Division variety (at least 2 divisions if possible)
   - Engagement potential
3. Call query_subscriber_segments to understand the audience size
4. Write an editorial opening paragraph (exactly 100 words) that:
   - Acknowledges something the audience is experiencing this month
   - Previews the content you've selected
   - Sounds like a note from a person, not a brand
5. Call generate_subject_variants with two subject line options (under 60 chars each):
   - Variant A: curiosity/question format
   - Variant B: direct value format
6. Call create_newsletter_draft to save the draft
7. Call create_newsletter_approval with the full newsletter package

If there is very little published content this month (fewer than 3 pieces), note this in
curator_notes and recommend including 1-2 evergreen pieces from previous months."""

        result = self.run(message)

        log_activity(
            action='agent.curator.newsletter_prepared',
            entity_type='newsletter',
            entity_id=current_month,
            details={
                'month': current_month,
                'tokens_used': result.tokens_used,
                'approvals_created': result.approvals_created,
                'duration_ms': result.duration_ms,
            },
        )

        return result
