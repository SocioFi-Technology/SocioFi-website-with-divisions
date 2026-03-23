"""
BaseAgent — wraps Claude API with tool-use loop, monitoring, oversight.
All agents inherit from this.
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
    max_iterations: int = 10   # safety: max tool-use rounds

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    @property
    @abstractmethod
    def system_prompt(self) -> str:
        """Return the agent's system prompt."""
        ...

    @property
    @abstractmethod
    def tools(self) -> list[dict]:
        """Return the list of tool definitions for Claude."""
        ...

    @abstractmethod
    def execute_tool(self, tool_name: str, tool_input: dict[str, Any]) -> Any:
        """Execute a tool call and return the result."""
        ...

    def run(self, user_message: str, context: dict[str, Any] | None = None) -> AgentRunResult:
        """
        Run the agent: sends user_message to Claude, executes tool calls in a loop
        until Claude returns a final text response with no more tool calls.
        """
        start_ms = int(time.time() * 1000)
        total_tokens = 0
        approvals_created = 0

        messages: list[dict] = [{'role': 'user', 'content': user_message}]

        iteration = 0
        final_text = ''

        try:
            while iteration < self.max_iterations:
                iteration += 1

                response = self.client.messages.create(
                    model=settings.anthropic_model,
                    max_tokens=4096,
                    system=self.system_prompt,
                    tools=self.tools,
                    messages=messages,
                )

                total_tokens += response.usage.input_tokens + response.usage.output_tokens

                # Check stop reason
                if response.stop_reason == 'end_turn':
                    # Extract text from response
                    for block in response.content:
                        if hasattr(block, 'text'):
                            final_text = block.text
                    break

                if response.stop_reason == 'tool_use':
                    # Add assistant response to messages
                    messages.append({'role': 'assistant', 'content': response.content})

                    # Execute all tool calls
                    tool_results = []
                    for block in response.content:
                        if block.type == 'tool_use':
                            try:
                                result = self.execute_tool(block.name, block.input)
                                # Track approval_created calls
                                if block.name == 'create_approval_request' and result:
                                    approvals_created += 1
                                tool_results.append({
                                    'type': 'tool_result',
                                    'tool_use_id': block.id,
                                    'content': json.dumps(result) if not isinstance(result, str) else result,
                                })
                            except Exception as e:
                                tool_results.append({
                                    'type': 'tool_result',
                                    'tool_use_id': block.id,
                                    'content': f'Error: {str(e)}',
                                    'is_error': True,
                                })

                    messages.append({'role': 'user', 'content': tool_results})
                else:
                    # max_tokens or other stop
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
