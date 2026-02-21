# Backend/routes/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Task, Subtask
from schemas import TaskCreate, TaskUpdate, TaskResponse
from agent import generate_subtasks
from typing import List
import json

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).order_by(Task.position).all()

@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    max_pos = db.query(Task).count()
    db_task = Task(**task.model_dump(), position=max_pos)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)


    return db_task

@router.post("/{task_id}/subtasks", response_model=TaskResponse)
def create_subtasks(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    # Clear old subtasks before regenerating
    db.query(Subtask).filter(Subtask.task_id == task_id).delete()
    subtask_data = generate_subtasks(task.text)
    for s in subtask_data:
        db_subtask = Subtask(
            task_id=task.id,
            text=s["text"],
            links=json.dumps(s["links"]) if s["links"] else None,
        )
        db.add(db_subtask)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()

@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, updates: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task