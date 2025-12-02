import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/editTodo.css"; // <-- New CSS file

export default function EditTodo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "Low",
    completed: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await api.get(`/todos/${id}`);
        const data = res.data;
        data.due_date = data.due_date?.split("T")[0];
        setTodo(data);
      } catch (err) {
        console.log("Todo not found or unauthorized:", err);
        alert("Task not found!");
        navigate("/todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id, navigate]);

  const handleChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/todos/${id}`, todo);
      alert("Task updated successfully!");
      navigate("/todos");
    } catch (err) {
      alert("Failed to update task!");
      console.log(err.response?.data || err);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h2 className="edit-title">✏️ Edit Task</h2>

        <form onSubmit={submit}>

          <label>Task Title</label>
          <input
            name="title"
            required
            value={todo.title}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={todo.description || ""}
            onChange={handleChange}
          ></textarea>

          <label>Due Date</label>
          <input
            type="date"
            name="due_date"
            required
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
              ◀ Back
            </button>

            <button type="submit" className="save-btn">
              💾 Update Task
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
