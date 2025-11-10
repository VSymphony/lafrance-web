import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, role: userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 🔐 Cerrar sesión
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🎞 Efecto al hacer scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 💡 Detectar si hay usuario autenticado (reacciona al AuthContext)
  const isLoggedIn = !!user;

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 font-serif border-b border-amber-800/30 transition-all duration-500
        ${scrolled ? "bg-[#f6efe0]/90 backdrop-blur-md py-2 shadow-md" : "bg-[#f8f3e7]/95 py-4 shadow-sm"}`}
      style={{
        backgroundImage: "url('/images/pergamino-textura.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        {/* 🥐 Logo animado */}
        <Link to="/" className="flex items-center space-x-3">
          <motion.img
            src="/img/logo-lafrance.png"
            alt="La France"
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`drop-shadow-md transition-all duration-500 ${scrolled ? "h-8" : "h-12"}`}
          />
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`font-bold tracking-wide text-[#3b1d0f] ${scrolled ? "text-xl" : "text-2xl"}`}
          >
            La France
          </motion.span>
        </Link>

        {/* 🔸 Enlaces escritorio */}
        <ul className="hidden md:flex space-x-8 text-lg text-[#4b1e05] items-center">
          {/* 🔓 Menú público */}
          {!isLoggedIn && (
            <>
              <li><Link to="/menu" className="hover:text-[#7a0000] transition">Menú</Link></li>
              <li><Link to="/nosotros" className="hover:text-[#7a0000] transition">Nosotros</Link></li>
              <li><Link to="/locales" className="hover:text-[#7a0000] transition">Locales</Link></li>
              <li>
                <Link
                  to="/login"
                  className="bg-[#7a0000] hover:bg-[#9b0d0d] text-white px-4 py-1 rounded-xl transition"
                >
                  Iniciar sesión
                </Link>
              </li>
            </>
          )}

          {/* 👑 Menú Admin */}
          {isLoggedIn && userRole === "ADMIN" && (
            <>
              <li><Link to="/admin" className="hover:text-[#7a0000] transition">Panel Admin</Link></li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-[#7a0000] hover:bg-[#9b0d0d] text-white px-4 py-1 rounded-xl transition"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          )}

          {/* 🍷 Menú Cliente */}
          {isLoggedIn && userRole === "CLIENTE" && (
            <>
              <li><Link to="/cliente" className="hover:text-[#7a0000] transition">Inicio</Link></li>
              <li><Link to="/menu" className="hover:text-[#7a0000] transition">Menú</Link></li>
              <li><Link to="/reservas" className="hover:text-[#7a0000] transition">Reservas</Link></li>
              <li><Link to="/pedidos" className="hover:text-[#7a0000] transition">Pedidos</Link></li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-[#7a0000] hover:bg-[#9b0d0d] text-white px-4 py-1 rounded-xl transition"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
        </ul>

        {/* 📱 Menú hamburguesa */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-7 h-7 text-[#4b1e05]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* 📱 Menú móvil */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#fdf6e3]/95 px-6 py-4 text-lg text-[#4b1e05] border-t border-amber-800/20"
        >
          <div className="space-y-3">
            {!isLoggedIn && (
              <>
                <Link to="/menu" className="block hover:text-[#7a0000]">Menú</Link>
                <Link to="/nosotros" className="block hover:text-[#7a0000]">Nosotros</Link>
                <Link to="/locales" className="block hover:text-[#7a0000]">Locales</Link>
                <Link to="/login" className="block bg-[#7a0000] text-white rounded-lg py-1 px-3 text-center">Iniciar sesión</Link>
              </>
            )}

            {isLoggedIn && userRole === "ADMIN" && (
              <>
                <Link to="/admin" className="block hover:text-[#7a0000]">Panel Admin</Link>
                <button
                  onClick={handleLogout}
                  className="block bg-[#7a0000] hover:bg-[#9b0d0d] text-white w-full rounded-lg py-1 px-3 text-center"
                >
                  Cerrar sesión
                </button>
              </>
            )}

            {isLoggedIn && userRole === "CLIENTE" && (
              <>
                <Link to="/cliente" className="block hover:text-[#7a0000]">Inicio</Link>
                <Link to="/menu" className="block hover:text-[#7a0000]">Menú</Link>
                <Link to="/reservas" className="block hover:text-[#7a0000]">Reservas</Link>
                <Link to="/pedidos" className="block hover:text-[#7a0000]">Pedidos</Link>
                <button
                  onClick={handleLogout}
                  className="block bg-[#7a0000] hover:bg-[#9b0d0d] text-white w-full rounded-lg py-1 px-3 text-center"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
