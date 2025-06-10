import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import ChartPage from './pages/ChartPage';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/"
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/chart"
        element={
          <ProtectedRoute>
            <ChartPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
