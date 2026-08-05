# AI-Powered Mathematics Learning Platform - Agent Rules & Architecture Guidelines

This repository contains the full-stack AI-Powered Mathematics Learning Platform designed for cost-optimized Socratic math tutoring, test generation, and learning analytics.

## Tech Stack Overview
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: FastAPI (Python 3.11), SQLAlchemy 2.0, Pydantic v2, Pytest.
- **Database**: Supabase PostgreSQL (via SQLAlchemy URL).
- **Storage**: Cloudflare R2 (for question images, solution images, PDFs).
- **AI Model**: Google Gemini 2.0 Flash (via `google-genai` SDK) for single-call hint generation & on-demand test solution generation.

## Architectural Principles
1. **Teach, Don't Just Answer**: AI Doubt Solver generates 3 progressive hints (Hint 1 -> Hint 2 -> Hint 3) and a final revealable solution in a **single AI request**. Results are cached in `doubt_history` DB table permanently.
2. **Deterministic Core**: Tests, assignments, theory, formula sheets, and PYQs are purely database-driven with zero AI overhead.
3. **On-Demand Solution Strategy**: Solutions for test questions are NOT pre-generated. They are generated using Gemini on-demand when a student clicks "Review Solution" and stored permanently in `generated_solutions`.
4. **Strict Free Plan Enforcement**: Free plan limits students to max 2 tests or 40 questions per 15-day rolling window. Maximum 25 questions per generated test paper.

## Directory Structure
- `frontend/`: Next.js App Router project containing pages, components, services, and contexts.
- `backend/`: FastAPI backend with isolated `app/core/`, `app/models/`, `app/schemas/`, `app/services/`, `app/api/v1/`, and `db/seed.py`.
