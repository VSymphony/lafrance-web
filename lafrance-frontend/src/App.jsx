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
import AdminReservas from "./pages/AdminReservas";
import AdminPedidos from "./pages/AdminPedidos";
import ClienteReservas from "./pages/ClienteReservas";
import Register from "./pages/Register";
import Carrito from "./pages/Carrito";
import DireccionPage from "./pages/DirectionPage";
import PrivateRoute from "./components/PrivateRoute";
import ConfirmacionPedido from "./pages/ConfirmacionPedido";
import { CartProvider } from "./context/CartContext";


export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
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
          <Route
            path="/carrito"
            element={
              <PrivateRoute role="CLIENTE">
                <Carrito />
              </PrivateRoute>
            }
          />
          <Route
            path="/carrito/direccion"
            element={
              <PrivateRoute role="CLIENTE">
                <DireccionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/carrito/confirmacion"
            element={
              <PrivateRoute role="CLIENTE">
                <ConfirmacionPedido />
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
          <Route
            path="/admin/pedidos"
            element={
              <PrivateRoute role="ADMIN">
                <AdminPedidos />
              </PrivateRoute>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
