import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { role: userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true, state: { mensaje: "Sesión cerrada correctamente ✅" } });
  };

  return (
    <nav className="bg-[#0a1f44] text-white px-6 py-4 shadow-md font-serif">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Marca */}
        <Link to="/">
          <img
            src="/img/logo-lafrance.png"
            alt="Restaurante La France"
            className="h-10 w-auto"
          />
        </Link>

        {/* Navegación */}
        <ul className="flex space-x-6 items-center text-sm font-medium">
          <li>
            <Link to="/" className="hover:text-yellow-400 transition">Inicio</Link>
          </li>

          {userRole === "ADMIN" ? (
            <>
              <li>
                <Link to="/admin" className="hover:text-yellow-400 transition">
                  Panel del Administrador
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:text-red-400 transition">
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : userRole === "CLIENTE" ? (
            <>
              <li>
                <Link to="/menu" className="hover:text-yellow-400 transition">Menú</Link>
              </li>
              <li>
                <Link to="/reservas" className="hover:text-yellow-400 transition">Reservas</Link>
              </li>
              <li>
                <Link to="/pedidos" className="hover:text-yellow-400 transition">Pedidos</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:text-red-400 transition">
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}