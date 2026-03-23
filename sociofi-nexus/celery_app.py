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
            'schedule': crontab(minute=0, hour='*/6'),          # every 6 hours
        },
        'system-health-check': {
            'task': 'celery_app.system_health_check',
            'schedule': crontab(minute='*/5'),                   # every 5 minutes
        },
        'scribe-content-calendar-check': {
            'task': 'celery_app.scribe_content_calendar_check',
            'schedule': crontab(minute=0, hour=9),               # daily at 9:00 AM UTC
        },
        'compass-pipeline-check': {
            'task': 'celery_app.compass_pipeline_check',
            'schedule': crontab(minute=0, hour='*/2'),           # every 2 hours
        },
        'chronicle-daily-digest': {
            'task': 'celery_app.chronicle_daily_digest',
            'schedule': crontab(minute=0, hour=7),               # daily at 7:00 AM UTC
        },
        'chronicle-weekly-report': {
            'task': 'celery_app.chronicle_weekly_report',
            'schedule': crontab(minute=0, hour=8, day_of_week=1),  # Monday 8:00 AM UTC
        },
        'chronicle-monthly-report': {
            'task': 'celery_app.chronicle_monthly_report',
            'schedule': crontab(minute=0, hour=6, day_of_month=1), # 1st of month 6:00 AM UTC
        },
        'curator-newsletter-prep': {
            'task': 'celery_app.curator_newsletter_prep',
            'schedule': crontab(minute=0, hour=10, day_of_month=25),  # 25th at 10:00 AM UTC
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


@celery.task(name='celery_app.scribe_content_calendar_check')
def scribe_content_calendar_check():
    """Run SCRIBE daily to check for planned content calendar items."""
    try:
        from agents.scribe import ScribeAgent
        agent = ScribeAgent()
        result = agent.process_calendar_items()
        return {
            'status': result.status,
            'output': result.output_summary,
            'approvals': result.approvals_created,
            'tokens': result.tokens_used,
        }
    except Exception as e:
        print(f'[CELERY] scribe_content_calendar_check failed: {e}')
        return {'status': 'failed', 'error': str(e)}


@celery.task(name='celery_app.compass_pipeline_check')
def compass_pipeline_check():
    """Run COMPASS every 2 hours to find stale pipeline entries."""
    try:
        from agents.compass import CompassAgent
        agent = CompassAgent()
        result = agent.analyze_pipeline()
        return {
            'status': result.status,
            'output': result.output_summary,
            'recommendations': result.approvals_created,
            'tokens': result.tokens_used,
        }
    except Exception as e:
        print(f'[CELERY] compass_pipeline_check failed: {e}')
        return {'status': 'failed', 'error': str(e)}


@celery.task(name='celery_app.chronicle_daily_digest')
def chronicle_daily_digest():
    """Run CHRONICLE daily at 7:00 AM UTC to send the daily digest."""
    try:
        from agents.chronicle import ChronicleAgent
        agent = ChronicleAgent()
        result = agent.generate_daily_digest()
        return {
            'status': result.status,
            'output': result.output_summary,
            'tokens': result.tokens_used,
        }
    except Exception as e:
        print(f'[CELERY] chronicle_daily_digest failed: {e}')
        return {'status': 'failed', 'error': str(e)}


@celery.task(name='celery_app.chronicle_weekly_report')
def chronicle_weekly_report():
    """Run CHRONICLE every Monday at 8:00 AM UTC to send the weekly report."""
    try:
        from agents.chronicle import ChronicleAgent
        agent = ChronicleAgent()
        result = agent.generate_weekly_report()
        return {
            'status': result.status,
            'output': result.output_summary,
            'tokens': result.tokens_used,
        }
    except Exception as e:
        print(f'[CELERY] chronicle_weekly_report failed: {e}')
        return {'status': 'failed', 'error': str(e)}


@celery.task(name='celery_app.chronicle_monthly_report')
def chronicle_monthly_report():
    """Run CHRONICLE on the 1st of each month at 6:00 AM UTC."""
    try:
        from agents.chronicle import ChronicleAgent
        agent = ChronicleAgent()
        result = agent.generate_monthly_report()
        return {
            'status': result.status,
            'output': result.output_summary,
            'tokens': result.tokens_used,
        }
    except Exception as e:
        print(f'[CELERY] chronicle_monthly_report failed: {e}')
        return {'status': 'failed', 'error': str(e)}


@celery.task(name='celery_app.curator_newsletter_prep')
def curator_newsletter_prep():
    """Run CURATOR on the 25th of each month at 10:00 AM UTC to prepare the newsletter."""
    try:
        from agents.curator import CuratorAgent
        agent = CuratorAgent()
        result = agent.prepare_newsletter()
        return {
            'status': result.status,
            'output': result.output_summary,
            'approvals': result.approvals_created,
            'tokens': result.tokens_used,
        }
    except Exception as e:
        print(f'[CELERY] curator_newsletter_prep failed: {e}')
        return {'status': 'failed', 'error': str(e)}
