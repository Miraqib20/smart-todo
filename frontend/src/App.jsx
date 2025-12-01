import { Routes, Route, Navigate } from "react-router-dom";
import TodosPage from "./pages/TodosPage";
import AddTodo from "./pages/AddTodo";
import EditTodo from "./pages/EditTodo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { token } = useAuth(); 

  return (
    <div className="app-root">
      <main className="app-main">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/todos" /> : <Login />} />
          <Route path="/login" element={token ? <Navigate to="/todos" /> : <Login />} />
          <Route path="/signup" element={token ? <Navigate to="/todos" /> : <Signup />} />

          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <TodosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddTodo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditTodo />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
