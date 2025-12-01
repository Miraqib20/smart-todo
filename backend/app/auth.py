from fastapi import APIRouter, HTTPException, Depends, status
from jose import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os
import pyodbc

from .schemas import UserCreate, UserLogin
from .database import get_db

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# ✅ Use bcrypt (stable and installed)
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")


router = APIRouter(prefix="/auth", tags=["Auth"])


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_token(user_id: int):
    expiration = datetime.utcnow() + timedelta(days=1)
    payload = {
        "id": user_id,
        "exp": int(expiration.timestamp())  # 🔥 FIX: Must be INT
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


@router.post("/signup")
def signup(user: UserCreate, db: pyodbc.Connection = Depends(get_db)):
    cursor = db.cursor()

    cursor.execute("SELECT id FROM Users WHERE email = ?", user.email)
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)

    cursor.execute(
        "INSERT INTO Users (email, password) VALUES (?, ?)",
        (user.email, hashed_pw)
    )
    db.commit()

    cursor.execute("SELECT id FROM Users WHERE email = ?", user.email)
    user_id = cursor.fetchone()[0]

    token = create_token(user_id)
    return {
    "access_token": token,
    "token_type": "bearer",
    "user": {"email": user.email}
}



@router.post("/login")
def login(user: UserLogin, db: pyodbc.Connection = Depends(get_db)):
    cursor = db.cursor()

    cursor.execute("SELECT id, password FROM Users WHERE email = ?", user.email)
    record = cursor.fetchone()

    if not record:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    user_id, stored_pw = record

    if not verify_password(user.password, stored_pw):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_token(user_id)
    return {
    "access_token": token,
    "token_type": "bearer",
    "user": {"email": user.email}
}
