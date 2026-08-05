from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, Dict

# Auth & User
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    plan: str
    tests_completed: int
    doubts_asked: int
    assignments_completed: int

    class Config:
        from_attributes = True

# Doubt Solver Schemas
class DoubtRequest(BaseModel):
    question: str
    math_expr: Optional[str] = None
    image_base64: Optional[str] = None

class HintSchema(BaseModel):
    icon: str
    label: str
    step: str
    color: str
    body: str
    math: Optional[str] = None
    note: Optional[str] = None

class SolutionSchema(BaseModel):
    body: str
    math: str

class TopicLinkSchema(BaseModel):
    label: str
    sub: str
    to: str
    color: str

class DoubtResponse(BaseModel):
    question: str
    math_expr: Optional[str] = None
    hints: List[HintSchema]
    solution: SolutionSchema
    common_mistakes: Optional[str] = None
    topics: List[TopicLinkSchema]

# Test Generator Schemas
class TestGenerateRequest(BaseModel):
    topic: str
    subtopic: Optional[str] = None
    pattern: str = "jee-advanced"
    question_type: str = "single"
    difficulty: str = "Medium"
    num_questions: int = 10
    duration_mins: int = 30

class QuestionSchema(BaseModel):
    id: int
    topic: str
    subtopic: str
    preamble: Optional[str] = None
    stem: str
    math_expr: Optional[str] = None
    options: List[str]
    marks: str
    question_type: str

    class Config:
        from_attributes = True

class TestResponse(BaseModel):
    test_id: int
    topic: str
    duration_mins: int
    questions: List[QuestionSchema]

class SubmitTestRequest(BaseModel):
    answers: Dict[int, str] # question_id -> selected_option_or_text

class SolutionReviewSchema(BaseModel):
    question_id: int
    question_stem: str
    math_expr: Optional[str] = None
    student_answer: Optional[str] = None
    correct_answer: str
    is_correct: bool
    steps: List[str]
    common_mistake: Optional[str] = None
    topic: str
