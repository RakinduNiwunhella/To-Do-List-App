# backend/schemas.py
from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    """Shape of JSON React sends when creating a task."""
    text: str
    date_time: Optional[str] = None
    weather: Optional[str] = None

class TaskUpdate(BaseModel):
    """Shape of JSON React sends when editing/reordering."""
    text: Optional[str] = None
    date_time: Optional[str] = None
    weather: Optional[str] = None
    position: Optional[int] = None

class TaskResponse(BaseModel):
    """Shape of JSON FastAPI sends back to React."""
    id: int
    text: str
    date_time: Optional[str]
    weather: Optional[str]
    position: int

    class Config:
        from_attributes = True  # allows SQLAlchemy models to be serialized