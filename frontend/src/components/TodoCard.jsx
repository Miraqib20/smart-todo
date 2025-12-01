import React from "react";

export default function TodoCard({ todo, onToggle, onDelete, onEdit }) {
  
  // Prevents crash if todo is undefined during initial render
  if (!todo) return null;

  return (
    <div className={`todo-card ${todo?.completed ? "completed" : ""}`}>

      <div className="todo-header">
        <h4 className="todo-title">{todo?.title || "Untitled Todo"}</h4>

        <button
          className="toggle-btn"
          onClick={onToggle}
          title={todo?.completed ? "Mark as Incomplete" : "Mark as Complete"}
        >
          {todo?.completed ? "✔️" : "⭕"}
        </button>
      </div>

      {/* Description */}
      {todo?.description && (
        <p className="todo-description">{todo.description}</p>
      )}

      {/* Due Date Display */}
      {todo?.due_date && (
        <p className="due-date">
          📅 Due: {new Date(todo.due_date).toLocaleDateString()}
        </p>
      )}

      <div className="todo-footer">
        {/* Priority Tag */}
        {todo?.priority && (
          <span className={`priority-tag ${todo.priority.toLowerCase()}`}>
            {todo.priority}
          </span>
        )}

        {/* Action Buttons */}
        <div className="todo-actions">
          <button className="edit-btn" onClick={onEdit} title="Edit Todo">
            ✏️
          </button>
          <button className="delete-btn" onClick={onDelete} title="Delete Todo">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
