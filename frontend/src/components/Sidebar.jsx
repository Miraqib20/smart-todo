import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTasks, FaPlusCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import "../styles/sidebar.css";

export default function Sidebar({ userName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = JSON.parse(localStorage.getItem("user"));
  const initials = userName ? userName.charAt(0).toUpperCase() : "U";
  const email = user?.email || "";

  const handleLogout = () => {
    if (!isOpen) return; // Block logout when sidebar is closed
    logout();
    navigate("/login", { replace: true });
  };

  const navigateWhenOpen = (route) => {
    if (!isOpen) return; // Prevent navigation when closed
    navigate(route);
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </button>

      {/* Avatar + Dropdown */}
      <div
        className="profile-container"
        onClick={() => isOpen && setShowProfile(!showProfile)}
      >
        <div className="avatar">{initials}</div>

        {showProfile && isOpen && (
          <div className="profile-dropdown">
            <p className="profile-name"><FaUser /> {userName}</p>
            <p className="profile-email">{email}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="nav-links">
        <button className="nav-btn" onClick={() => navigateWhenOpen("/todos")}>
          <FaTasks className="icon" />
          {isOpen && <span>My Todos</span>}
        </button>

        <button className="nav-btn" onClick={() => navigateWhenOpen("/add")}>
          <FaPlusCircle className="icon" />
          {isOpen && <span>Add Todo</span>}
        </button>
      </div>

      {/* Logout at Bottom */}
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />
        {isOpen && <span>Logout</span>}
      </button>
    </aside>
  );
}
