import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { role: userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true, state: { mensaje: "Sesión cerrada correctamente ✅" } });
  };

  // 🔸 Detectar desplazamiento
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 font-serif shadow-md border-b border-amber-800/30 transition-all duration-500
        ${scrolled ? "bg-[#f6efe0]/90 backdrop-blur-md py-2" : "bg-[#f8f3e7]/95 py-4"}
      `}
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
            className={`drop-shadow-md transition-all duration-500 ${
              scrolled ? "h-8" : "h-12"
            }`}
          />
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`font-bold tracking-wide text-[#3b1d0f] ${
              scrolled ? "text-xl" : "text-2xl"
            }`}
          >
            La France
          </motion.span>
        </Link>

        {/* 🔸 Enlaces escritorio */}
        <ul className="hidden md:flex space-x-8 text-lg text-[#4b1e05]">
          {!userRole && (
            <>
              <li><Link to="/nosotros" className="hover:text-[#7a0000] transition">Nosotros</Link></li>
              <li><Link to="/locales" className="hover:text-[#7a0000] transition">Locales</Link></li>
              <li><Link to="/login" className="hover:text-[#7a0000] transition">Login</Link></li>
            </>
          )}
          {userRole === "ADMIN" && (
            <>
              <li><Link to="/admin" className="hover:text-[#7a0000] transition">Panel Admin</Link></li>
              <li><button onClick={handleLogout} className="hover:text-red-600 transition">Cerrar sesión</button></li>
            </>
          )}
          {userRole === "CLIENTE" && (
            <>
              <li><Link to="/cliente" className="hover:text-[#7a0000] transition">Inicio</Link></li>
              <li><Link to="/menu" className="hover:text-[#7a0000] transition">Menú</Link></li>
              <li><Link to="/reservas" className="hover:text-[#7a0000] transition">Reservas</Link></li>
              <li><Link to="/pedidos" className="hover:text-[#7a0000] transition">Pedidos</Link></li>
              <li><button onClick={handleLogout} className="hover:text-red-600 transition">Cerrar sesión</button></li>
            </>
          )}
        </ul>

        {/* 📱 Menú hamburguesa */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-7 h-7 text-[#4b1e05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
            {!userRole && (
              <>
                <Link to="/nosotros" className="block hover:text-[#7a0000]">Nosotros</Link>
                <Link to="/locales" className="block hover:text-[#7a0000]">Locales</Link>
                <Link to="/login" className="block hover:text-[#7a0000]">Login</Link>
              </>
            )}
            {userRole === "ADMIN" && (
              <>
                <Link to="/admin" className="block hover:text-[#7a0000]">Panel Admin</Link>
                <button onClick={handleLogout} className="block hover:text-red-600">Cerrar sesión</button>
              </>
            )}
            {userRole === "CLIENTE" && (
              <>
                <Link to="/cliente" className="block hover:text-[#7a0000]">Inicio</Link>
                <Link to="/menu" className="block hover:text-[#7a0000]">Menú</Link>
                <Link to="/reservas" className="block hover:text-[#7a0000]">Reservas</Link>
                <Link to="/pedidos" className="block hover:text-[#7a0000]">Pedidos</Link>
                <button onClick={handleLogout} className="block hover:text-red-600">Cerrar sesión</button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
