# Backend/schemas.py
from pydantic import BaseModel
from typing import Optional, List, Any

class TaskCreate(BaseModel):
    text: str
    date_time: Optional[str] = None
    weather: Optional[str] = None

class TaskUpdate(BaseModel):
    text: Optional[str] = None
    date_time: Optional[str] = None
    weather: Optional[str] = None
    position: Optional[int] = None

class SubtaskResponse(BaseModel):
    id: int
    text: str
    links: Optional[str]   # raw JSON string — frontend parses it
    completed: bool

    class Config:
        from_attributes = True

class TaskResponse(BaseModel):
    id: int
    text: str
    date_time: Optional[str]
    weather: Optional[str]
    position: int
    subtasks: List[SubtaskResponse] = []

    class Config:
        from_attributes = True