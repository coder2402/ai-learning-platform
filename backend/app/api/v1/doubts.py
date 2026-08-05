from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.all_schemas import DoubtRequest, DoubtResponse
from app.services.ai_service import AIService
from app.models.all_models import DoubtHistory, User

router = APIRouter()

@router.post("/solve", response_model=DoubtResponse)
async def solve_doubt(req: DoubtRequest, db: Session = Depends(get_db)):
    normalized_hash = AIService.get_normalized_hash(req.question)
    
    # 1. Check if normalized question already exists in DB
    cached = db.query(DoubtHistory).filter(DoubtHistory.normalized_hash == normalized_hash).first()
    if cached:
        return cached.ai_response

    # 2. Call single AI solver service (Gemini 2.0 Flash)
    ai_output = await AIService.solve_math_doubt(req.question, req.math_expr)
    
    # 3. Get or create demo user (id 1)
    user = db.query(User).first()
    user_id = user.id if user else 1
    
    # 4. Save permanently to DB
    new_doubt = DoubtHistory(
        user_id=user_id,
        question_text=req.question,
        normalized_hash=normalized_hash,
        math_expr=req.math_expr,
        ai_response=ai_output
    )
    db.add(new_doubt)
    db.commit()

    return ai_output
