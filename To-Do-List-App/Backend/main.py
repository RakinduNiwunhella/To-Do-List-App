# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import tasks

# Create all tables on startup (dev convenience — use Alembic in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Master AI API")

# ⚠️ CORS — allow your React dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)

@app.get("/")
def health_check():
    return {"status": "ok"}