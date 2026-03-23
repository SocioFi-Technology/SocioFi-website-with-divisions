"""
NEXUS Router — Routes incoming events to the appropriate agent.
Acts as the central coordinator for the agent system.
"""


class NexusRouter:
    EVENT_ROUTES: dict[str, str] = {
        'submission.created': 'INTAKE',
        'ticket.created':     'WARDEN',
        'approval.decided':   'HERALD',
    }

    def route_event(self, event_type: str, payload: dict) -> str:
        """Return agent name that handles this event."""
        return self.EVENT_ROUTES.get(event_type, 'NEXUS')

    def get_all_agents(self) -> list[str]:
        return ['INTAKE', 'HERALD', 'SCRIBE', 'COMPASS', 'WARDEN', 'CHRONICLE', 'CURATOR']
