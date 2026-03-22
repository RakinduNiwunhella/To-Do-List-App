# Backend/models.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    google_sub = Column(String, unique =True, index=True, nullable=False)
    email = Column(String, nullable=True)
    name = Column(String, nullable=True)
    tasks = relationship("Task", back_populates="owner", cascade="all, delete")

class Task(Base):
    __tablename__ = "tasks"

    id         = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    text       = Column(String, nullable=False)
    date_time  = Column(String, nullable=True)
    weather    = Column(String, nullable=True)
    position   = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    owner = relationship("User", back_populates="tasks")
    subtasks   = relationship("Subtask", back_populates="task", cascade="all, delete")

class Subtask(Base):
    __tablename__ = "subtasks"

    id        = Column(Integer, primary_key=True, index=True)
    task_id   = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"))
    text      = Column(String, nullable=False)
    links     = Column(Text, nullable=True)   # JSON string: [{"item":"flour","google":"...","amazon":"..."}]
    completed = Column(Boolean, default=False)
    task      = relationship("Task", back_populates="subtasks")