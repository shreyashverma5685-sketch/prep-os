from pydantic import BaseModel, field_validator
from typing import Optional

ALLOWED_DIFFICULTIES = ["Easy", "Medium", "Hard"]
ALLOWED_STATUSES = ["Solved", "Attempted", "Review Needed"]


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

    @field_validator("topic")
    @classmethod
    def normalize_topic(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("topic cannot be empty")
        return v[0].upper() + v[1:]

    @field_validator("difficulty")
    @classmethod
    def normalize_difficulty(cls, v: str) -> str:
        v = v.strip().title()
        if v not in ALLOWED_DIFFICULTIES:
            raise ValueError(f"difficulty must be one of {ALLOWED_DIFFICULTIES}")
        return v

    @field_validator("status")
    @classmethod
    def normalize_status(cls, v: str) -> str:
        v = v.strip().title()
        if v not in ALLOWED_STATUSES:
            raise ValueError(f"status must be one of {ALLOWED_STATUSES}")
        return v


class Problem(ProblemCreate):
    id: int
    date_logged: str