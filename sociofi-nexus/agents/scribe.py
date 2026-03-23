"""
SCRIBE Agent — Generates content: blog posts, case studies, FAQs, social posts, SEO metadata.
Runs on a Celery schedule (daily at 9am UTC) or triggered manually from admin.

Workflow:
1. Research the topic (simulated web search + internal content query)
2. Draft the content following SocioFi voice guidelines
3. Self-review quality gate (6 checks)
4. Rewrite if quality gate fails
5. Generate SEO metadata
6. Submit for human approval
"""

from agents.base import BaseAgent
from tools.supabase_tools import (
    query_existing_content,
    create_content_draft,
    update_content_seo_metadata,
    create_approval_request,
    log_activity,
)
from typing import Any
from models import AgentRunResult


SCRIBE_SYSTEM_PROMPT = """You are SCRIBE, the content generation agent for SocioFi Technology.

## Your Role
You write high-quality content — blog posts, case studies, FAQs, social posts — in the SocioFi voice.
Every piece you publish represents who we are. Write like a sharp technical co-founder explaining things over coffee.

## SocioFi Voice
- **Lead with the pain point** — acknowledge the frustration before offering the solution
- **Be specific** — use real numbers, timelines, prices. "2-3 weeks" not "quickly". "40% faster" not "much faster"
- **Sound human** — direct, warm, confident. Not corporate. Not breathless with enthusiasm.
- **Acknowledge what they already know** — our readers have used AI coding tools. Don't explain what they are.
- **One clear CTA per piece** — tell them exactly what to do next

## Voice Don'ts
- NEVER mention Claude, Anthropic, OpenAI, GPT, Gemini, or any specific AI provider
- Say "advanced AI models", "AI coding tools", "modern AI", "AI-assisted development" instead
- NEVER use: enterprise, leverage, synergy, paradigm, disrupt, game-changer, simple, easy, just, users, resources
- Say "your customers" not "users", "your app" not "enterprise solution"
- NEVER make vague claims — "revolutionary", "unprecedented", "cutting-edge" are forbidden

## Content Structure Rules

### Blog Posts (800-1200 words)
1. Hook (3-5 lines): open with the reader's exact situation or a bold specific claim
2. Problem framing: make them feel understood — name the specific frustration
3. Solution: explain what SocioFi does, with specifics on how it works
4. Proof: a concrete example, a metric, a short story (anonymized if needed)
5. CTA: one clear next step

### Case Studies (600-900 words)
- Client situation (anonymized if needed), specific problem, what we built, measurable results

### FAQ Answers (100-200 words each)
- Direct answer first, then explanation, then relevant link

### Social Posts
- LinkedIn: 150-300 chars, opens with a hook line, ends with question or CTA
- Twitter/X: under 280 chars, punchy, no hashtag spam (max 2)

## Quality Gate — run BEFORE submitting for approval
Check your draft against all 6 criteria:
1. No banned words (claude, anthropic, gpt, openai, gemini, leverage, synergy, simple, easy, just, game-changer, revolutionary, unprecedented, users, resources)
2. Has specific numbers (not "many" or "fast" — actual numbers, timelines, or prices)
3. Leads with the reader's pain point (not with SocioFi features)
4. Has one clear CTA at the end
5. Word count is in the target range for the content type
6. No vague superlative claims

If ANY check fails, rewrite the failing section before calling create_approval_request.

## Internal Linking
Naturally reference other SocioFi offerings where relevant:
- Bug fixes → mention Services division
- Learning AI → mention Academy
- Hosting → mention Cloud division
- Startup → mention Ventures
- Custom builds → mention Studio

Always run query_existing_content first to avoid duplicating recent topics."""


