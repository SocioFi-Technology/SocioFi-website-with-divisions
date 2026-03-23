from pydantic import BaseModel, Field
from typing import Any, Optional
from datetime import datetime
import uuid


class SubmissionWebhook(BaseModel):
    submission_id: str
    contact_id: str
    type: str
    division: str
    data: dict[str, Any]
    utm: Optional[dict[str, str]] = None
    timestamp: Optional[str] = None


class ApprovalWebhook(BaseModel):
    approval_id: str
    decision: str           # 'approved' | 'edited' | 'discarded'
    decided_by: Optional[str] = None
    edited_payload: Optional[dict[str, Any]] = None
    discard_reason: Optional[str] = None


class TriggerRequest(BaseModel):
    data: dict[str, Any] = Field(default_factory=dict)
    reason: Optional[str] = None


class AgentRunResult(BaseModel):
    agent: str
    run_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str          # 'success' | 'failed' | 'pending_review'
    input_summary: str
    output_summary: Optional[str] = None
    approvals_created: int = 0
    tokens_used: int = 0
    duration_ms: int = 0
    error: Optional[str] = None
    completed_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
