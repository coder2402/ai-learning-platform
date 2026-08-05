import json
import httpx
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.all_models import Question, GeneratedSolution
from app.core.config import settings

class SolutionService:
    @classmethod
    async def get_or_generate_solution(cls, db: Session, question: Question) -> Dict[str, Any]:
        """
        On-demand Solution Generation Strategy:
        1. Check if solution exists in generated_solutions table.
        2. If YES -> return cached solution.
        3. If NO -> call Gemini API to generate solution + common mistakes, store in DB, return.
        """
        cached = db.query(GeneratedSolution).filter(GeneratedSolution.question_id == question.id).first()
        if cached:
            return cached.solution_json

        # Generate on-demand via Gemini API or fallback
        sol_data = await cls._generate_solution_via_ai(question)
        
        # Save to DB
        new_sol = GeneratedSolution(
            question_id=question.id,
            solution_json=sol_data
        )
        db.add(new_sol)
        db.commit()
        db.refresh(new_sol)
        
        return sol_data

    @classmethod
    async def _generate_solution_via_ai(cls, question: Question) -> Dict[str, Any]:
        full_text = f"{question.preamble or ''} {question.stem} {question.math_expr or ''}".strip()
        
        if settings.GEMINI_API_KEY:
            try:
                prompt = f"""
For the question below, generate a step-by-step solution and common mistake explanation in JSON:
Question: {full_text}
Correct Answer: {question.correct_answer}

JSON Format:
{{
  "steps": [
    "Step 1 text...",
    "Step 2 text...",
    "Step 3 text..."
  ],
  "common_mistake": "Common student pitfall explanation",
  "topic": "{question.topic}"
}}
"""
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.GEMINI_API_KEY}"
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"response_mime_type": "application/json"}
                }
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        parsed = json.loads(resp.json()["candidates"][0]["content"]["parts"][0]["text"])
                        return {
                            "question_id": question.id,
                            "question_stem": question.stem,
                            "math_expr": question.math_expr,
                            "correct_answer": question.correct_answer,
                            "steps": parsed.get("steps", ["Apply standard mathematical identities step-by-step."]),
                            "common_mistake": parsed.get("common_mistake", "Forgetting boundary conditions or negative sign changes."),
                            "topic": question.topic
                        }
            except Exception as e:
                print(f"[SolutionService] Gemini solution generation error: {e}")

        # Deterministic fallback solution
        return {
            "question_id": question.id,
            "question_stem": question.stem,
            "math_expr": question.math_expr,
            "correct_answer": question.correct_answer,
            "steps": [
                f"Identify category and formula for {question.topic}.",
                "Substitute values and simplify expressions using fundamental identities.",
                f"Evaluate result: {question.correct_answer}."
            ],
            "common_mistake": question.explanation or "Check coefficient multiplication and boundary substitutions.",
            "topic": question.topic
        }
