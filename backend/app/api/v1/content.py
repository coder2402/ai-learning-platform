from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import Topic, Theory, FormulaSheet, Assignment, Question, User, Test, DoubtHistory

topics_router = APIRouter()
theory_router = APIRouter()
formulas_router = APIRouter()
assignments_router = APIRouter()
pyq_router = APIRouter()
users_router = APIRouter()

@topics_router.get("/")
def get_topics(db: Session = Depends(get_db)):
    return db.query(Topic).all()

@theory_router.get("/{topic_name}")
def get_theory(topic_name: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.name.ilike(topic_name)).first()
    if topic and topic.theory:
        return topic.theory
    return {
        "introduction": f"Overview of {topic_name}",
        "content": f"Complete theoretical foundation and properties of {topic_name}.",
        "examples": [{"q": f"Example 1 in {topic_name}", "a": "Step by step evaluation"}],
        "important_notes": ["Always check boundary values", "Remember standard identities"]
    }

@formulas_router.get("/{topic_name}")
def get_formulas(topic_name: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.name.ilike(topic_name)).first()
    if topic and topic.formula_sheet:
        return topic.formula_sheet
    return {
        "title": f"{topic_name} Formula Sheet",
        "formulae": ["∫ dx/(x²+a²) = (1/a) arctan(x/a) + C", "d/dx (x^n) = n x^(n-1)"],
        "identities": ["sin²x + cos²x = 1", "e^(iπ) + 1 = 0"],
        "short_notes": "Essential formula quick revision guide."
    }

@assignments_router.get("/")
def get_assignments(db: Session = Depends(get_db)):
    return db.query(Assignment).all()

@pyq_router.get("/")
def get_pyqs(topic: str = None, difficulty: str = None, db: Session = Depends(get_db)):
    query = db.query(Question).filter(Question.is_pyq == True)
    if topic:
        query = query.filter(Question.topic == topic)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    return query.limit(20).all()

@users_router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    user = db.query(User).first()
    doubts_count = db.query(DoubtHistory).count()
    tests_count = db.query(Test).count()
    assignments_count = db.query(Assignment).count()
    return {
        "user_name": user.name if user else "Student",
        "plan": user.plan if user else "free",
        "stats": {
            "doubts_solved": doubts_count,
            "tests_attempted": tests_count,
            "assignments_completed": assignments_count,
            "accuracy_percent": 84
        },
        "recent_doubts": db.query(DoubtHistory).order_by(DoubtHistory.id.desc()).limit(3).all(),
        "recent_tests": db.query(Test).order_by(Test.id.desc()).limit(3).all()
    }

@users_router.get("/profile")
def get_user_profile(db: Session = Depends(get_db)):
    user = db.query(User).first()
    doubts = db.query(DoubtHistory).order_by(DoubtHistory.id.desc()).limit(10).all()
    tests = db.query(Test).order_by(Test.id.desc()).limit(10).all()
    assignments = db.query(Assignment).limit(5).all()
    
    return {
        "id": user.id if user else 1,
        "name": user.name if user else "Alex Sharma",
        "email": user.email if user else "student@math.com",
        "plan": user.plan if user else "free",
        "target_exam": "JEE Advanced 2026",
        "subscription_limits": {
            "tests_used": len(tests),
            "max_tests": 2,
            "questions_used": sum(t.num_questions for t in tests),
            "max_questions": 40,
            "window_days": 15
        },
        "doubt_history": [
            {"id": d.id, "question": d.question_text, "date": d.created_at.strftime("%Y-%m-%d") if d.created_at else "Today"}
            for d in doubts
        ],
        "test_history": [
            {"id": t.id, "topic": t.topic, "score": t.score or 0, "total": t.total_marks or 40, "status": t.status, "date": t.created_at.strftime("%Y-%m-%d") if t.created_at else "Today"}
            for t in tests
        ],
        "assignment_history": [
            {"id": a.id, "title": a.title, "topic": a.topic, "status": "Completed"}
            for a in assignments
        ]
    }
