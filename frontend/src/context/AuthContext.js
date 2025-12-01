import { createContext, useContext, useState } from "react";
import { api } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const [token, setToken] = useState(storedToken || null);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { access_token, user: backendUser } = res.data;
      const safeUser = backendUser || { email };

      setToken(access_token);
      setUser(safeUser);

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(safeUser));

      return { success: true };
    } catch (error) {
      logout(); // 🔥 clear stale token if login fails
      return { success: false, message: "Invalid email or password" };
    }
  };

  const signup = async (email, password) => {
    try {
      const res = await api.post("/auth/signup", { email, password });

      const { access_token, user: backendUser } = res.data;
      const safeUser = backendUser || { email };

      setToken(access_token);
      setUser(safeUser);

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(safeUser));

      return { success: true };
    } catch (error) {
      return { success: false, message: "Signup failed" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
