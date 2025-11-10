import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Pedidos from "./pages/Pedidos";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ClienteDashboard from "./pages/ClienteDashboard";
import AdminCategorias from "./pages/AdminCategorias";
import AdminProductos from "./pages/AdminProductos";
import ClienteMenu from "./pages/ClienteMenu";
import AdminReservas from "./pages/AdminReservas";
import ClienteReservas from "./pages/ClienteReservas";
import Register from "./pages/Register";

// 🔒 Rutas privadas según rol
function PrivateRoute({ children, role }) {
  const { user, role: userRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Cliente */}
        <Route
          path="/cliente"
          element={
            <PrivateRoute role="CLIENTE">
              <ClienteDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservas"
          element={
            <PrivateRoute role="CLIENTE">
              <ClienteReservas />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <PrivateRoute role="CLIENTE">
              <Pedidos />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <PrivateRoute role="ADMIN">
              <AdminCategorias />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <PrivateRoute role="ADMIN">
              <AdminProductos />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reservas"
          element={
            <PrivateRoute role="ADMIN">
              <AdminReservas />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
