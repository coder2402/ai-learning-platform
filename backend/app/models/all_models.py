import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    plan = Column(String(50), default="free") # free or premium
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    doubts = relationship("DoubtHistory", back_populates="user", cascade="all, delete-orphan")
    tests = relationship("Test", back_populates="user", cascade="all, delete-orphan")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False) # e.g. Calculus, Algebra
    description = Column(Text, nullable=True)
    
    subtopics = relationship("Subtopic", back_populates="topic", cascade="all, delete-orphan")
    theory = relationship("Theory", back_populates="topic", uselist=False)
    formula_sheet = relationship("FormulaSheet", back_populates="topic", uselist=False)

class Subtopic(Base):
    __tablename__ = "subtopics"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    name = Column(String(255), nullable=False)
    
    topic = relationship("Topic", back_populates="subtopics")

class Theory(Base):
    __tablename__ = "theory"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), unique=True, nullable=False)
    introduction = Column(Text, nullable=False)
    content = Column(Text, nullable=False) # Complete theory with LaTeX
    examples = Column(JSON, default=list) # List of example objects
    important_notes = Column(JSON, default=list)
    pdf_url = Column(String(512), nullable=True)
    
    topic = relationship("Topic", back_populates="theory")

class FormulaSheet(Base):
    __tablename__ = "formula_sheets"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    formulae = Column(JSON, default=list) # List of formula items
    identities = Column(JSON, default=list)
    short_notes = Column(Text, nullable=True)
    pdf_url = Column(String(512), nullable=True)

    topic = relationship("Topic", back_populates="formula_sheet")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(255), index=True, nullable=False)
    subtopic = Column(String(255), index=True, nullable=False)
    preamble = Column(Text, nullable=True)
    stem = Column(Text, nullable=False) # Question text
    math_expr = Column(Text, nullable=True)
    question_type = Column(String(50), nullable=False) # MCQ, MSQ, Numerical, etc.
    difficulty = Column(String(50), nullable=False) # Easy, Medium, Hard
    marks = Column(Integer, default=4)
    negative_marks = Column(Integer, default=1)
    estimated_time_mins = Column(Integer, default=3)
    question_image_url = Column(String(512), nullable=True)
    solution_image_url = Column(String(512), nullable=True)
    options = Column(JSON, default=list)
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    tags = Column(JSON, default=list)
    is_pyq = Column(Boolean, default=False)
    year = Column(Integer, nullable=True)

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    topic = Column(String(255), nullable=False)
    question_ids = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String(255), nullable=False)
    subtopic = Column(String(255), nullable=True)
    pattern = Column(String(100), default="jee-advanced")
    question_type = Column(String(50), default="single")
    difficulty = Column(String(50), default="Medium")
    num_questions = Column(Integer, default=10)
    duration_mins = Column(Integer, default=30)
    score = Column(Float, nullable=True)
    total_marks = Column(Float, nullable=True)
    status = Column(String(50), default="generated") # generated, completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="tests")
    test_questions = relationship("TestQuestion", back_populates="test", cascade="all, delete-orphan")

class TestQuestion(Base):
    __tablename__ = "test_questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    order = Column(Integer, nullable=False)
    
    student_answer = Column(Text, nullable=True)
    is_correct = Column(Boolean, nullable=True)
    marks_obtained = Column(Float, nullable=True)

    test = relationship("Test", back_populates="test_questions")

class DoubtHistory(Base):
    __tablename__ = "doubt_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    normalized_hash = Column(String(255), index=True, nullable=False)
    math_expr = Column(Text, nullable=True)
    image_url = Column(String(512), nullable=True)
    
    # AI Response JSON payload
    ai_response = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="doubts")

class GeneratedSolution(Base):
    __tablename__ = "generated_solutions"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), unique=True, nullable=False)
    solution_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
