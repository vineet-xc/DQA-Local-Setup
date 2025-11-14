from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    app_name: str = "DQA Service"
    version: str = "1.0.0"
    debug: bool = False
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    # Database
    database_url: str = "sqlite:///./app.db"
    database_echo: bool = False
    
    # Authentication
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # CORS
    cors_origins: List[str] = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = ["*"]
    cors_allow_headers: List[str] = ["*"]
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "json"  # json or text
    
    # Service URLs
    user_service_url: str = "http://localhost:8001"
    auth_service_url: str = "http://localhost:8002"
    data_service_url: str = "http://localhost:8003"
    main_api_url: str = "http://localhost:8000"
    
    # Redis (for caching and sessions)
    redis_url: Optional[str] = None
    redis_password: Optional[str] = None
    
    # Monitoring
    enable_metrics: bool = True
    metrics_port: int = 9090
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

# Create settings instance
settings = Settings()

def get_settings() -> Settings:
    """Get application settings"""
    return settings