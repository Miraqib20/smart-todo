import { useEffect, useState } from "react";
import { api } from "../api";
import Sidebar from "../components/Sidebar";
import TodoCard from "../components/TodoCard";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const loadTodos = async () => {
    try {
      const response = await api.get("/todos");
      setTodos(response.data || []);
    } catch (e) {
      console.error("Failed to load todos");
    }
  };

  const toggleTask = async (todo) => {
    await api.put(`/todos/${todo.id}`, {
      ...todo,
      completed: !todo.completed,
    });
    loadTodos();
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/todos/${id}`);
    loadTodos();
  };

  const editTask = (id) => {
    navigate(`/edit/${id}`);
  };

  useEffect(() => {
    loadTodos();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) setUserName(user.name);
    else if (user?.email) setUserName(user.email.split("@")[0]);
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar included directly */}
      <Sidebar userName={userName} />

      <div className="dashboard-content">
        <div className="page-header">
          <h2 className="welcome-title">
            Welcome Back <span className="username">{userName}</span> 👋
          </h2>
          <p className="sub-text">Track your productivity and finish strong 💪</p>
        </div>

        <h3 className="section-title">My Todo</h3>

        {todos.length === 0 ? (
          <p className="empty-state">✨ No tasks yet... Add one to get started!</p>
        ) : (
          <div className="todo-grid">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTask(todo)}
                onDelete={() => deleteTask(todo.id)}
                onEdit={() => editTask(todo.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
