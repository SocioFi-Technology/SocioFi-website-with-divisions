from celery import Celery
from celery.schedules import crontab
from config import settings

celery = Celery('nexus', broker=settings.redis_url, backend=settings.redis_url)

celery.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    beat_schedule={
        'herald-followup-check': {
            'task': 'celery_app.herald_followup_check',
            'schedule': crontab(minute=0, hour='*/6'),  # every 6 hours
        },
        'system-health-check': {
            'task': 'celery_app.system_health_check',
            'schedule': crontab(minute='*/5'),           # every 5 minutes
        },
    },
)


@celery.task(name='celery_app.herald_followup_check')
def herald_followup_check():
    """Run HERALD to process due email follow-ups."""
    from agents.herald import HeraldAgent
    agent = HeraldAgent()
    result = agent.process_due_followups()
    return {
        'status': result.status,
        'output': result.output_summary,
        'tokens': result.tokens_used,
    }


@celery.task(name='celery_app.system_health_check')
def system_health_check():
    """Ping Supabase to verify connectivity."""
    from tools.supabase_tools import get_client
    try:
        get_client().table('contacts').select('id').limit(1).execute()
        return {'healthy': True}
    except Exception as e:
        print(f'[HEALTH] Supabase ping failed: {e}')
        return {'healthy': False, 'error': str(e)}
