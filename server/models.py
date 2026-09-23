from pydantic import BaseModel
from typing import Optional


class ProblemCreate(BaseModel):
    title: Optional[str] = None
    platform: Optional[str] = None
    topic: str
    subtopic: Optional[str] = None
    difficulty: str
    time_taken_min: int
    status: str
    attempts: Optional[int] = 1
    confidence: Optional[int] = None
    hints_used: Optional[int] = 0
    mistake_type: Optional[str] = None


class Problem(ProblemCreate):
    id: int
    date_logged: str