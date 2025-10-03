from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    """Schema untuk permintaan chat"""
    question: str


class ChatResponse(BaseModel):
    """Schema untuk response chat"""
    answer: str
    status: Optional[str] = "success"
