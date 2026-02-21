# Backend/models.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Task(Base):
    __tablename__ = "tasks"

    id         = Column(Integer, primary_key=True, index=True)
    text       = Column(String, nullable=False)
    date_time  = Column(String, nullable=True)
    weather    = Column(String, nullable=True)
    position   = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    subtasks   = relationship("Subtask", back_populates="task", cascade="all, delete")

class Subtask(Base):
    __tablename__ = "subtasks"

    id        = Column(Integer, primary_key=True, index=True)
    task_id   = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"))
    text      = Column(String, nullable=False)
    links     = Column(Text, nullable=True)   # JSON string: [{"item":"flour","google":"...","amazon":"..."}]
    completed = Column(Boolean, default=False)
    task      = relationship("Task", back_populates="subtasks")