import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { user, role: userRole, loading } = useAuth();

  // ⏳ Evita redirecciones tempranas
  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  // 🔐 Si no hay user ni token → redirige
  const token = localStorage.getItem("token");
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Validación por rol
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
