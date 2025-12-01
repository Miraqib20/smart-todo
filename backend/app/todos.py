from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import pyodbc

from .database import get_db
from .schemas import TodoCreate, TodoUpdate, TodoResponse
from .deps import get_current_user_id

router = APIRouter(prefix="/todos", tags=["Todos"])


@router.post("/", response_model=dict)
def create_todo(
    todo: TodoCreate,
    db: pyodbc.Connection = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO Todos (title, description, due_date, priority, completed, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        todo.title, todo.description, todo.due_date,
        todo.priority, int(todo.completed), user_id
    )
    db.commit()
    return {"message": "Todo created"}


@router.get("/", response_model=List[TodoResponse])
def get_todos(
    db: pyodbc.Connection = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    cursor = db.cursor()
    cursor.execute(
        """
        SELECT id, title, description, due_date, priority, completed, user_id
        FROM Todos
        WHERE user_id = ?
        ORDER BY due_date
        """,
        user_id
    )
    rows = cursor.fetchall()
    return [
        TodoResponse(
            id=r[0], title=r[1], description=r[2],
            due_date=r[3], priority=r[4],
            completed=bool(r[5]), user_id=r[6]
        )
        for r in rows
    ]


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: int,
    db: pyodbc.Connection = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    cursor = db.cursor()
    cursor.execute(
        """
        SELECT id, title, description, due_date, priority, completed, user_id
        FROM Todos
        WHERE id = ? AND user_id = ?
        """,
        todo_id, user_id
    )
    r = cursor.fetchone()

    if not r:
        raise HTTPException(status_code=404, detail="Todo not found")

    return TodoResponse(
        id=r[0], title=r[1], description=r[2],
        due_date=r[3], priority=r[4],
        completed=bool(r[5]), user_id=r[6]
    )


@router.put("/{todo_id}", response_model=dict)
def update_todo(
    todo_id: int,
    todo: TodoUpdate,
    db: pyodbc.Connection = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    cursor = db.cursor()
    cursor.execute(
        "SELECT id FROM Todos WHERE id = ? AND user_id = ?",
        todo_id, user_id
    )
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Todo not found")

    cursor.execute(
        """
        UPDATE Todos
        SET title = ?, description = ?, due_date = ?, priority = ?, completed = ?
        WHERE id = ? AND user_id = ?
        """,
        todo.title, todo.description, todo.due_date,
        todo.priority, int(todo.completed), todo_id, user_id
    )
    db.commit()
    return {"message": "Todo updated"}


@router.delete("/{todo_id}", response_model=dict)
def delete_todo(
    todo_id: int,
    db: pyodbc.Connection = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    cursor = db.cursor()
    cursor.execute(
        "SELECT id FROM Todos WHERE id = ? AND user_id = ?",
        todo_id, user_id
    )
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Todo not found")

    cursor.execute(
        "DELETE FROM Todos WHERE id = ? AND user_id = ?",
        todo_id, user_id
    )
    db.commit()
    return {"message": "Todo deleted"}
