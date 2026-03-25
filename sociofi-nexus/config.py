from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    supabase_url: str
    supabase_service_key: str
    anthropic_api_key: str
    anthropic_model: str = 'claude-sonnet-4-5'
    resend_api_key: str = ''
    resend_from_email: str = 'admin@sociofitechnology.com'
    redis_url: str = 'redis://localhost:6379/0'
    nexus_api_key: str = 'dev-key'
    site_url: str = 'https://sociofitechnology.com'
    admin_url: str = 'https://superadmin.sociofitechnology.com'
    port: int = 8001
    debug: bool = False


settings = Settings()
