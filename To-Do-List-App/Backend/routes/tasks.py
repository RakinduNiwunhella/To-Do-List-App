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

from auth import get_current_user
from models import Task, Subtask, User

@router.get("/", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Task).filter(Task.owner_id == current_user.id).order_by(Task.position).all()

@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    max_pos = db.query(Task).filter(Task.owner_id == current_user.id).count()
    db_task = Task(**task.model_dump(), owner_id=current_user.id, position=max_pos)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()

# Same pattern for patch and subtasks routes — add the Depends and filter by owner_id

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