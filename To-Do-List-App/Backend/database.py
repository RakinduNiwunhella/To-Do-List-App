# backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
# SQLite for local dev  ↑  (no extra setup needed)
# swap to postgres later:  postgresql://user:pass@localhost/taskdb

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite only, remove for Postgres
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency — gives each request its own DB session, always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()