---
name: math-platform-dev
description: Best practices and workflows for developing features on the AI-Powered Mathematics Learning Platform.
---

# Math Platform Development Skill

Use this skill when developing backend services, AI doubt solver capabilities, test paper generator logic, or Next.js UI integration on the platform.

## Key Workflows

### 1. Single-Call AI Doubt Solver
- Route: `POST /api/v1/doubts/solve`
- Service: `app/services/ai_service.py`
- Prompt contract must mandate a JSON structure with:
  ```json
  {
    "topics": [{"label": "...", "sub": "...", "to": "/theory", "color": "..."}],
    "hints": [
      {"icon": "Lightbulb", "label": "HINT 1: ...", "step": "Step 1/3", "color": "text-blue-600", "body": "...", "math": "..."},
      {"icon": "Combine", "label": "HINT 2: ...", "step": "Step 2/3", "color": "text-purple-600", "body": "...", "math": "...", "note": "..."},
      {"icon": "Sparkles", "label": "HINT 3: ...", "step": "Step 3/3", "color": "text-emerald-600", "body": "...", "math": "..."}
    ],
    "solution": {"body": "...", "math": "..."},
    "common_mistakes": "..."
  }
  ```
- Store raw question and AI output permanently in `doubt_history`. If the same normalized question string is posted again, return cached answer without calling Google Gemini API.

### 2. On-Demand Solution Generation Strategy
- Route: `GET /api/v1/solutions/{question_id}`
- Service: `app/services/solution_service.py`
- Workflow:
  1. Search `generated_solutions` by `question_id`.
  2. If found, return stored solution immediately.
  3. If not found, send question prompt to Gemini API, parse output, insert row in `generated_solutions`, and return result.

### 3. Test Paper Generator & Plan Limits
- Route: `POST /api/v1/tests/generate`
- Service: `app/services/test_engine.py`
- Check user subscription:
  - Free Plan: max 2 tests or 40 questions per 15 days.
  - Limit question count: max 25 questions per test paper.
