# backend/models.py
from sqlalchemy import Column, Integer, String, DateTime
from database import Base
import datetime

class Task(Base):
    __tablename__ = "tasks"

    id         = Column(Integer, primary_key=True, index=True)
    text       = Column(String, nullable=False)
    date_time  = Column(String, nullable=True)   # stored as formatted string
    weather    = Column(String, nullable=True)   # e.g. "☀️"
    position   = Column(Integer, default=0)      # for ordering (up/down)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)