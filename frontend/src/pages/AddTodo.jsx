import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/editTodo.css"; // Reusing same professional styling

export default function AddTodo() {
  const navigate = useNavigate();

  const [todo, setTodo] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "Low",
    completed: false,
  });

  const handleChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!todo.title.trim()) {
      alert("Please enter a title!");
      return;
    }

    await api.post("/todos/", todo);
    alert("🎉 Todo Added Successfully!");
    navigate("/todos");
  };

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h2 className="edit-title">📝 Add a New Todo</h2>

        <form onSubmit={submit}>
          <label>Todo Title</label>
          <input
            name="title"
            placeholder="Enter todo name"
            required
            value={todo.title}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Task details..."
            value={todo.description}
            onChange={handleChange}
          />

          <label>Due Date</label>
          <input
            type="date"
            name="due_date"
            required
            min={new Date().toISOString().split("T")[0]}
            value={todo.due_date}
            onChange={handleChange}
          />

          <label>Priority</label>
          <select
            name="priority"
            value={todo.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <div className="buttons">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/todos")}
            >
              ◀ Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={!todo.title.trim()}
            >
              ➕ Add Todo
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
