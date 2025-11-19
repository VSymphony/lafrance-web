import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, role: userRole, loading } = useAuth();

  // ⏳ Evita redirecciones antes de tiempo
  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  // ⛔ Si no hay token ni user, SÍ redirige
  const token = localStorage.getItem("token");
  if (!user && !token) {
    return <Navigate to="/login" />;
  }

  // 🔐 Restricción por rol
  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