SCRIBE_TOOLS = [
    {
        "name": "search_web",
        "description": "Research a topic before writing. Returns simulated search results — use your internal knowledge to supplement.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query string"},
            },
            "required": ["query"],
        },
    },
    {
        "name": "query_existing_content",
        "description": "Check what content is already published to avoid repetition on similar topics.",
        "input_schema": {
            "type": "object",
            "properties": {
                "keywords": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Keywords to search for in existing content titles",
                },
                "division": {
                    "type": "string",
                    "description": "Optional: filter by division (studio, services, labs, etc.)",
                },
            },
            "required": ["keywords"],
        },
    },
    {
        "name": "create_content_draft",
        "description": "Save the written content as a draft in the content table.",
        "input_schema": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": ["blog_post", "case_study", "faq", "social_post", "landing_copy"],
                    "description": "Content type",
                },
                "title": {"type": "string", "description": "Content title"},
                "slug": {"type": "string", "description": "URL slug (kebab-case)"},
                "division": {
                    "type": "string",
                    "description": "SocioFi division this content belongs to",
                },
                "body_json": {
                    "type": "object",
                    "description": "Structured body: {introduction, sections: [{heading, content}], conclusion, word_count}",
                    "properties": {
                        "introduction": {"type": "string"},
                        "sections": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "heading": {"type": "string"},
                                    "content": {"type": "string"},
                                },
                            },
                        },
                        "conclusion": {"type": "string"},
                        "word_count": {"type": "integer"},
                    },
                    "required": ["introduction", "sections", "conclusion", "word_count"],
                },
                "tags": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Relevant tags for this content",
                },
                "author_name": {
                    "type": "string",
                    "description": "Author name (e.g. 'SocioFi Team' or a specific author)",
                },
            },
            "required": ["type", "title", "slug", "division", "body_json", "tags", "author_name"],
        },
    },
    {
        "name": "generate_seo_metadata",
        "description": "Generate and save SEO title, description, and keywords for a content draft.",
        "input_schema": {
            "type": "object",
            "properties": {
                "content_draft_id": {"type": "string", "description": "ID of the draft content"},
                "title": {"type": "string", "description": "Content title"},
                "body_summary": {
                    "type": "string",
                    "description": "2-3 sentence summary of the content body",
                },
            },
            "required": ["content_draft_id", "title", "body_summary"],
        },
    },
    {
        "name": "create_approval_request",
        "description": "Submit the content draft for human review before publishing.",
        "input_schema": {
            "type": "object",
            "properties": {
                "entity_id": {
                    "type": "string",
                    "description": "The content draft ID",
                },
                "title": {"type": "string", "description": "Short title for the approval item"},
                "context": {
                    "type": "string",
                    "description": "Why this content was written and quality gate results",
                },
                "content_type": {"type": "string", "description": "blog_post, case_study, etc."},
                "division": {"type": "string"},
                "quality_gate_passed": {
                    "type": "boolean",
                    "description": "Whether all 6 quality checks passed",
                },
                "confidence": {
                    "type": "integer",
                    "description": "0-100 confidence in the draft quality",
                },
            },
            "required": ["entity_id", "title", "context", "content_type", "division", "quality_gate_passed"],
        },
    },
]


