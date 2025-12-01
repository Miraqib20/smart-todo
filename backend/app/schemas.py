from pydantic import BaseModel, EmailStr
from datetime import date

# ---------- USER SCHEMAS ----------

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ---------- TODO SCHEMAS ----------

class TodoBase(BaseModel):
    title: str
    description: str | None = None
    due_date: date
    priority: str
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    pass

class TodoResponse(TodoBase):
    id: int
    user_id: int
