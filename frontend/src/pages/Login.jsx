import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./AuthPage.css";

export default function Login() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (token) navigate("/todos");
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) navigate("/todos");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        {/* LEFT - Login */}
        <div className="auth-left">
          <h2 className="auth-title">Sign in to SmartTodo</h2>
          <p className="auth-subtext">Use your registered email</p>

          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              required
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              required
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button className="auth-btn">SIGN IN</button>
          </form>
        </div>

        {/* RIGHT - Message + Signup button */}
        <div className="auth-right">
          <h2>Hello, Friend! 👋</h2>
          <p>New to SmartTodo? Create your account and get started!</p>

          <Link to="/signup">
            <button className="switch-btn">SIGN UP</button>
          </Link>
        </div>

      </div>
    </div>
  );
}