class ScribeAgent(BaseAgent):
    name = 'SCRIBE'

    @property
    def system_prompt(self) -> str:
        return SCRIBE_SYSTEM_PROMPT

    @property
    def tools(self) -> list[dict]:
        return SCRIBE_TOOLS

    def execute_tool(self, tool_name: str, tool_input: dict[str, Any]) -> Any:
        if tool_name == 'search_web':
            # Simulated search — agent uses internal knowledge to supplement
            return {
                'results': [
                    {
                        'title': 'Simulated search result for: ' + tool_input['query'],
                        'snippet': 'Research placeholder — use your internal knowledge about SocioFi services and the AI development landscape to inform the content.',
                        'url': '#',
                    }
                ]
            }

        elif tool_name == 'query_existing_content':
            results = query_existing_content(
                tool_input['keywords'],
                tool_input.get('division'),
            )
            return {'existing_content': results, 'count': len(results)}

        elif tool_name == 'create_content_draft':
            draft_id = create_content_draft(
                type_=tool_input['type'],
                title=tool_input['title'],
                slug=tool_input['slug'],
                division=tool_input['division'],
                body_json=tool_input['body_json'],
                tags=tool_input.get('tags', []),
                author_name=tool_input.get('author_name', 'SocioFi Team'),
            )
            return {'draft_id': draft_id, 'success': bool(draft_id)}

        elif tool_name == 'generate_seo_metadata':
            # Claude writes the SEO fields and we save them
            import re
            title = tool_input['title']
            summary = tool_input['body_summary']
            # Generate SEO fields based on title and summary
            seo_title = f"{title} — SocioFi Technology"[:60]
            seo_description = summary[:158] if len(summary) > 158 else summary
            # Extract simple keywords from title
            stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
            words = re.findall(r'\b[a-zA-Z]{4,}\b', title.lower())
            seo_keywords = [w for w in words if w not in stop_words][:8]

            success = update_content_seo_metadata(
                content_id=tool_input['content_draft_id'],
                seo_title=seo_title,
                seo_description=seo_description,
                seo_keywords=seo_keywords,
            )
            return {
                'success': success,
                'seo_title': seo_title,
                'seo_description': seo_description,
                'seo_keywords': seo_keywords,
            }

        elif tool_name == 'create_approval_request':
            approval_id = create_approval_request(
                agent_name='SCRIBE',
                action_type='publish_content',
                entity_type='content',
                entity_id=tool_input['entity_id'],
                title=tool_input['title'],
                context=tool_input['context'],
                payload={
                    'content_type': tool_input['content_type'],
                    'division': tool_input['division'],
                    'quality_gate_passed': tool_input.get('quality_gate_passed', False),
                },
                confidence=tool_input.get('confidence', 80),
            )
            return {'approval_id': approval_id, 'success': bool(approval_id)}

        return {'error': f'Unknown tool: {tool_name}'}

    def generate_content(
        self,
        content_type: str,
        topic: str,
        division: str,
        additional_context: dict | None = None,
    ) -> AgentRunResult:
        """Main entry point: generate content for a given topic."""
        ctx = additional_context or {}

        message = f"""Write a {content_type} for SocioFi Technology on the following topic.

Topic: {topic}
Division: {division}
Content type: {content_type}
Additional context: {ctx}

Steps:
1. Search the web for context on this topic
2. Query existing content to avoid duplication
3. Write the full {content_type} following voice guidelines (target word count for type)
4. Run your 6-point quality gate — rewrite any failing sections before proceeding
5. Call create_content_draft to save the draft
6. Call generate_seo_metadata with a 2-3 sentence summary
7. Submit for approval with quality_gate_passed=true (only after all 6 checks pass)

Be specific. Use real numbers. Lead with the pain point."""

        result = self.run(message, context={'content_type': content_type, 'topic': topic, 'division': division})

        log_activity(
            action='agent.scribe.content_generated',
            entity_type='content',
            entity_id=topic[:50],
            details={
                'content_type': content_type,
                'division': division,
                'tokens_used': result.tokens_used,
                'approvals_created': result.approvals_created,
                'duration_ms': result.duration_ms,
            },
        )

        return result

    def process_calendar_items(self) -> AgentRunResult:
        """Called by Celery daily at 9am — checks for planned content items due today."""
        message = """Check for any content calendar items that need to be written today.

Query the existing content for items with status='draft' where metadata.source = 'calendar',
or any items that are planned/overdue.

For each item found:
1. Write the content following SocioFi voice guidelines
2. Run quality gate
3. Submit for approval

If no calendar items are found, note that the calendar is clear and suggest 2-3 content topics
that would be valuable for SocioFi's audience this week (considering what's already published)."""

        result = self.run(message)

        log_activity(
            action='agent.scribe.calendar_check',
            entity_type='content',
            entity_id='calendar',
            details={
                'tokens_used': result.tokens_used,
                'approvals_created': result.approvals_created,
                'duration_ms': result.duration_ms,
            },
        )

        return result
