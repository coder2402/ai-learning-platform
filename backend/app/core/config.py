import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Mathematics Learning Platform"
    API_V1_STR: str = "/api/v1"
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-jwt-key-for-math-platform-change-in-prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database (Supabase PostgreSQL / SQLite fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./math_platform.db")
    
    # AI Provider (Google Gemini API primary, OpenAI fallback)
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Storage (Cloudflare R2)
    R2_ACCOUNT_ID: str = os.getenv("R2_ACCOUNT_ID", "")
    R2_ACCESS_KEY_ID: str = os.getenv("R2_ACCESS_KEY_ID", "")
    R2_SECRET_ACCESS_KEY: str = os.getenv("R2_SECRET_ACCESS_KEY", "")
    R2_BUCKET_NAME: str = os.getenv("R2_BUCKET_NAME", "math-assets")
    R2_PUBLIC_URL: str = os.getenv("R2_PUBLIC_URL", "https://assets.mathplatform.com")
    
    # Free Plan Rules
    FREE_PLAN_TEST_LIMIT: int = 2
    FREE_PLAN_QUESTION_LIMIT: int = 40
    FREE_PLAN_WINDOW_DAYS: int = 15
    MAX_QUESTIONS_PER_TEST: int = 25

    class Config:
        case_sensitive = True

settings = Settings()
