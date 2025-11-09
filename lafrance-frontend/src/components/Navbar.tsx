import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { role: userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true, state: { mensaje: "Sesión cerrada correctamente ✅" } });
  };

  return (
    <nav className="bg-[#0a1f44] text-white px-6 py-4 shadow-md font-serif">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 🔹 Logo */}
        <Link to="/">
          <img src="/img/logo-lafrance.png" alt="La France" className="h-10 w-auto" />
        </Link>

        {/* 🔸 Enlaces centrales */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          <li><Link to="/nosotros" className="hover:text-yellow-400 transition">Nosotros</Link></li>
          <li><Link to="/locales" className="hover:text-yellow-400 transition">Locales</Link></li>
          <li><Link to="/menu" className="hover:text-yellow-400 transition">Nuestro Menú</Link></li>
        </ul>

        {/* 🔸 Enlaces laterales */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium items-center">
          {userRole === "ADMIN" ? (
            <>
              <li><Link to="/admin" className="hover:text-yellow-400 transition">Panel Admin</Link></li>
              <li><button onClick={handleLogout} className="hover:text-red-400 transition">Cerrar sesión</button></li>
            </>
          ) : userRole === "CLIENTE" ? (
            <>
              <li><Link to="/menu" className="hover:text-yellow-400 transition">Menú</Link></li>
              <li><Link to="/reservas" className="hover:text-yellow-400 transition">Reservas</Link></li>
              <li><Link to="/pedidos" className="hover:text-yellow-400 transition">Pedidos</Link></li>
              <li><button onClick={handleLogout} className="hover:text-red-400 transition">Cerrar sesión</button></li>
            </>
          ) : (
            <li><Link to="/login" className="hover:text-yellow-400 transition">Login</Link></li>
          )}
        </ul>

        {/* 📱 Menú hamburguesa */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 📱 Menú desplegable móvil */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 space-y-2 text-sm"
        >
          <Link to="/nosotros" className="block hover:text-yellow-400">Nosotros</Link>
          <Link to="/locales" className="block hover:text-yellow-400">Locales</Link>
          <Link to="/carta" className="block hover:text-yellow-400">Nuestra Carta</Link>
          {userRole === "ADMIN" && (
            <>
              <Link to="/admin" className="block hover:text-yellow-400">Panel Admin</Link>
              <button onClick={handleLogout} className="block hover:text-red-400">Cerrar sesión</button>
            </>
          )}
          {userRole === "CLIENTE" && (
            <>
              <Link to="/menu" className="block hover:text-yellow-400">Menú</Link>
              <Link to="/reservas" className="block hover:text-yellow-400">Reservas</Link>
              <Link to="/pedidos" className="block hover:text-yellow-400">Pedidos</Link>
              <button onClick={handleLogout} className="block hover:text-red-400">Cerrar sesión</button>
            </>
          )}
          {!userRole && (
            <Link to="/login" className="block hover:text-yellow-400">Login</Link>
          )}
        </motion.div>
      )}
    </nav>
  );
}