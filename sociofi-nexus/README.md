# SocioFi NEXUS Agent Server

NEXUS is the AI agent coordination backend for SocioFi Technology. It receives form submission webhooks from the Next.js frontend, runs autonomous agents (INTAKE and HERALD) to classify leads and manage email sequences, and surfaces approval requests to human reviewers via the admin panel.

---

## Setup

```bash
# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your Supabase URL, service key, Anthropic API key, etc.

# 4. Run the database migration
# Open Supabase SQL editor and run: migrations/001_nexus_tables.sql
```

---

## Running

### FastAPI server (development)
```bash
uvicorn main:app --reload --port 8001
```

### FastAPI server (production)
```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --workers 2
```

### Celery worker (processes background tasks)
```bash
celery -A celery_app worker --loglevel=info
```

### Celery Beat scheduler (triggers scheduled tasks)
```bash
celery -A celery_app beat --loglevel=info
```

> Run the worker and beat scheduler in separate terminal windows (or as separate processes/containers in production).

---

## Database Migration

Run `migrations/001_nexus_tables.sql` in the Supabase SQL editor. This creates:
- `approval_queue` — stores AI-drafted actions awaiting human review
- `followup_schedule` — stores scheduled email sequences for HERALD

---

## End-to-End Tests

### Trigger a submission webhook
```bash
curl -X POST http://localhost:8001/webhook/submission \
  -H "Authorization: Bearer dev-key" \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "test-123",
    "contact_id": "contact-456",
    "type": "studio-project",
    "division": "studio",
    "data": {
      "name": "Alice",
      "email": "alice@example.com",
      "description": "Need help building an AI SaaS",
      "budget_range": "$15K-$30K"
    }
  }'
```

### Check server status
```bash
curl http://localhost:8001/status \
  -H "Authorization: Bearer dev-key"
```

### Manually trigger HERALD
```bash
curl -X POST http://localhost:8001/trigger/herald \
  -H "Authorization: Bearer dev-key" \
  -H "Content-Type: application/json" \
  -d '{"reason": "manual check"}'
```

### Approve an email draft
```bash
curl -X POST http://localhost:8001/webhook/approval \
  -H "Authorization: Bearer dev-key" \
  -H "Content-Type: application/json" \
  -d '{
    "approval_id": "approval-uuid-here",
    "decision": "approved",
    "decided_by": "team-member-uuid"
  }'
```

### Discard an approval
```bash
curl -X POST http://localhost:8001/webhook/approval \
  -H "Authorization: Bearer dev-key" \
  -H "Content-Type: application/json" \
  -d '{
    "approval_id": "approval-uuid-here",
    "decision": "discarded",
    "discard_reason": "Contact already replied directly"
  }'
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Yes | Service role key (bypasses RLS) |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude |
| `ANTHROPIC_MODEL` | No | Model to use (default: `claude-sonnet-4-5`) |
| `RESEND_API_KEY` | No | Resend API key for email sending |
| `RESEND_FROM_EMAIL` | No | From address (default: `admin@sociofi.io`) |
| `REDIS_URL` | No | Redis connection URL for Celery (default: `redis://localhost:6379/0`) |
| `NEXUS_API_KEY` | Yes | Shared secret for authenticating requests from Next.js |
| `SITE_URL` | No | Public site URL for email CTAs |
| `ADMIN_URL` | No | Admin panel URL for approval links |
| `PORT` | No | Server port (default: `8001`) |
| `DEBUG` | No | Enable uvicorn hot-reload (default: `false`) |

---

## Architecture

```
Next.js Frontend
      |
      | POST /webhook/submission  (Bearer token)
      v
┌─────────────────────────────────────────────┐
│           NEXUS FastAPI Server              │
│                                             │
│  /webhook/submission  →  INTAKE Agent       │
│  /webhook/approval    →  HERALD Agent       │
│  /trigger/{agent}     →  Manual override    │
│  /status              →  Health + metrics   │
│  /agents/{name}/runs  →  Run history        │
└──────────────┬──────────────────────────────┘
               |
     ┌─────────┴─────────┐
     |                   |
     v                   v
 INTAKE Agent       HERALD Agent
 (Claude + tools)   (Claude + tools)
     |                   |
     v                   v
  Supabase DB       Resend Email
  - contacts        - welcome
  - submissions     - followup_day3
  - pipeline        - custom HTML
  - approval_queue
  - followup_schedule
  - activity_log
               |
     ┌─────────┴──────────┐
     |                    |
     v                    v
Celery Worker        Celery Beat
(background tasks)   (every 6h: HERALD
                      every 5m: health)
     |
     v
  Redis broker
```

### Agent Responsibilities

**INTAKE** — runs on every new form submission
1. Queries Supabase for the contact's history
2. Classifies the submission (11 possible types)
3. Scores lead quality 0-100
4. Extracts relevant tags
5. Updates contact lifecycle stage
6. Creates pipeline entry (if score >= 40)
7. Drafts personalized response email → creates approval request
8. Schedules Day 3 follow-up if appropriate

**HERALD** — runs every 6 hours via Celery Beat
1. Fetches all due follow-ups from `followup_schedule`
2. Decides send vs skip for each
3. Sends emails via Resend
4. Also dispatches approved emails from the admin panel

### Human-in-the-loop

All outbound emails go through `approval_queue` before sending. The admin panel surfaces pending approvals; a human clicks Approve / Edit / Discard. Only on Approve does HERALD dispatch via Resend.
