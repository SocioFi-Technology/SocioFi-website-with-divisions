"""
BaseAgent — wraps Claude API with tool-use loop, monitoring, oversight.
All agents inherit from this.

Enhanced capabilities:
- claude-opus-4-6 with adaptive thinking (model decides when/how much to reason)
- Prompt caching on system prompts (~90% cost reduction on repeated runs)
- Server-side tool support (web_search_20260209, code_execution_20260120, etc.)
  Server tools run on Anthropic's infrastructure — not in execute_tool()
- pause_turn handling for server-side sampling loop continuations
- Configurable max_tokens per agent (content agents need more room)
"""
import anthropic
import time
import json
from abc import ABC, abstractmethod
from typing import Any
from config import settings
from models import AgentRunResult


class BaseAgent(ABC):
    name: str = 'BASE'
    max_iterations: int = 10    # safety cap on client tool-use rounds
    max_tokens: int = 8192      # subclasses override (SCRIBE/CHRONICLE → 16000)
    thinking_enabled: bool = True  # set False only for pure-dispatch agents (HERALD)

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    # ── Abstract interface ────────────────────────────────────────────────────

    @property
    @abstractmethod
    def system_prompt(self) -> str:
        """Return the agent's system prompt."""
        ...

    @property
    @abstractmethod
    def tools(self) -> list[dict]:
        """
        Client-side tool definitions — agent executes these itself in execute_tool().
        These are the tools Claude requests and the agent fulfils locally.
        """
        ...

    @abstractmethod
    def execute_tool(self, tool_name: str, tool_input: dict[str, Any]) -> Any:
        """Execute a client-side tool call and return the result."""
        ...

    # ── Optional overrides ────────────────────────────────────────────────────

    @property
    def server_tools(self) -> list[dict]:
        """
        Server-side tool definitions run by Anthropic's infrastructure.
        These are transparent to the client — you do NOT handle them in execute_tool().

        Examples:
            [{"type": "web_search_20260209", "name": "web_search"}]
            [{"type": "code_execution_20260120", "name": "code_execution"}]

        Override in subclasses to enable capabilities like live web search.
        """
        return []

    # ── Internal helpers ──────────────────────────────────────────────────────

    def _thinking_param(self) -> dict | None:
        """Return adaptive thinking config when enabled."""
        return {"type": "adaptive"} if self.thinking_enabled else None

    def _system_param(self) -> list[dict]:
        """
        Wrap the system prompt in a list with cache_control so Anthropic caches
        the prompt tokens across repeated agent runs. First request pays full
        price; subsequent requests within 5 minutes pay ~10% for cached tokens.
        """
        return [
            {
                "type": "text",
                "text": self.system_prompt,
                "cache_control": {"type": "ephemeral"},
            }
        ]

    # ── Main run loop ─────────────────────────────────────────────────────────

    def run(self, user_message: str, context: dict[str, Any] | None = None) -> AgentRunResult:
        """
        Run the agent with a user message.

        Loop logic:
        - end_turn      → Claude finished; extract text and return
        - tool_use      → Claude wants client-side tools; execute and continue
        - pause_turn    → server-side tool loop hit limit; re-send to continue
        - max_tokens    → hit token limit; return what we have

        Server-side tool calls (web_search, code_execution) appear as
        server_tool_use + result blocks in response.content and are fully
        transparent — no client-side handling needed.
        """
        start_ms = int(time.time() * 1000)
        total_tokens = 0
        approvals_created = 0

        messages: list[dict] = [{'role': 'user', 'content': user_message}]
        all_tools = self.tools + self.server_tools

        iteration = 0
        final_text = ''

        try:
            while iteration < self.max_iterations:
                iteration += 1

                create_kwargs: dict[str, Any] = dict(
                    model=settings.anthropic_model,
                    max_tokens=self.max_tokens,
                    system=self._system_param(),
                    messages=messages,
                )
                if all_tools:
                    create_kwargs['tools'] = all_tools
                thinking = self._thinking_param()
                if thinking:
                    create_kwargs['thinking'] = thinking

                response = self.client.messages.create(**create_kwargs)

                total_tokens += response.usage.input_tokens + response.usage.output_tokens

                # ── Server-side tool loop hit iteration limit → re-send to continue
                if response.stop_reason == 'pause_turn':
                    messages.append({'role': 'assistant', 'content': response.content})
                    continue

                # ── Natural finish → pull out the text block
                if response.stop_reason == 'end_turn':
                    for block in response.content:
                        if hasattr(block, 'type') and block.type == 'text':
                            final_text = block.text
                    break

                # ── Client-side tool use → execute locally and feed results back
                if response.stop_reason == 'tool_use':
                    messages.append({'role': 'assistant', 'content': response.content})

                    tool_results = []
                    for block in response.content:
                        if not (hasattr(block, 'type') and block.type == 'tool_use'):
                            continue
                        try:
                            result = self.execute_tool(block.name, block.input)
                            if block.name == 'create_approval_request' and result:
                                approvals_created += 1
                            tool_results.append({
                                'type': 'tool_result',
                                'tool_use_id': block.id,
                                'content': (
                                    json.dumps(result)
                                    if not isinstance(result, str)
                                    else result
                                ),
                            })
                        except Exception as e:
                            tool_results.append({
                                'type': 'tool_result',
                                'tool_use_id': block.id,
                                'content': f'Error: {str(e)}',
                                'is_error': True,
                            })

                    if tool_results:
                        messages.append({'role': 'user', 'content': tool_results})
                else:
                    # max_tokens or unknown — grab whatever text we have
                    for block in response.content:
                        if hasattr(block, 'type') and block.type == 'text':
                            final_text += block.text
                    break

            duration_ms = int(time.time() * 1000) - start_ms
            return AgentRunResult(
                agent=self.name,
                status='success',
                input_summary=user_message[:200],
                output_summary=final_text[:500] if final_text else f'Completed {iteration} iterations',
                approvals_created=approvals_created,
                tokens_used=total_tokens,
                duration_ms=duration_ms,
            )

        except Exception as e:
            duration_ms = int(time.time() * 1000) - start_ms
            return AgentRunResult(
                agent=self.name,
                status='failed',
                input_summary=user_message[:200],
                error=str(e),
                tokens_used=total_tokens,
                duration_ms=duration_ms,
            )
