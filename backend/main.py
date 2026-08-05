import sys
import os

# Ensure backend root directory is in sys.path for module resolution
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1.auth import router as auth_router
from app.api.v1.doubts import router as doubts_router
from app.api.v1.tests import router as tests_router
from app.api.v1.solutions import router as solutions_router
from app.api.v1.content import (
    topics_router, theory_router, formulas_router,
    assignments_router, pyq_router, users_router
)

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

from app.middleware.security import SecurityHeadersMiddleware, SimpleRateLimiterMiddleware

# Register Security & Rate Limit Middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(SimpleRateLimiterMiddleware, max_requests=100, window_seconds=60)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(doubts_router, prefix=f"{settings.API_V1_STR}/doubts", tags=["AI Doubts"])
app.include_router(tests_router, prefix=f"{settings.API_V1_STR}/tests", tags=["Tests"])
app.include_router(solutions_router, prefix=f"{settings.API_V1_STR}/solutions", tags=["Solutions"])
app.include_router(topics_router, prefix=f"{settings.API_V1_STR}/topics", tags=["Topics"])
app.include_router(theory_router, prefix=f"{settings.API_V1_STR}/theory", tags=["Theory"])
app.include_router(formulas_router, prefix=f"{settings.API_V1_STR}/formulas", tags=["Formulas"])
app.include_router(assignments_router, prefix=f"{settings.API_V1_STR}/assignments", tags=["Assignments"])
app.include_router(pyq_router, prefix=f"{settings.API_V1_STR}/pyq", tags=["PYQ"])
app.include_router(users_router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Mathematics Platform FastAPI Backend", "ai_provider": settings.AI_PROVIDER}
