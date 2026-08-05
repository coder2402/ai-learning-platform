import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, Tuple

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Applies production security headers:
    - X-Frame-Options: DENY (prevents clickjacking)
    - X-Content-Type-Options: nosniff
    - X-XSS-Protection: 1; mode=block
    - Strict-Transport-Security (HSTS)
    - Referrer-Policy: strict-origin-when-cross-origin
    """
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

class SimpleRateLimiterMiddleware(BaseHTTPMiddleware):
    """
    In-memory rate limiter protecting sensitive API routes (/auth, /doubts, /tests).
    Allows max 30 requests per minute per IP address.
    """
    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        
        # Clean old entries
        if client_ip in self.requests:
            self.requests[client_ip] = [t for t in self.requests[client_ip] if now - t < self.window_seconds]
        else:
            self.requests[client_ip] = []

        if len(self.requests[client_ip]) >= self.max_requests:
            return Response(
                content='{"detail":"Rate limit exceeded. Please wait a minute before making more requests."}',
                status_code=429,
                media_type="application/json"
            )

        self.requests[client_ip].append(now)
        return await call_next(request)
