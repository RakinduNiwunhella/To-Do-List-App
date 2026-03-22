# Backend/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from sqlalchemy.orm import Session
from database import get_db
from models import User

bearer_scheme = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    # Ask Google to validate the access token and return the user's profile
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token}"},
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

    info = resp.json()
    google_sub = info.get("sub")
    if not google_sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not identify user")

    # Find or create the user in your DB
    user = db.query(User).filter(User.google_sub == google_sub).first()
    if not user:
        user = User(
            google_sub=google_sub,
            email=info.get("email"),
            name=info.get("name"),
            picture=info.get("picture"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user