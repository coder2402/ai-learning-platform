from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import Question
from app.services.solution_service import SolutionService
from app.schemas.all_schemas import SolutionReviewSchema

router = APIRouter()

@router.get("/{question_id}", response_model=SolutionReviewSchema)
async def get_solution(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    solution_json = await SolutionService.get_or_generate_solution(db, question)
    return solution_json
