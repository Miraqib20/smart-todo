import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPage.css";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await signup(form.email, form.password);
    if (ok.success) navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        {/* LEFT - Text/SignIn Redirect */}
        <div className="auth-right">
          <h2>Welcome Back!</h2>
          <p>Already have an account?</p>

          <Link to="/login">
            <button className="switch-btn">SIGN IN</button>
          </Link>
        </div>

        {/* RIGHT - Signup form */}
        <div className="auth-left">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtext">Join SmartTodo today!</p>

          <form onSubmit={submit}>
            <input
              type="email"
              className="auth-input"
              placeholder="Email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              className="auth-input"
              placeholder="Password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button className="auth-btn">SIGN UP</button>
          </form>

        </div>

      </div>
    </div>
  );
}
