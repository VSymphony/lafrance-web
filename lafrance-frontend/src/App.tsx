import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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

// ...
<Route path="/registro" element={<Register />} />


export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservas" element={<ClienteReservas />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/cliente" element={<ClienteDashboard />} />
        <Route path="/admin/categorias" element={<AdminCategorias />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/menu-cliente" element={<ClienteMenu />} />
        <Route path="/admin/reservas" element={<AdminReservas />} />
        <Route path="/cliente/reservas" element={<ClienteReservas />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </AuthProvider>
  );
}
