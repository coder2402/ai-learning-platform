from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.all_schemas import TestGenerateRequest, TestResponse, SubmitTestRequest
from app.services.test_engine import TestEngine
from app.models.all_models import User, Test, TestQuestion, Question

router = APIRouter()

@router.post("/generate", response_model=TestResponse)
def generate_test(req: TestGenerateRequest, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        user = User(name="Student", email="student@math.com", hashed_password="pw", plan="free")
        db.add(user)
        db.commit()
        db.refresh(user)

    # 1. Enforce Free Plan limit
    allowed, msg = TestEngine.check_user_test_limits(db, user)
    if not allowed:
        raise HTTPException(status_code=429, detail=msg)

    # 2. Select questions
    questions = TestEngine.generate_test_paper(
        db, topic=req.topic, subtopic=req.subtopic, difficulty=req.difficulty, num_q=req.num_questions
    )

    # 3. Create test record
    new_test = Test(
        user_id=user.id,
        topic=req.topic,
        subtopic=req.subtopic,
        pattern=req.pattern,
        question_type=req.question_type,
        difficulty=req.difficulty,
        num_questions=len(questions),
        duration_mins=req.duration_mins,
        status="generated"
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)

    # 4. Link questions
    for idx, q in enumerate(questions):
        tq = TestQuestion(test_id=new_test.id, question_id=q.id, order=idx+1)
        db.add(tq)
    db.commit()

    q_schemas = [
        {
            "id": q.id,
            "topic": q.topic,
            "subtopic": q.subtopic,
            "preamble": q.preamble,
            "stem": q.stem,
            "math_expr": q.math_expr,
            "options": q.options,
            "marks": f"+{q.marks} / -{q.negative_marks}",
            "question_type": q.question_type
        }
        for q in questions
    ]

    return {
        "test_id": new_test.id,
        "topic": new_test.topic,
        "duration_mins": new_test.duration_mins,
        "questions": q_schemas
    }

@router.post("/{test_id}/submit")
def submit_test(test_id: int, req: SubmitTestRequest, db: Session = Depends(get_db)):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    tqs = db.query(TestQuestion).filter(TestQuestion.test_id == test_id).all()
    correct_count = 0
    total_score = 0.0

    for tq in tqs:
        ans = req.answers.get(tq.question_id)
        tq.student_answer = ans
        q = db.query(Question).filter(Question.id == tq.question_id).first()
        if q and ans and ans.strip().lower() == q.correct_answer.strip().lower():
            tq.is_correct = True
            tq.marks_obtained = float(q.marks)
            correct_count += 1
            total_score += q.marks
        else:
            tq.is_correct = False
            tq.marks_obtained = -float(q.negative_marks) if q else 0
            total_score -= (q.negative_marks if q else 0)

    test.status = "completed"
    test.score = max(0.0, total_score)
    test.total_marks = float(len(tqs) * 4)
    db.commit()

    return {
        "test_id": test.id,
        "score": test.score,
        "total_marks": test.total_marks,
        "correct": correct_count,
        "total_questions": len(tqs)
    }
