import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { role : userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true, state: { mensaje: "Sesión cerrada correctamente ✅" } });
  };

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">🍽️ La France</h1>

      <ul className="flex space-x-6 items-center">
        <li><Link to="/" className="hover:text-yellow-400">Inicio</Link></li>

        {userRole === "ADMIN" ? (
          <>
            <li><Link to="/admin" className="hover:text-yellow-400">Panel del Adminístrador</Link></li>
            <li><button onClick={handleLogout} className="hover:text-red-400">Cerrar sesión</button></li>
          </>
        ) : userRole === "CLIENTE" ? (
          <>
            <li><Link to="/menu" className="hover:text-yellow-400">Menú</Link></li>
            <li><Link to="/reservas" className="hover:text-yellow-400">Reservas</Link></li>
            <li><Link to="/pedidos" className="hover:text-yellow-400">Pedidos</Link></li>
            <li><button onClick={handleLogout} className="hover:text-red-400">Cerrar sesión</button></li>
          </>
        ) : (
          <li><Link to="/login" className="hover:text-yellow-400">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}
