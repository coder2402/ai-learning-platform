import datetime
from typing import List, Tuple
from sqlalchemy.orm import Session
from app.models.all_models import Test, Question, User
from app.core.config import settings

class TestEngine:
    @staticmethod
    def check_user_test_limits(db: Session, user: User) -> Tuple[bool, str]:
        """
        Free Plan Rule: Every 15 days, Maximum: 2 Tests OR 40 Questions.
        """
        if user.plan == "premium":
            return True, "Premium user unlimited access."

        cutoff = datetime.datetime.utcnow() - datetime.timedelta(days=settings.FREE_PLAN_WINDOW_DAYS)
        recent_tests = db.query(Test).filter(Test.user_id == user.id, Test.created_at >= cutoff).all()
        
        test_count = len(recent_tests)
        question_count = sum(t.num_questions for t in recent_tests)

        if test_count >= settings.FREE_PLAN_TEST_LIMIT:
            return False, f"Free plan limit reached ({settings.FREE_PLAN_TEST_LIMIT} tests per {settings.FREE_PLAN_WINDOW_DAYS} days). Upgrade to Premium for unlimited tests."
        
        if question_count >= settings.FREE_PLAN_QUESTION_LIMIT:
            return False, f"Free plan limit reached ({settings.FREE_PLAN_QUESTION_LIMIT} questions per {settings.FREE_PLAN_WINDOW_DAYS} days). Upgrade to Premium."

        return True, "Within limits"

    @staticmethod
    def generate_test_paper(db: Session, topic: str, subtopic: str = None, difficulty: str = "Medium", num_q: int = 10) -> List[Question]:
        """
        Selects random questions matching topic, subtopic, difficulty.
        """
        num_q = min(num_q, settings.MAX_QUESTIONS_PER_TEST)
        query = db.query(Question).filter(Question.topic == topic)
        
        if subtopic:
            query = query.filter(Question.subtopic == subtopic)
            
        questions = query.limit(num_q).all()
        
        # If database has fewer questions, fallback to all available questions for topic
        if len(questions) < num_q:
            questions = db.query(Question).filter(Question.topic == topic).limit(num_q).all()
            
        if not questions:
            # Fallback to any questions in DB
            questions = db.query(Question).limit(num_q).all()

        return questions
