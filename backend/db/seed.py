import sys
import os

# Ensure backend path is on sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import Base, engine, SessionLocal
from app.models.all_models import User, Topic, Subtopic, Theory, FormulaSheet, Question, Assignment
from app.core.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Create Default Student User
    if not db.query(User).filter(User.email == "student@math.com").first():
        user = User(
            name="Alex Sharma",
            email="student@math.com",
            hashed_password=get_password_hash("password123"),
            plan="free"
        )
        db.add(user)
        db.commit()

    # 2. Seed Topics & Subtopics
    topics_data = [
        {
            "name": "Calculus",
            "desc": "Limits, Continuity, Derivatives, Definite & Indefinite Integration, Differential Equations",
            "subs": ["Limits & Continuity", "Differentiation", "Application of Derivatives", "Indefinite Integration", "Definite Integration", "Differential Equations"]
        },
        {
            "name": "Algebra",
            "desc": "Quadratic Equations, Sequences, Binomial Theorem, Complex Numbers, Matrices",
            "subs": ["Quadratic Equations", "Sequences & Series", "Binomial Theorem", "Complex Numbers", "Matrices & Determinants"]
        },
        {
            "name": "Coordinate Geometry",
            "desc": "Straight Lines, Circles, Parabola, Ellipse, Hyperbola",
            "subs": ["Straight Lines", "Circles", "Parabola", "Ellipse", "Hyperbola"]
        },
        {
            "name": "Vectors & 3D",
            "desc": "Vector Algebra, Dot & Cross Product, 3D Geometry",
            "subs": ["Vectors Basics", "Dot & Cross Product", "3D Lines & Planes"]
        },
        {
            "name": "Trigonometry",
            "desc": "Trigonometric Ratios, Equations, Inverse Functions",
            "subs": ["Ratios & Identities", "Equations", "Inverse Trig Functions"]
        },
        {
            "name": "Probability",
            "desc": "Basic & Conditional Probability, Bayes Theorem, Random Variables",
            "subs": ["Basic Probability", "Bayes Theorem", "Binomial Distribution"]
        }
    ]

    for tdata in topics_data:
        topic = db.query(Topic).filter(Topic.name == tdata["name"]).first()
        if not topic:
            topic = Topic(name=tdata["name"], description=tdata["desc"])
            db.add(topic)
            db.commit()
            db.refresh(topic)

            for sub_name in tdata["subs"]:
                sub = Subtopic(topic_id=topic.id, name=sub_name)
                db.add(sub)
            db.commit()

    # 3. Seed Sample Questions Bank (Calculus, Algebra, etc.)
    sample_questions = [
        {
            "topic": "Calculus",
            "subtopic": "Definite Integration",
            "preamble": "Evaluate the definite integral using King's Property:",
            "stem": "Find the value of I = ∫₀^(π/2) ln(sin x) dx",
            "math_expr": "I = \\int_0^{\\pi/2} \\ln(\\sin x) dx",
            "question_type": "single",
            "difficulty": "Hard",
            "options": ["A) -(\\pi/2) ln 2", "B) (\\pi/2) ln 2", "C) -\\pi ln 2", "D) \\pi ln 2"],
            "correct_answer": "A) -(\\pi/2) ln 2",
            "explanation": "Substitute x -> pi/2 - x and add the two integrals to get 2I = integral ln(sin 2x / 2).",
            "is_pyq": True,
            "year": 2022
        },
        {
            "topic": "Calculus",
            "subtopic": "Limits & Continuity",
            "preamble": "Evaluate standard limit:",
            "stem": "Calculate lim(x->0) [sin(3x) / tan(5x)]",
            "math_expr": "\\lim_{x\\to 0} \\frac{\\sin 3x}{\\tan 5x}",
            "question_type": "single",
            "difficulty": "Easy",
            "options": ["A) 3/5", "B) 5/3", "C) 1", "D) 0"],
            "correct_answer": "A) 3/5",
            "explanation": "Multiply and divide by 3x and 5x to apply standard limits sin u / u -> 1.",
            "is_pyq": False
        },
        {
            "topic": "Algebra",
            "subtopic": "Complex Numbers",
            "preamble": "Using De Moivre's theorem:",
            "stem": "Find the principal argument of z = (1 + i)⁸.",
            "math_expr": "z = (1 + i)^8",
            "question_type": "single",
            "difficulty": "Medium",
            "options": ["A) 0", "B) \\pi", "C) \\pi/4", "D) 2\\pi"],
            "correct_answer": "A) 0",
            "explanation": "1 + i = sqrt(2) e^(i pi/4), so (1+i)^8 = 16 e^(i 2pi) = 16, which has argument 0.",
            "is_pyq": True,
            "year": 2021
        },
        {
            "topic": "Calculus",
            "subtopic": "Differentiation",
            "preamble": "Given derivative function:",
            "stem": "If f(x) = x^x for x > 0, calculate f'(1).",
            "math_expr": "f(x) = x^x, \\quad x > 0",
            "question_type": "single",
            "difficulty": "Easy",
            "options": ["A) 0", "B) 1", "C) e", "D) ln x + 1"],
            "correct_answer": "B) 1",
            "explanation": "Logarithmic differentiation gives f'(x) = x^x (ln x + 1). At x = 1, f'(1) = 1(0 + 1) = 1.",
            "is_pyq": False
        }
    ]

    for qdata in sample_questions:
        if not db.query(Question).filter(Question.stem == qdata["stem"]).first():
            q = Question(**qdata)
            db.add(q)
    db.commit()

    print("[Seed] Database seeding completed successfully!")

if __name__ == "__main__":
    seed_db()
